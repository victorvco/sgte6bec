export interface ArranchamentoEntry {
  id: string;
  pg: string;
  nomeGuerra: string;
  cafeManha: DiasSemana;
  almoco: DiasSemana;
  createdAt: Date;
}

export interface DiasSemana {
  segunda: boolean;
  terca: boolean;
  quarta: boolean;
  quinta: boolean;
  sexta: boolean;
}

export const diasSemanaLabels: Record<keyof DiasSemana, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
};
