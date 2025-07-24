import { AthleteOccurrence } from '../data/athleteData';

// Função para normalizar os dados para o formato esperado
export const normalizeData = (data: any[]): AthleteOccurrence[] => {
  if (!data || data.length === 0) return [];
  
  return data.map(item => ({
    NOME: item.NOME,
    CAT: item.CAT,
    DATA: item.DATA, // DATA já vem como número
    TIPO: item.TIPO, // TIPO já vem categorizado
    OCORRÊNCIA: item.OCORRÊNCIA,
    VALOR: item.VALOR // VALOR já vem como número
  }));
};


