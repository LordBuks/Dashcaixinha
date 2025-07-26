import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AthleteOccurrence } from './athleteData';

export interface MonthlyData {
  month: string;
  year: number;
  data: AthleteOccurrence[];
}

// Função para carregar dados de um usuário específico do Firestore
export const loadUserMonthlyData = async (userId: string): Promise<MonthlyData[]> => {
  try {
    const monthlyDataList: MonthlyData[] = [];
    
    // Query para buscar todos os documentos do usuário
    const q = query(
      collection(db, 'occurrences'),
      where('userId', '==', userId),
      orderBy('year', 'desc'),
      orderBy('month', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      monthlyDataList.push({
        month: data.month,
        year: data.year,
        data: data.occurrences || []
      });
    });

    return monthlyDataList;
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    return [];
  }
};

// Função para consolidar todos os dados de um usuário em um array único
export const getAllUserOccurrences = async (userId: string): Promise<AthleteOccurrence[]> => {
  const monthlyDataList = await loadUserMonthlyData(userId);
  const allOccurrences: AthleteOccurrence[] = [];
  
  monthlyDataList.forEach(monthData => {
    allOccurrences.push(...monthData.data);
  });
  
  return allOccurrences;
};

// Função para obter dados de um mês específico de um usuário
export const getUserMonthData = async (userId: string, month: string, year: number): Promise<AthleteOccurrence[]> => {
  try {
    const q = query(
      collection(db, 'occurrences'),
      where('userId', '==', userId),
      where('month', '==', month),
      where('year', '==', year)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return data.occurrences || [];
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao carregar dados do mês:', error);
    return [];
  }
};

// Função para obter lista de meses disponíveis de um usuário
export const getUserAvailableMonths = async (userId: string): Promise<{month: string, year: number}[]> => {
  const monthlyDataList = await loadUserMonthlyData(userId);
  
  const monthOrder: { [key: string]: number } = {
    'Janeiro': 1, 'Fevereiro': 2, 'Março': 3, 'Abril': 4,
    'Maio': 5, 'Junho': 6, 'Julho': 7, 'Agosto': 8,
    'Setembro': 9, 'Outubro': 10, 'Novembro': 11, 'Dezembro': 12
  };

  return monthlyDataList.map(data => ({ month: data.month, year: data.year }))
    .sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return monthOrder[b.month] - monthOrder[a.month];
    });
};

// Função de fallback para usar dados locais (para desenvolvimento/teste)
export const loadLocalMonthlyData = async (): Promise<MonthlyData[]> => {
  const monthlyDataList: MonthlyData[] = [];
  
  const monthlyFiles = [
    { file: 'junho-2025.json', month: 'Junho', year: 2025 },
    { file: 'maio-2025.json', month: 'Maio', year: 2025 },
    { file: 'abril-2025.json', month: 'Abril', year: 2025 }
  ];

  for (const { file, month, year } of monthlyFiles) {
    try {
      const response = await fetch(`/data/${file}`);
      if (response.ok) {
        const rawData = await response.json();
        if (Array.isArray(rawData) && rawData.length > 0) {
          monthlyDataList.push({
            month,
            year,
            data: rawData
          });
        }
      }
    } catch (error) {
      console.log(`Erro ao carregar ${file}:`, error);
    }
  }

  return monthlyDataList;
};

