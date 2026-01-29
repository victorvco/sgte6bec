import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArranchamentoForm } from "@/components/ArranchamentoForm";
import { ArranchamentoTable } from "@/components/ArranchamentoTable";
import { useArranchamento } from "@/hooks/useArranchamento";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";
import { ClipboardList, FileSpreadsheet, Trash2, LogOut, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import logo from "@/assets/logo-6bec.png";

const Index = () => {
  const [currentView, setCurrentView] = useState<"form" | "table" | "login">("form");
  const { entries, loading, addEntry, deleteEntry, clearAll } = useArranchamento();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <img src={logo} alt="Logo 6º BEC" className="h-24 mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">
            Arranchamento da Base Administrativa
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-3 flex-wrap">
          <Button
            variant={currentView === "form" ? "default" : "secondary"}
            onClick={() => setCurrentView("form")}
            className="gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            Formulário
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                variant={currentView === "table" ? "default" : "secondary"}
                onClick={() => setCurrentView("table")}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Ver Tabela
                {entries.length > 0 && (
                  <span className="ml-1 bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full">
                    {entries.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  setCurrentView("form");
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button
              variant={currentView === "login" ? "default" : "secondary"}
              onClick={() => setCurrentView("login")}
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              Login Admin
            </Button>
          )}
        </div>

        {/* Content */}
        {currentView === "form" && <ArranchamentoForm onSubmit={addEntry} />}
        
        {currentView === "login" && !isAuthenticated && (
          <div className="flex justify-center">
            <LoginForm onSuccess={() => setCurrentView("table")} />
          </div>
        )}
        
        {currentView === "table" && isAuthenticated && (
          <Card className="form-container">
            <CardHeader className="form-header flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold tracking-tight">
                Registros de Arranchamento
              </CardTitle>
              {entries.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                      Limpar Tudo
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir todos os {entries.length} registros?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={clearAll}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir Tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <ArranchamentoTable entries={entries} onDelete={deleteEntry} loading={loading} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
