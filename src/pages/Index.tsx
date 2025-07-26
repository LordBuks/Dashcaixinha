import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { OccurrenceChart } from '../components/dashboard/OccurrenceChart';
import { AthleteListModal } from '../components/dashboard/AthleteListModal';
import { CategoryAthleteModal } from '../components/dashboard/CategoryAthleteModal';
import { AthleteOccurrencesModal } from '../components/dashboard/AthleteOccurrencesModal';
import MonthSelector from '../components/MonthSelector';
import { getAllUserOccurrences, getUserMonthData, getUserAvailableMonths, loadLocalMonthlyData } from '../data/firebaseDataLoader';
import { AthleteOccurrence } from '../data/athleteData';

const Index = () => {
  const { user } = useAuth();
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAthleteForOccurrences, setSelectedAthleteForOccurrences] = useState<string | null>(null);

  // Estados para o sistema de meses
  const [availableMonths, setAvailableMonths] = useState<{month: string, year: number}[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [currentData, setCurrentData] = useState<AthleteOccurrence[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar meses disponíveis e dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Tenta carregar dados do Firebase primeiro
        let months = await getUserAvailableMonths(user.uid);
        let allData: AthleteOccurrence[] = [];
        
        if (months.length > 0) {
          // Se há dados no Firebase, usa eles
          setAvailableMonths(months);
          allData = await getAllUserOccurrences(user.uid);
        } else {
          // Fallback para dados locais (para desenvolvimento/demonstração)
          console.log('Nenhum dado encontrado no Firebase, usando dados locais para demonstração');
          const localData = await loadLocalMonthlyData();
          const localMonths = localData.map(data => ({ month: data.month, year: data.year }));
          setAvailableMonths(localMonths);
          
          // Consolida todos os dados locais
          allData = localData.flatMap(monthData => monthData.data);
        }
        
        setCurrentData(allData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Em caso de erro, tenta carregar dados locais
        try {
          const localData = await loadLocalMonthlyData();
          const localMonths = localData.map(data => ({ month: data.month, year: data.year }));
          setAvailableMonths(localMonths);
          setCurrentData(localData.flatMap(monthData => monthData.data));
        } catch (localError) {
          console.error('Erro ao carregar dados locais:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Atualizar dados quando o mês selecionado mudar
  useEffect(() => {
    const loadMonthData = async () => {
      if (!user || selectedMonth === 'all') return;
      
      setLoading(true);
      try {
        // Tenta carregar do Firebase primeiro
        let monthData = await getUserMonthData(user.uid, selectedMonth, selectedYear);
        
        if (monthData.length === 0) {
          // Fallback para dados locais
          const localData = await loadLocalMonthlyData();
          const localMonthData = localData.find(data => 
            data.month === selectedMonth && data.year === selectedYear
          );
          monthData = localMonthData ? localMonthData.data : [];
        }
        
        setCurrentData(monthData);
      } catch (error) {
        console.error('Erro ao carregar dados do mês:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedMonth !== 'all') {
      loadMonthData();
    } else if (user) {
      // Recarregar todos os dados quando 'all' for selecionado
      const loadAllData = async () => {
        setLoading(true);
        try {
          let allData = await getAllUserOccurrences(user.uid);
          
          if (allData.length === 0) {
            // Fallback para dados locais
            const localData = await loadLocalMonthlyData();
            allData = localData.flatMap(monthData => monthData.data);
          }
          
          setCurrentData(allData);
        } catch (error) {
          console.error('Erro ao carregar todos os dados:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadAllData();
    }
  }, [selectedMonth, selectedYear, user]);

  // Dados filtrados baseados nos filtros atuais
  const filteredData = useMemo(() => {
    return currentData.filter(occurrence => {
      const matchesSearch = occurrence.NOME.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || occurrence.CAT === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [currentData, searchTerm, categoryFilter]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const uniqueAthletes = new Set(filteredData.map(occ => occ.NOME));
    const totalValue = filteredData.reduce((sum, occ) => sum + parseInt(occ.VALOR), 0);
    const categories = new Set(filteredData.map(occ => occ.CAT));
    
    return {
      totalOccurrences: filteredData.length,
      uniqueAthletes: uniqueAthletes.size,
      totalValue,
      categories: categories.size
    };
  }, [filteredData]);

  // Dados para gráficos
  const chartData = useMemo(() => {
    const categoryCount = filteredData.reduce((acc, occ) => {
      acc[occ.CAT] = (acc[occ.CAT] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      value: filteredData
        .filter(occ => occ.CAT === category)
        .reduce((sum, occ) => sum + parseInt(occ.VALOR), 0)
    }));
  }, [filteredData]);

  // Top atletas por ocorrências
  const topAthletes = useMemo(() => {
    const athleteCount = filteredData.reduce((acc, occ) => {
      if (!acc[occ.NOME]) {
        acc[occ.NOME] = { count: 0, value: 0, category: occ.CAT };
      }
      acc[occ.NOME].count++;
      acc[occ.NOME].value += parseInt(occ.VALOR);
      return acc;
    }, {} as Record<string, { count: number; value: number; category: string }>);

    return Object.entries(athleteCount)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredData]);

  // Categorias únicas para o filtro
  const categories = useMemo(() => {
    return Array.from(new Set(currentData.map(occ => occ.CAT))).sort();
  }, [currentData]);

  // Handlers para modais
  const handleAthleteClick = (athleteName: string) => {
    setSelectedAthleteForOccurrences(athleteName);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSchoolClick = (school: string) => {
    setSelectedSchool(school);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Dashboard Principal</h1>
          <p className="text-gray-600 font-bold">Visão geral das ocorrências e estatísticas</p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Dados de: {user.displayName || user.email}
            </p>
          )}
        </div>

        {/* Seletor de Mês */}
        <MonthSelector
          availableMonths={availableMonths}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Ocorrências"
            value={stats.totalOccurrences}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Atletas Únicos"
            value={stats.uniqueAthletes}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Valor Total"
            value={`R$ ${stats.totalValue.toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Categorias"
            value={stats.categories}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Atleta
              </label>
              <input
                type="text"
                placeholder="Digite o nome do atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Categoria
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gráficos e Listas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Ocorrências por Categoria */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Ocorrências por Categoria</h2>
            <OccurrenceChart data={chartData} onCategoryClick={handleCategoryClick} />
          </div>

          {/* Top 10 Atletas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 10 Atletas</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {topAthletes.map((athlete, index) => (
                <div 
                  key={athlete.name} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleAthleteClick(athlete.name)}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-red-600 mr-2">{index + 1}º</span>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-red-200 text-red-800 text-sm">
                        {athlete.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{athlete.name}</p>
                      <p className="text-xs text-gray-500">{athlete.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">{athlete.count} ocorrências</p>
                    <p className="text-xs text-gray-500">R$ {athlete.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modais */}
        <AthleteListModal
          isOpen={!!selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
          athletes={topAthletes}
          title="Lista de Atletas"
        />

        <CategoryAthleteModal
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
          category={selectedCategory || ""}
          athletes={filteredData.filter(occ => occ.CAT === selectedCategory)}
        />

        <AthleteOccurrencesModal
          isOpen={!!selectedAthleteForOccurrences}
          onClose={() => setSelectedAthleteForOccurrences(null)}
          athleteName={selectedAthleteForOccurrences || ""}
          occurrences={filteredData.filter(occ => occ.NOME === selectedAthleteForOccurrences)}
        />
      </div>
    </div>
  );
};

export default Index;

