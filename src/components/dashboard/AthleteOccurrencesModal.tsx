import React from 'react';
import { X, User, AlertCircle, DollarSign } from 'lucide-react';
import { AthleteOccurrence } from '../../data/athleteData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AthleteOccurrencesModalProps {
  athleteName: string;
  occurrences: AthleteOccurrence[];
  onClose: () => void;
}

// Função auxiliar para converter número de série do Excel para data
const excelSerialDateToJSDate = (serial: string): Date | null => {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel considera 30/12/1899 como dia 0
  const serialNumber = parseInt(serial, 10);
  if (isNaN(serialNumber)) {
    return null;
  }
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const jsDate = new Date(excelEpoch.getTime() + serialNumber * millisecondsPerDay);
  return jsDate;
};

export const AthleteOccurrencesModal: React.FC<AthleteOccurrencesModalProps> = ({
  athleteName,
  occurrences,
  onClose,
}) => {
  const initials = athleteName.split(' ').map(n => n[0]).join('').slice(0, 2);
  const firstOccurrence = occurrences[0];
  const fotoUrl = firstOccurrence?.fotoUrl;
  const category = firstOccurrence?.Cat || 'N/A';
  const totalValue = occurrences.reduce((sum, occ) => sum + parseInt(occ.VALOR), 0);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold text-red-600">
            Ocorrências de {athleteName}
          </DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </DialogHeader>
        
        {/* Cabeçalho com foto e informações do atleta */}
        <div className="bg-gradient-to-r from-red-50 to-white border border-red-100 rounded-lg p-6 mb-4">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24 rounded-lg border-3 border-red-200">
              {fotoUrl ? (
                <AvatarImage 
                  src={fotoUrl} 
                  alt={`Foto de ${athleteName}`}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-red-100 text-red-700 font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{athleteName}</h2>
              <div className="flex items-center space-x-4 mb-3">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  <User className="h-4 w-4 mr-1" />
                  {category}
                </Badge>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-gray-700">
                    {occurrences.length} ocorrência{occurrences.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">
                    Total: R$ {totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {occurrences.length === 0 ? (
          <p className="text-gray-600">Nenhuma ocorrência encontrada para este atleta.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {occurrences.map((occurrence, index) => {
              const jsDate = excelSerialDateToJSDate(occurrence.DATA);
              const formattedDate = jsDate ? format(jsDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data Inválida';

              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-red-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500 font-medium">Data: {formattedDate}</p>
                    <span className="text-sm font-bold text-red-600">R$ {occurrence.Valor}</span>
                  </div>
                  <p className="font-medium text-gray-900 leading-relaxed">{occurrence.OCORRÊNCIA}</p>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


