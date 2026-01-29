export interface ArranchamentoEntry {
  id: string;
  nome: string;
  nome_guerra: string;
  graduacao: string;
  om: string;
  cafe_segunda: boolean;
  cafe_terca: boolean;
  cafe_quarta: boolean;
  cafe_quinta: boolean;
  cafe_sexta: boolean;
  almoco_segunda: boolean;
  almoco_terca: boolean;
  almoco_quarta: boolean;
  almoco_quinta: boolean;
  almoco_sexta: boolean;
  created_at?: string;
}

// Helper type for form state
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

// Convert form data to database format
export function formToDbEntry(
  nome: string,
  nomeGuerra: string,
  graduacao: string,
  om: string,
  cafeManha: DiasSemana,
  almoco: DiasSemana
): Omit<ArranchamentoEntry, 'id' | 'created_at'> {
  return {
    nome,
    nome_guerra: nomeGuerra,
    graduacao,
    om,
    cafe_segunda: cafeManha.segunda,
    cafe_terca: cafeManha.terca,
    cafe_quarta: cafeManha.quarta,
    cafe_quinta: cafeManha.quinta,
    cafe_sexta: cafeManha.sexta,
    almoco_segunda: almoco.segunda,
    almoco_terca: almoco.terca,
    almoco_quarta: almoco.quarta,
    almoco_quinta: almoco.quinta,
    almoco_sexta: almoco.sexta,
  };
}

// Convert database entry to display format
export function getCafeManha(entry: ArranchamentoEntry): DiasSemana {
  return {
    segunda: entry.cafe_segunda,
    terca: entry.cafe_terca,
    quarta: entry.cafe_quarta,
    quinta: entry.cafe_quinta,
    sexta: entry.cafe_sexta,
  };
}

export function getAlmoco(entry: ArranchamentoEntry): DiasSemana {
  return {
    segunda: entry.almoco_segunda,
    terca: entry.almoco_terca,
    quarta: entry.almoco_quarta,
    quinta: entry.almoco_quinta,
    sexta: entry.almoco_sexta,
  };
}
