import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AthleteCard } from "./AthleteCard";
import { AthleteOccurrence } from "@/data/athleteData";
import { Search, X } from "lucide-react";
import { AthleteOccurrencesModal } from "./AthleteOccurrencesModal";

interface CategoryAthleteModalProps {
  categoryName: string;
  occurrences: AthleteOccurrence[];
  onClose: () => void;
}

export function CategoryAthleteModal({ categoryName, occurrences, onClose }: CategoryAthleteModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAthleteOccurrences, setSelectedAthleteOccurrences] = useState<AthleteOccurrence[] | null>(null);
  const [selectedAthleteName, setSelectedAthleteName] = useState<string | null>(null);

  // Filtrar atletas que têm ocorrências da categoria específica
  const athletesInCategory = useMemo(() => {
    const athleteStats = new Map();
    
    occurrences.forEach(occ => {
      const category = occ.TIPO;
      if (category === categoryName) {
        const key = occ.NOME;
        if (!athleteStats.has(key)) {
          athleteStats.set(key, {
            name: occ.NOME,
            category: occ.Cat,
            occurrences: [],
            totalValue: 0,
            occurrenceCount: 0,
            fotoUrl: occ.fotoUrl
          });
        }
        
        const athlete = athleteStats.get(key);
        athlete.occurrences.push(occ);
        athlete.totalValue += parseInt(occ.VALOR);
        athlete.occurrenceCount += 1;
        // Atualiza fotoUrl se não existir ainda
        if (!athlete.fotoUrl && occ.fotoUrl) {
          athlete.fotoUrl = occ.fotoUrl;
        }
      }
    });
    
    return Array.from(athleteStats.values())
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }, [categoryName, occurrences]);

  // Filtrar atletas por termo de busca
  const filteredAthletes = useMemo(() => {
    return athletesInCategory.filter(athlete =>
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [athletesInCategory, searchTerm]);

  const handleAthleteClick = (athleteName: string) => {
    const athleteAllOccurrences = occurrences.filter(occ => occ.NOME === athleteName);
    setSelectedAthleteOccurrences(athleteAllOccurrences);
    setSelectedAthleteName(athleteName);
  };

  const handleCloseAthleteOccurrencesModal = () => {
    setSelectedAthleteOccurrences(null);
    setSelectedAthleteName(null);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-bold text-red-600">
              Atletas com ocorrências por "{categoryName}"
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Barra de busca */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar atleta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-red-100 focus:border-red-300 focus:ring-red-200"
            />
          </div>

          {/* Lista de atletas */}
          <div className="flex-1 overflow-y-auto">
            {filteredAthletes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-2">
                {filteredAthletes.map((athlete) => (
                  <AthleteCard
                    key={athlete.name}
                    name={athlete.name}
                    category={athlete.category}
                    occurrenceCount={athlete.occurrenceCount}
                    totalValue={athlete.totalValue}
                    isSelected={false}
                    onClick={() => handleAthleteClick(athlete.name)}
                    className="inter-hover-effect cursor-pointer"
                    fotoUrl={athlete.fotoUrl}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {searchTerm 
                    ? "Nenhum atleta encontrado com o termo de busca." 
                    : `Nenhum atleta encontrado para a categoria "${categoryName}".`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Rodapé com estatísticas */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                {filteredAthletes.length} atleta{filteredAthletes.length !== 1 ? 's' : ''}
                {searchTerm && ` encontrado${filteredAthletes.length !== 1 ? 's' : ''}`}
              </span>
              <span>
                Categoria: {categoryName}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedAthleteOccurrences && selectedAthleteName && (
        <AthleteOccurrencesModal
          athleteName={selectedAthleteName}
          occurrences={selectedAthleteOccurrences}
          onClose={handleCloseAthleteOccurrencesModal}
        />
      )}
    </>
  );
}


