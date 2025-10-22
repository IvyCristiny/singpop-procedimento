import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { POPCard } from "@/components/POPCard";
import { POPForm } from "@/components/POPForm";
import { getAllPOPs } from "@/utils/storage";
import { POP } from "@/types/pop";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [pops, setPops] = useState<POP[]>([]);

  const loadPOPs = () => {
    setPops(getAllPOPs());
  };

  useEffect(() => {
    loadPOPs();
  }, []);

  if (showForm) {
    return (
      <POPForm
        onBack={() => setShowForm(false)}
        onSave={() => {
          setShowForm(false);
          loadPOPs();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-card">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold">SingPOP</h1>
          </div>
          <p className="text-white/90">
            Gerador de Procedimentos Operacionais Padrão - Singular Serviços
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-card hover:shadow-hover transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo POP
          </Button>
        </div>

        {pops.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum POP criado ainda
            </h2>
            <p className="text-muted-foreground mb-6">
              Clique em "Novo POP" para criar seu primeiro procedimento
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              POPs Gerados ({pops.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pops.map((pop) => (
                <POPCard key={pop.id} pop={pop} onDelete={loadPOPs} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
