export interface AthleteOccurrence {
  NOME: string;
  CAT: string;
  DATA: number; // Agora é um número, provavelmente um serial de data
  TIPO: string; // Novo campo para o tipo de ocorrência
  OCORRÊNCIA: string;
  VALOR: number;
  fotoUrl?: string;
}


