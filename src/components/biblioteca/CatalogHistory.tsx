import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCatalogHistory, CatalogHistoryEntry } from "@/hooks/useCatalogHistory";
import { History, Filter, X, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const CatalogHistory = () => {
  const { history, loading, filters, updateFilters, clearFilters } = useCatalogHistory();
  const [selectedEntry, setSelectedEntry] = useState<CatalogHistoryEntry | null>(null);

  const actionTypeLabels = {
    create: "Criou",
    update: "Editou",
    delete: "Deletou",
  };

  const actionTypeColors = {
    create: "default",
    update: "secondary",
    delete: "destructive",
  } as const;

  const entityTypeLabels = {
    function: "Função",
    activity: "Atividade",
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          <div>
            <h3 className="text-2xl font-bold text-foreground">Histórico de Modificações</h3>
            <p className="text-sm text-muted-foreground">
              Visualize todas as alterações feitas no catálogo
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </CardTitle>
            {Object.keys(filters).length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Ação</Label>
              <Select
                value={filters.actionType || "all"}
                onValueChange={(value) =>
                  updateFilters({ actionType: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="create">Criações</SelectItem>
                  <SelectItem value="update">Edições</SelectItem>
                  <SelectItem value="delete">Exclusões</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Entidade</Label>
              <Select
                value={filters.entityType || "all"}
                onValueChange={(value) =>
                  updateFilters({ entityType: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="function">Funções</SelectItem>
                  <SelectItem value="activity">Atividades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  updateFilters({ startDate: e.target.value || undefined })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Carregando histórico...</p>
          </CardContent>
        </Card>
      ) : history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Nenhuma modificação encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={actionTypeColors[entry.action_type]}>
                          {actionTypeLabels[entry.action_type]}
                        </Badge>
                        <Badge variant="outline">
                          {entityTypeLabels[entry.entity_type]}
                        </Badge>
                        <span className="font-semibold text-sm">
                          {entry.entity_name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Por <span className="font-medium">{entry.user_name}</span> em{" "}
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                    {entry.changes && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detalhes
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Modificação</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Usuário</p>
                  <p className="font-medium">{selectedEntry.user_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(selectedEntry.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ação</p>
                  <Badge variant={actionTypeColors[selectedEntry.action_type]}>
                    {actionTypeLabels[selectedEntry.action_type]}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <Badge variant="outline">
                    {entityTypeLabels[selectedEntry.entity_type]}
                  </Badge>
                </div>
              </div>

              {selectedEntry.changes && (
                <div className="space-y-2">
                  <p className="font-medium">Alterações:</p>
                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-xs overflow-auto max-h-96">
                        {JSON.stringify(selectedEntry.changes, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
