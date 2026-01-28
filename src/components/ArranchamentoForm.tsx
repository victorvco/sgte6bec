import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArranchamentoEntry, DiasSemana, diasSemanaLabels } from "@/types/arranchamento";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface ArranchamentoFormProps {
  onSubmit: (entry: ArranchamentoEntry) => void;
}

const initialDias: DiasSemana = {
  segunda: false,
  terca: false,
  quarta: false,
  quinta: false,
  sexta: false,
};

export function ArranchamentoForm({ onSubmit }: ArranchamentoFormProps) {
  const [pg, setPg] = useState("");
  const [nomeGuerra, setNomeGuerra] = useState("");
  const [cafeManha, setCafeManha] = useState<DiasSemana>({ ...initialDias });
  const [almoco, setAlmoco] = useState<DiasSemana>({ ...initialDias });

  const handleCafeManhaChange = (dia: keyof DiasSemana) => {
    setCafeManha((prev) => ({ ...prev, [dia]: !prev[dia] }));
  };

  const handleAlmocoChange = (dia: keyof DiasSemana) => {
    setAlmoco((prev) => ({ ...prev, [dia]: !prev[dia] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pg.trim() || !nomeGuerra.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha P/G e Nome de Guerra.",
        variant: "destructive",
      });
      return;
    }

    const entry: ArranchamentoEntry = {
      id: crypto.randomUUID(),
      pg: pg.trim(),
      nomeGuerra: nomeGuerra.trim(),
      cafeManha,
      almoco,
      createdAt: new Date(),
    };

    onSubmit(entry);

    // Reset form
    setPg("");
    setNomeGuerra("");
    setCafeManha({ ...initialDias });
    setAlmoco({ ...initialDias });

    toast({
      title: "Registro salvo!",
      description: "Arranchamento registrado com sucesso.",
    });
  };

  return (
    <Card className="form-container max-w-2xl mx-auto">
      <CardHeader className="form-header">
        <CardTitle className="text-xl font-bold tracking-tight">
          Arranchamento B Adm
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* P/G Field */}
          <div className="space-y-2">
            <Label htmlFor="pg" className="text-sm font-medium">
              P/G <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pg"
              value={pg}
              onChange={(e) => setPg(e.target.value)}
              placeholder="Ex: Sgt, Cb, Sd..."
              className="bg-background"
            />
          </div>

          {/* Nome de Guerra Field */}
          <div className="space-y-2">
            <Label htmlFor="nomeGuerra" className="text-sm font-medium">
              Nome de Guerra <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nomeGuerra"
              value={nomeGuerra}
              onChange={(e) => setNomeGuerra(e.target.value)}
              placeholder="Seu nome de guerra"
              className="bg-background"
            />
          </div>

          {/* Café da Manhã */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Café da Manhã</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.keys(diasSemanaLabels) as (keyof DiasSemana)[]).map((dia) => (
                <div key={`cafe-${dia}`} className="checkbox-day">
                  <Checkbox
                    id={`cafe-${dia}`}
                    checked={cafeManha[dia]}
                    onCheckedChange={() => handleCafeManhaChange(dia)}
                  />
                  <Label
                    htmlFor={`cafe-${dia}`}
                    className="text-sm cursor-pointer"
                  >
                    {diasSemanaLabels[dia]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Almoço */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Almoço</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(Object.keys(diasSemanaLabels) as (keyof DiasSemana)[]).map((dia) => (
                <div key={`almoco-${dia}`} className="checkbox-day">
                  <Checkbox
                    id={`almoco-${dia}`}
                    checked={almoco[dia]}
                    onCheckedChange={() => handleAlmocoChange(dia)}
                  />
                  <Label
                    htmlFor={`almoco-${dia}`}
                    className="text-sm cursor-pointer"
                  >
                    {diasSemanaLabels[dia]}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full gap-2">
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
