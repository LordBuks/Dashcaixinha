import { collection, getDocs, query, where, orderBy, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AthleteOccurrence } from './athleteData';

export interface MonthlyData {
  month: string;
  year: number;
  data: AthleteOccurrence[];
}

export const loadUserMonthlyData = async (userId: string): Promise<MonthlyData[]> => {
  try {
    const monthlyDataList: MonthlyData[] = [];
    
    const q = query(
      collection(db, 'occurrences'),
      where('userId', '==', userId),
      orderBy('year', 'desc'),
      orderBy('month', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    for (const monthDoc of querySnapshot.docs) {
      const monthData = monthDoc.data();
      const month = monthData.month;
      const year = monthData.year;

      const occurrencesSubcollectionRef = collection(monthDoc.ref, 'occurrences');
      const occurrencesSnapshot = await getDocs(occurrencesSubcollectionRef);
      
      const occurrences: AthleteOccurrence[] = [];
      occurrencesSnapshot.forEach((occurrenceDoc) => {
        occurrences.push(occurrenceDoc.data() as AthleteOccurrence);
      });

      monthlyDataList.push({
        month,
        year,
        data: occurrences
      });
    }

    return monthlyDataList;
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    return [];
  }
};

export const getAllUserOccurrences = async (userId: string): Promise<AthleteOccurrence[]> => {
  const monthlyDataList = await loadUserMonthlyData(userId);
  const allOccurrences: AthleteOccurrence[] = [];
  
  monthlyDataList.forEach(monthData => {
    allOccurrences.push(...monthData.data);
  });
  
  return allOccurrences;
};

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
      const monthDoc = querySnapshot.docs[0];
      const occurrencesSubcollectionRef = collection(monthDoc.ref, 'occurrences');
      const occurrencesSnapshot = await getDocs(occurrencesSubcollectionRef);
      
      const occurrences: AthleteOccurrence[] = [];
      occurrencesSnapshot.forEach((occurrenceDoc) => {
        occurrences.push(occurrenceDoc.data() as AthleteOccurrence);
      });
      return occurrences;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao carregar dados do mês:', error);
    return [];
  }
};

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


