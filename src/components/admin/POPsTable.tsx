import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DetailedPOP {
  id: string;
  codigo_pop: string;
  condominio_nome: string;
  responsavel_nome: string;
  nome_colaborador: string;
  function_name: string;
  activities_names: string[];
  created_at: string;
}

interface POPsTableProps {
  pops: DetailedPOP[];
}

export const POPsTable = ({ pops }: POPsTableProps) => {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof DetailedPOP>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtrar POPs
  const filteredPOPs = pops.filter(pop => {
    const searchLower = search.toLowerCase();
    return (
      pop.codigo_pop.toLowerCase().includes(searchLower) ||
      pop.condominio_nome.toLowerCase().includes(searchLower) ||
      pop.responsavel_nome.toLowerCase().includes(searchLower) ||
      pop.nome_colaborador.toLowerCase().includes(searchLower) ||
      pop.function_name.toLowerCase().includes(searchLower) ||
      pop.activities_names.some(a => a.toLowerCase().includes(searchLower))
    );
  });

  // Ordenar POPs
  const sortedPOPs = [...filteredPOPs].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  // Paginar POPs
  const totalPages = Math.ceil(sortedPOPs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPOPs = sortedPOPs.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: keyof DetailedPOP) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof DetailedPOP }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Barra de busca e controles */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por código, condomínio, responsável..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Itens por página:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("codigo_pop")}>
                  <div className="flex items-center gap-1">
                    Código
                    <SortIcon field="codigo_pop" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("condominio_nome")}>
                  <div className="flex items-center gap-1">
                    Condomínio
                    <SortIcon field="condominio_nome" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("responsavel_nome")}>
                  <div className="flex items-center gap-1">
                    Responsável
                    <SortIcon field="responsavel_nome" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("nome_colaborador")}>
                  <div className="flex items-center gap-1">
                    Colaborador
                    <SortIcon field="nome_colaborador" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("function_name")}>
                  <div className="flex items-center gap-1">
                    Função
                    <SortIcon field="function_name" />
                  </div>
                </TableHead>
                <TableHead>Atividades</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                  <div className="flex items-center gap-1">
                    Data Criação
                    <SortIcon field="created_at" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPOPs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {search ? "Nenhum POP encontrado com os critérios de busca" : "Nenhum POP encontrado no período selecionado"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPOPs.map((pop) => (
                  <TableRow key={pop.id}>
                    <TableCell className="font-mono text-sm">{pop.codigo_pop}</TableCell>
                    <TableCell>{pop.condominio_nome}</TableCell>
                    <TableCell>{pop.responsavel_nome}</TableCell>
                    <TableCell>{pop.nome_colaborador}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{pop.function_name}</Badge>
                    </TableCell>
                    <TableCell>
                      {pop.activities_names.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-auto py-1">
                              {pop.activities_names.length} {pop.activities_names.length === 1 ? "atividade" : "atividades"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Atividades:</h4>
                              <ul className="space-y-1">
                                {pop.activities_names.map((activity, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-muted-foreground text-sm">Nenhuma</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(pop.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, sortedPOPs.length)} de {sortedPOPs.length} POPs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
