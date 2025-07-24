import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AthleteOccurrence } from "@/data/athleteData";
import { useMemo } from "react";
import { X, User, Calendar, AlertTriangle } from "lucide-react";

interface CategoryListModalProps {
  categoryName: string;
  occurrences: AthleteOccurrence[];
  onClose: () => void;
  onAthleteClick: (athleteName: string) => void;
}

interface AthleteOccurrencesByCategory {
  name: string;
  category: string;
  totalOccurrences: number;
  totalValue: number;
  lastOccurrenceDate: string;
}

export function CategoryListModal({ categoryName, occurrences, onClose, onAthleteClick }: CategoryListModalProps) {
  const athletesWithOccurrences = useMemo(() => {
    // Filtrar ocorrências por categoria
    const filteredOccurrences = occurrences.filter(occ => {
      return occ.TIPO === categoryName;
    });

    // Agrupar por atleta
    const athleteMap = new Map<string, AthleteOccurrencesByCategory>();
    
    filteredOccurrences.forEach(occ => {
      const key = occ.NOME;
      if (!athleteMap.has(key)) {
        athleteMap.set(key, {
          name: occ.NOME,
          category: occ.Cat,
          totalOccurrences: 0,
          totalValue: 0,
          lastOccurrenceDate: occ.DATA
        });
      }
      
      const athlete = athleteMap.get(key)!;
      athlete.totalOccurrences += 1;
      athlete.totalValue += parseInt(occ.VALOR);
      
      // Atualizar com a data mais recente (assumindo que DATA é um número serial)
      if (parseInt(occ.DATA) > parseInt(athlete.lastOccurrenceDate)) {
        athlete.lastOccurrenceDate = occ.DATA;
      }
    });

    return Array.from(athleteMap.values()).sort((a, b) => b.totalOccurrences - a.totalOccurrences);
  }, [categoryName]);

  // Converter data serial para formato legível
  const formatDate = (serialDate: string): string => {
    const date = new Date((parseInt(serialDate) - 25569) * 86400 * 1000);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <Card 
        className="bg-white border border-red-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
        style={{
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center space-x-2">
                  <span>Atletas com {categoryName}</span>
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {athletesWithOccurrences.length} atleta(s) com ocorrências desta categoria
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-red-50 rounded-full transition-colors group"
            >
              <X className="h-6 w-6 text-gray-500 group-hover:text-red-600" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {athletesWithOccurrences.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nenhum atleta com ocorrências de {categoryName} encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {athletesWithOccurrences.map((athlete, index) => {
                const initials = athlete.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                
                return (
                  <Card 
                    key={index}
                    className="cursor-pointer transition-all duration-300 group bg-white border border-red-100 hover:border-red-200 hover:shadow-lg"
                    onClick={() => onAthleteClick(athlete.name)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(229, 5, 15, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-red-100 group-hover:border-red-200 transition-colors">
                          <AvatarFallback className="bg-red-50 text-red-700 font-bold group-hover:bg-red-100 transition-colors">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-red-700 transition-colors">
                            {athlete.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                            >
                              <User className="h-3 w-3 mr-1" />
                              {athlete.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="flex items-center justify-end space-x-1">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-xl font-bold text-red-600">
                              {athlete.totalOccurrences}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Ocorrências
                          </div>
                          
                          <div className="text-sm font-bold text-gray-700">
                            R$ {athlete.totalValue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Valor Total
                          </div>
                          
                          <div className="flex items-center justify-end space-x-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(athlete.lastOccurrenceDate)}</span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            Última Ocorrência
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

