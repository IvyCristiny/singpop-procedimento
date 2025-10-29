import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCronogramas } from "@/hooks/useCronogramas";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CronogramaCard } from "@/components/cronograma/CronogramaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Plus, ArrowLeft } from "lucide-react";
import { Cronograma } from "@/types/cronograma";
import { exportCronogramaPDF } from "@/utils/exportCronogramaPDF";
import { exportCronogramaExcel } from "@/utils/exportCronogramaExcel";

export default function Cronogramas() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { cronogramas, loading, deleteCronograma } = useCronogramas();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  const handleExportPDF = (cronograma: Cronograma) => {
    exportCronogramaPDF(cronograma);
  };

  const handleExportExcel = (cronograma: Cronograma) => {
    exportCronogramaExcel(cronograma);
  };

  const handleEdit = (cronograma: Cronograma) => {
    // TODO: Implement edit functionality
    console.log("Edit cronograma:", cronograma);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Cronogramas</h1>
              <p className="text-muted-foreground">
                Gerencie cronogramas de atividades diárias e semanais
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cronograma
          </Button>
        </div>

        {/* Empty State */}
        {cronogramas.length === 0 && (
          <Card className="p-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <Calendar className="w-16 h-16 text-muted-foreground opacity-50" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Nenhum cronograma criado</h3>
                <p className="text-muted-foreground max-w-md">
                  Crie seu primeiro cronograma para organizar as atividades diárias e
                  semanais do condomínio.
                </p>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Cronograma
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cronogramas Grid */}
        {cronogramas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cronogramas.map((cronograma) => (
              <CronogramaCard
                key={cronograma.id}
                cronograma={cronograma}
                onDelete={deleteCronograma}
                onEdit={handleEdit}
                onExportPDF={handleExportPDF}
                onExportExcel={handleExportExcel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
