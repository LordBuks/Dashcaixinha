import { AthleteOccurrence } from '../data/athleteData';

// Função para normalizar os dados para o formato esperado
export const normalizeData = (data: any[]): AthleteOccurrence[] => {
  if (!data || data.length === 0) return [];
  
  return data.map(item => {
    let normalizedDate: number;
    
    // Verifica se DATA é uma string no formato DD/MM/YY
    if (typeof item.DATA === 'string') {
      const [day, month, year] = item.DATA.split('/').map(Number);
      // Converte ano de 2 dígitos para 4 dígitos (assumindo 20XX)
      const fullYear = year < 100 ? 2000 + year : year;
      normalizedDate = new Date(fullYear, month - 1, day).getTime();
    } else {
      // Se DATA já é um número (timestamp ou serial), usa diretamente
      normalizedDate = item.DATA;
    }

    return {
      NOME: item.NOME,
      CAT: item.Cat || item.CAT, // Prioriza 'Cat' conforme especificado
      DATA: normalizedDate,
      TIPO: item.TIPO || item.OCORRÊNCIA, // Usa TIPO se disponível, senão OCORRÊNCIA
      OCORRÊNCIA: item.OCORRÊNCIA,
      VALOR: item.Valor || item.VALOR // Prioriza 'Valor' conforme especificado
    };
  });
};

