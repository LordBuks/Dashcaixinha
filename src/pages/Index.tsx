import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { AthleteCard } from "@/components/dashboard/AthleteCard";
import { OccurrenceChart } from "@/components/dashboard/OccurrenceChart";
import { AthleteProfile } from "@/components/dashboard/AthleteProfile";
import { athleteOccurrences, extractSchool, categorizeOccurrence } from "@/data/athleteData";
import { 
  Users, 
  AlertTriangle, 
  DollarSign, 
  GraduationCap,
  Search,
  Filter,
  TrendingUp
} from "lucide-react";

const Index = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Processar dados dos atletas
  const athleteStats = useMemo(() => {
    const stats = new Map();
    
    athleteOccurrences.forEach(occ => {
      const key = occ.NOME;
      if (!stats.has(key)) {
        stats.set(key, {
          name: occ.NOME,
          category: occ.Cat,
          occurrences: [],
          totalValue: 0,
          occurrenceCount: 0
        });
      }
      
      const athlete = stats.get(key);
      athlete.occurrences.push(occ);
      athlete.totalValue += parseInt(occ.Valor);
      athlete.occurrenceCount += 1;
    });
    
    return Array.from(stats.values())
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }, []);

  // Filtrar atletas
  const filteredAthletes = useMemo(() => {
    return athleteStats.filter(athlete => {
      const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || athlete.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [athleteStats, searchTerm, categoryFilter]);

  // Estatísticas gerais
  const totalOccurrences = athleteOccurrences.length;
  const totalAthletes = athleteStats.length;
  const totalValue = athleteOccurrences.reduce((sum, occ) => sum + parseInt(occ.Valor), 0);
  const averagePerAthlete = Math.round(totalValue / totalAthletes);

  // Dados para gráficos
  const occurrenceByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    athleteOccurrences.forEach(occ => {
      const category = categorizeOccurrence(occ.OCORRÊNCIA);
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const schoolStats = useMemo(() => {
    const schools: Record<string, number> = {};
    athleteOccurrences.forEach(occ => {
      const school = extractSchool(occ.OCORRÊNCIA);
      schools[school] = (schools[school] || 0) + 1;
    });
    
    return Object.entries(schools)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const categoryStats = useMemo(() => {
    const categories: Record<string, number> = {};
    athleteStats.forEach(athlete => {
      categories[athlete.category] = (categories[athlete.category] || 0) + 1;
    });
    
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value: value as number }))
      .sort((a, b) => b.value - a.value);
  }, [athleteStats]);

  const categories = [...new Set(athleteStats.map(athlete => athlete.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Painel de Controle Disciplinar
        </h1>
        <p className="text-muted-foreground">
          Monitoramento e análise de ocorrências disciplinares dos atletas alojados
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Atletas"
          value={totalAthletes}
          icon={Users}
          description="Atletas com ocorrências"
        />
        <StatCard
          title="Total de Ocorrências"
          value={totalOccurrences}
          icon={AlertTriangle}
          description="Registradas no período"
        />
        <StatCard
          title="Valor Total"
          value={`R$ ${totalValue.toLocaleString()}`}
          icon={DollarSign}
          description="Em multas aplicadas"
        />
        <StatCard
          title="Média por Atleta"
          value={`R$ ${averagePerAthlete}`}
          icon={TrendingUp}
          description="Valor médio de multas"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OccurrenceChart
          data={occurrenceByCategory}
          title="Ocorrências por Categoria"
          type="pie"
        />
        <OccurrenceChart
          data={schoolStats}
          title="Ocorrências por Local/Escola"
          type="bar"
        />
      </div>

      {/* Filtros e Lista de Atletas */}
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span>Ranking de Atletas</span>
          </CardTitle>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar atleta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAthletes.map((athlete, index) => (
              <AthleteCard
                key={athlete.name}
                name={athlete.name}
                category={athlete.category}
                occurrenceCount={athlete.occurrenceCount}
                totalValue={athlete.totalValue}
                isSelected={selectedAthlete === athlete.name}
                onClick={() => setSelectedAthlete(athlete.name)}
              />
            ))}
          </div>
          
          {filteredAthletes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum atleta encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Modal */}
      {selectedAthlete && (
        <AthleteProfile
          athleteName={selectedAthlete}
          onClose={() => setSelectedAthlete(null)}
        />
      )}
    </div>
  );
};

export default Index;
