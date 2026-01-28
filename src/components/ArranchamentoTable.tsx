import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArranchamentoEntry, DiasSemana, diasSemanaLabels } from "@/types/arranchamento";
import { Trash2, Check, X, FileDown, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ArranchamentoTableProps {
  entries: ArranchamentoEntry[];
  onDelete: (id: string) => void;
}

const CheckIcon = ({ checked }: { checked: boolean }) => {
  if (checked) {
    return <Check className="h-4 w-4 text-primary mx-auto" />;
  }
  return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
};

export function ArranchamentoTable({ entries, onDelete }: ArranchamentoTableProps) {
  const dias = Object.keys(diasSemanaLabels) as (keyof DiasSemana)[];

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Arranchamento da Base Administrativa", 14, 15);
    
    const headers = [
      "P/G", "Nome de Guerra",
      ...dias.map(d => `Café ${diasSemanaLabels[d].slice(0, 3)}`),
      ...dias.map(d => `Almoço ${diasSemanaLabels[d].slice(0, 3)}`)
    ];

    const data = entries.map(entry => [
      entry.pg,
      entry.nomeGuerra,
      ...dias.map(d => entry.cafeManha[d] ? "✓" : ""),
      ...dias.map(d => entry.almoco[d] ? "✓" : "")
    ]);

    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [75, 83, 32] }
    });

    doc.save("arranchamento.pdf");
  };

  const exportToExcel = () => {
    const data = entries.map(entry => ({
      "P/G": entry.pg,
      "Nome de Guerra": entry.nomeGuerra,
      ...dias.reduce((acc, d) => ({
        ...acc,
        [`Café ${diasSemanaLabels[d]}`]: entry.cafeManha[d] ? "Sim" : "Não"
      }), {}),
      ...dias.reduce((acc, d) => ({
        ...acc,
        [`Almoço ${diasSemanaLabels[d]}`]: entry.almoco[d] ? "Sim" : "Não"
      }), {})
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Arranchamento");
    XLSX.writeFile(wb, "arranchamento.xlsx");
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum registro encontrado.</p>
        <p className="text-sm mt-1">Preencha o formulário para adicionar registros.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 px-4 pt-4">
        <Button variant="outline" size="sm" onClick={exportToPDF} className="gap-2">
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={exportToExcel} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Excel
        </Button>
      </div>
      <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="table-header hover:bg-primary">
            <TableHead className="text-primary-foreground font-semibold">P/G</TableHead>
            <TableHead className="text-primary-foreground font-semibold">Nome de Guerra</TableHead>
            <TableHead colSpan={5} className="text-center text-primary-foreground font-semibold border-l border-primary-foreground/20">
              Café da Manhã
            </TableHead>
            <TableHead colSpan={5} className="text-center text-primary-foreground font-semibold border-l border-primary-foreground/20">
              Almoço
            </TableHead>
            <TableHead className="text-primary-foreground font-semibold text-center border-l border-primary-foreground/20">
              Ações
            </TableHead>
          </TableRow>
          <TableRow className="bg-secondary hover:bg-secondary">
            <TableHead></TableHead>
            <TableHead></TableHead>
            {dias.map((dia) => (
              <TableHead key={`cafe-header-${dia}`} className="text-center text-xs font-medium px-2 border-l border-border first:border-l-0">
                {diasSemanaLabels[dia].slice(0, 3)}
              </TableHead>
            ))}
            {dias.map((dia) => (
              <TableHead key={`almoco-header-${dia}`} className="text-center text-xs font-medium px-2 border-l border-border">
                {diasSemanaLabels[dia].slice(0, 3)}
              </TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow 
              key={entry.id}
              className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
            >
              <TableCell className="table-cell font-medium">{entry.pg}</TableCell>
              <TableCell className="table-cell">{entry.nomeGuerra}</TableCell>
              {dias.map((dia) => (
                <TableCell key={`cafe-${entry.id}-${dia}`} className="table-cell text-center px-2 border-l border-border first:border-l-0">
                  <CheckIcon checked={entry.cafeManha[dia]} />
                </TableCell>
              ))}
              {dias.map((dia) => (
                <TableCell key={`almoco-${entry.id}-${dia}`} className="table-cell text-center px-2 border-l border-border">
                  <CheckIcon checked={entry.almoco[dia]} />
                </TableCell>
              ))}
              <TableCell className="table-cell text-center border-l border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(entry.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
