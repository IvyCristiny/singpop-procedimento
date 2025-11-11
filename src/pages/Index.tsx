import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Filter, FileText, BookOpen, Calendar, Loader2, AlertCircle } from "lucide-react";
import { POPCard } from "@/components/POPCard";
import { POPForm } from "@/components/POPForm";
import { BibliotecaPOP } from "./BibliotecaPOP";
import { useCatalog } from "@/hooks/useCatalog";
import { usePOPs } from "@/hooks/usePOPs";
import { useNavigate } from "react-router-dom";
import logoSingular from "@/assets/logo_singular_colorida.png";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFuncao, setFilterFuncao] = useState<string>("todos");
  const { catalog, loading: catalogLoading } = useCatalog();
  const { pops, loading: popsLoading, loadingMore, hasMore, totalCount, loadMore, refetch } = usePOPs();
  const navigate = useNavigate();

  const filteredPOPs = pops.filter((pop) => {
    const matchSearch = pop.condominioNome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchFuncao = filterFuncao === "todos" || pop.functionId === filterFuncao;
    return matchSearch && matchFuncao;
  });

  if (showForm) {
    return (
      <POPForm
        onBack={() => setShowForm(false)}
        onSave={() => {
          setShowForm(false);
          refetch();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <img 
              src={logoSingular} 
              alt="Singular Serviços" 
              className="h-12 w-auto"
            />
            <div className="h-12 w-px bg-border"></div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">SingPOP</h1>
              <p className="text-sm text-muted-foreground">
                Gerador de Procedimentos Operacionais Padrão
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="pops" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pops" className="gap-2">
              <FileText className="w-4 h-4" />
              POPs Gerados
            </TabsTrigger>
            <TabsTrigger value="cronogramas" className="gap-2">
              <Calendar className="w-4 h-4" />
              Cronogramas
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Biblioteca POP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pops" className="space-y-6">
            <div className="space-y-4">
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-card hover:shadow-hover transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo POP
              </Button>

              {pops.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome do condomínio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={filterFuncao} onValueChange={setFilterFuncao}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="todos">Todas as funções</SelectItem>
                      {catalog?.functions?.map((func) => (
                        <SelectItem key={func.id} value={func.id}>
                          {func.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

              {catalogLoading && (
                <Alert className="mb-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>
                    Carregando catálogo de atividades...
                  </AlertDescription>
                </Alert>
              )}

              {popsLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Carregando POPs...</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="space-y-3 p-4 border rounded-lg">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : pops.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum POP criado ainda
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Clique em "Novo POP" para criar seu primeiro procedimento
                  </p>
                </div>
              ) : filteredPOPs.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Nenhum POP encontrado
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Tente ajustar os filtros de busca
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterFuncao("todos");
                    }}
                    variant="outline"
                  >
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                      POPs Gerados ({filteredPOPs.length} de {totalCount})
                    </h2>
                    {pops.length < totalCount && (
                      <span className="text-sm text-muted-foreground">
                        {pops.length} de {totalCount} carregados
                      </span>
                    )}
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPOPs.map((pop) => (
                      <POPCard key={pop.id} pop={pop} onDelete={refetch} />
                    ))}
                  </div>

                  {hasMore && !searchTerm && filterFuncao === "todos" && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={loadMore}
                        disabled={loadingMore}
                        variant="outline"
                        size="lg"
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Carregando...
                          </>
                        ) : (
                          <>Carregar mais POPs</>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
          </TabsContent>

          <TabsContent value="cronogramas">
            <div className="text-center py-8">
              <Button onClick={() => navigate("/cronogramas")} size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Acessar Cronogramas
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="biblioteca">
            <BibliotecaPOP />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
