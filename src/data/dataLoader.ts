import { AthleteOccurrence } from './athleteData';
import { normalizeData } from '../utils/dataTransformer';

export interface MonthlyData {
  month: string;
  year: number;
  data: AthleteOccurrence[];
}

// Função para carregar dados de múltiplos arquivos JSON da pasta public
export const loadMonthlyData = async (): Promise<MonthlyData[]> => {
  const monthlyDataList: MonthlyData[] = [];
  
  const monthlyFiles = [
    { file: 'abril-2025.json', month: 'Abril', year: 2025 },
    { file: 'junho-2025.json', month: 'Junho', year: 2025 }
  ];

  for (const { file, month, year } of monthlyFiles) {
    try {
      const response = await fetch(`/data/${file}`);
      if (response.ok) {
        const rawData = await response.json();
        const monthData: AthleteOccurrence[] = normalizeData(rawData);
        if (Array.isArray(monthData) && monthData.length > 0) {
          monthlyDataList.push({
            month,
            year,
            data: monthData
          });
        }
      }
    } catch (error) {
      console.log(`Erro ao carregar ${file}:`, error);
    }
  }

  return monthlyDataList;
};

// Função para consolidar todos os dados em um array único
export const getAllOccurrences = async (): Promise<AthleteOccurrence[]> => {
  const monthlyDataList = await loadMonthlyData();
  const allOccurrences: AthleteOccurrence[] = [];
  
  monthlyDataList.forEach(monthData => {
    allOccurrences.push(...monthData.data);
  });
  
  return allOccurrences;
};

// Função para obter dados de um mês específico
export const getMonthData = async (month: string, year: number): Promise<AthleteOccurrence[]> => {
  const monthlyDataList = await loadMonthlyData();
  const monthData = monthlyDataList.find(data => data.month === month && data.year === year);
  return monthData ? monthData.data : [];
};

// Função para obter lista de meses disponíveis
export const getAvailableMonths = async (): Promise<{month: string, year: number}[]> => {
  const monthlyDataList = await loadMonthlyData();
  return monthlyDataList.map(data => ({ month: data.month, year: data.year }));
};



