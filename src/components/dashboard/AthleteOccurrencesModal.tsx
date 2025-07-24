import React from 'react';
import { X } from 'lucide-react';
import { AthleteOccurrence } from '../../data/athleteData';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Ocorrências de {athleteName}</h2>
        
        {occurrences.length === 0 ? (
          <p className="text-gray-600">Nenhuma ocorrência encontrada para este atleta.</p>
        ) : (
          <div className="space-y-4">
            {occurrences.map((occurrence, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-500">Data: {occurrence.DATA}</p>
                <p className="font-medium">Ocorrência: {occurrence.OCORRÊNCIA}</p>
                <p className="text-sm text-gray-700">Valor: R$ {occurrence.Valor}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


