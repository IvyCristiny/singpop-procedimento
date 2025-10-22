import { POPTemplate } from "@/types/pop";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface POPPreviewProps {
  template: POPTemplate;
  tipoPOPLabel: string;
}

export const POPPreview = ({ template, tipoPOPLabel }: POPPreviewProps) => {
  const procedimentosFases = Object.keys(template.procedimentos);
  const totalProcedimentos = Object.values(template.procedimentos).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="preview" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Preview da Estrutura: {tipoPOPLabel}
            </span>
            <Badge variant="secondary" className="ml-2">
              {procedimentosFases.length} fases • {totalProcedimentos} procedimentos
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-4">
          {/* Objetivo */}
          <div>
            <h4 className="font-semibold text-sm text-primary mb-1">
              1. Objetivo
            </h4>
            <p className="text-sm text-muted-foreground">{template.objetivo}</p>
          </div>

          {/* Principais Procedimentos */}
          <div>
            <h4 className="font-semibold text-sm text-primary mb-2">
              4. Principais Procedimentos (por fase)
            </h4>
            <div className="space-y-3">
              {Object.entries(template.procedimentos)
                .slice(0, 3)
                .map(([fase, procedimentos]) => (
                  <div key={fase}>
                    <p className="text-sm font-medium text-foreground mb-1">
                      • {fase}
                    </p>
                    <ul className="ml-4 space-y-1">
                      {procedimentos.slice(0, 2).map((proc, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-muted-foreground"
                        >
                          - {proc}
                        </li>
                      ))}
                      {procedimentos.length > 2 && (
                        <li className="text-xs text-muted-foreground italic">
                          + {procedimentos.length - 2} mais...
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              {procedimentosFases.length > 3 && (
                <p className="text-xs text-muted-foreground italic">
                  + {procedimentosFases.length - 3} fases adicionais...
                </p>
              )}
            </div>
          </div>

          {/* Equipamentos */}
          <div>
            <h4 className="font-semibold text-sm text-primary mb-1">
              5. Equipamentos Necessários
            </h4>
            <ul className="ml-4 space-y-1">
              {template.equipamentos.slice(0, 4).map((equip, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">
                  • {equip}
                </li>
              ))}
              {template.equipamentos.length > 4 && (
                <li className="text-xs text-muted-foreground italic">
                  + {template.equipamentos.length - 4} mais...
                </li>
              )}
            </ul>
          </div>

          {/* Treinamentos */}
          {template.treinamento.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-primary mb-1">
                7. Treinamentos Específicos
              </h4>
              <ul className="ml-4 space-y-1">
                {template.treinamento.map((treino, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground">
                    • {treino}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Indicadores */}
          {template.indicadores.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-primary mb-1">
                8. Indicadores de Desempenho
              </h4>
              <ul className="ml-4 space-y-1">
                {template.indicadores.slice(0, 3).map((indicador, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground">
                    • {indicador}
                  </li>
                ))}
                {template.indicadores.length > 3 && (
                  <li className="text-xs text-muted-foreground italic">
                    + {template.indicadores.length - 3} mais...
                  </li>
                )}
              </ul>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
