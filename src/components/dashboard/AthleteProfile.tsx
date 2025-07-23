import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AthleteOccurrence, categorizeOccurrence, athleteOccurrences } from "@/data/athleteData";
import { useMemo } from "react";
import { X, User, AlertTriangle, DollarSign, Calendar, FileText } from "lucide-react";

interface AthleteProfileProps {
  athleteName: string;
  onClose: () => void;
}

export function AthleteProfile({ athleteName, onClose }: AthleteProfileProps) {
  const athlete = useMemo(() => {
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
      const currentAthlete = stats.get(key);
      currentAthlete.occurrences.push(occ);
      currentAthlete.totalValue += parseInt(occ.Valor);
      currentAthlete.occurrenceCount += 1;
    });
    return Array.from(stats.values()).find(a => a.name === athleteName);
  }, [athleteName]);

  if (!athlete) {
    return null;
  }

  const initials = athlete.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  
  const occurrencesByCategory = athlete.occurrences.reduce((acc, occ) => {
    const category = categorizeOccurrence(occ.OCORRÊNCIA);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="bg-white border border-red-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-3 border-red-200 shadow-lg">
                <AvatarFallback className="bg-red-100 text-red-700 font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center space-x-2">
                  <User className="h-6 w-6 text-red-600" />
                  <span>{athlete.name}</span>
                </CardTitle>
                <Badge variant="secondary" className="mt-2 bg-red-100 text-red-700 hover:bg-red-200">
                  {athlete.category}
                </Badge>
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
          {/* Estatísticas Principais */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <div className="text-3xl font-bold text-red-600">{athlete.occurrenceCount}</div>
              </div>
              <div className="text-sm font-medium text-gray-600">Total de Ocorrências</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-gray-600 mr-2" />
                <div className="text-3xl font-bold text-gray-700">R$ {athlete.totalValue.toLocaleString()}</div>
              </div>
              <div className="text-sm font-medium text-gray-600">Total em Multas</div>
            </div>
          </div>
          
          {/* Categorias de Ocorrências */}
          <div className="mb-8">
            <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 text-red-600 mr-2" />
              Categorias de Ocorrências
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(occurrencesByCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <Badge variant="outline" className="bg-white border-red-200 text-red-700 font-bold">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas Ocorrências */}
          <div>
            <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-red-600 mr-2" />
              Últimas Ocorrências
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {athlete.occurrences.slice(0, 8).map((occ, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-red-200 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-red-600 text-sm">
                      {categorizeOccurrence(occ.OCORRÊNCIA)}
                    </div>
                    <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
                      R$ {occ.Valor}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700 mb-2 leading-relaxed">
                    {occ.OCORRÊNCIA}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Data: {occ.DATA}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

