import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AthleteOccurrence, categorizeOccurrence, athleteOccurrences } from "@/data/athleteData";
import { useMemo } from "react";

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
    return null; // Ou um componente de carregamento/erro
  }

  const initials = athlete.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  
  const occurrencesByCategory = athlete.occurrences.reduce((acc, occ) => {
    const category = categorizeOccurrence(occ.OCORRÊNCIA);
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-foreground">{athlete.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  {athlete.category}
                </Badge>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              &times;
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{athlete.occurrenceCount}</div>
              <div className="text-sm text-muted-foreground">Ocorrências</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">R$ {athlete.totalValue}</div>
              <div className="text-sm text-muted-foreground">Total em Multas</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Categorias de Ocorrências:</h4>
            {Object.entries(occurrencesByCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{category}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-foreground">Últimas Ocorrências:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {athlete.occurrences.slice(0, 5).map((occ, index) => (
                <div key={index} className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                  <div className="font-medium">{categorizeOccurrence(occ.OCORRÊNCIA)}</div>
                  <div className="truncate">{occ.OCORRÊNCIA}</div>
                  <div className="flex justify-between mt-1">
                    <span>Data: {occ.DATA}</span>
                    <span className="text-accent">R$ {occ.Valor}</span>
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

