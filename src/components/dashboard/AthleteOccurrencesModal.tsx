import React from 'react';
import { X } from 'lucide-react';
import { AthleteOccurrence } from '../../data/athleteData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AthleteOccurrencesModalProps {
  athleteName: string;
  occurrences: AthleteOccurrence[];
  onClose: () => void;
}

export const AthleteOccurrencesModal: React.FC<AthleteOccurrencesModalProps> = ({
  athleteName,
  occurrences,
  onClose,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Ocorrências de {athleteName}
          </DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </DialogHeader>
        
        {occurrences.length === 0 ? (
          <p className="text-gray-600">Nenhuma ocorrência encontrada para este atleta.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {occurrences.map((occurrence, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500">Data: {occurrence.DATA}</p>
                <p className="font-medium">Ocorrência: {occurrence.OCORRÊNCIA}</p>
                <p className="text-sm text-gray-700">Valor: R$ {occurrence.Valor}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


