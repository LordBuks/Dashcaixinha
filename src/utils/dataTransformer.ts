import { AthleteOccurrence } from '../data/athleteData';

// Interface para os dados dos novos arquivos JSON (formato diferente)
interface NewFormatData {
  nome: string;
  cod: string;
  data: string;
  ocorrencia: string;
  valor: string;
}

// Função para transformar dados do novo formato para o formato esperado
export const transformNewFormatData = (newData: NewFormatData[]): AthleteOccurrence[] => {
  return newData.map(item => ({
    NOME: item.nome,
    Cat: item.cod,
    DATA: item.data,
    OCORRÊNCIA: item.ocorrencia,
    Valor: item.valor.replace('R$ ', '').replace(',00', '') // Remove "R$ " e ",00"
  }));
};

// Função para detectar e transformar dados automaticamente
export const normalizeData = (data: any[]): AthleteOccurrence[] => {
  if (!data || data.length === 0) return [];
  
  // Verifica se é o formato antigo (tem NOME maiúsculo) ou novo (tem nome minúsculo)
  const firstItem = data[0];
  
  if (firstItem.NOME !== undefined) {
    // Formato antigo - retorna como está
    return data as AthleteOccurrence[];
  } else if (firstItem.nome !== undefined) {
    // Formato novo - transforma
    return transformNewFormatData(data as NewFormatData[]);
  }
  
  return [];
};

