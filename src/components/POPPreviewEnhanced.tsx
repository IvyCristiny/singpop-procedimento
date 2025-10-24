import { Activity } from "@/types/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, AlertTriangle, CheckCircle2, Camera, Target, Shield } from "lucide-react";

interface POPPreviewEnhancedProps {
  activity: Activity;
}

export const POPPreviewEnhanced = ({ activity }: POPPreviewEnhancedProps) => {
  const totalTime = activity.procedure.steps.reduce((sum, step) => sum + step.time_estimate_min, 0);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Preview do Procedimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto min-h-[80px] sm:h-10 p-2">
            <TabsTrigger 
              value="overview" 
              className="text-xs sm:text-sm whitespace-normal h-auto min-h-[32px] py-2 px-3"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="procedures" 
              className="text-xs sm:text-sm whitespace-normal h-auto min-h-[32px] py-2 px-3"
            >
              Procedimentos
            </TabsTrigger>
            <TabsTrigger 
              value="equipment" 
              className="text-xs sm:text-sm whitespace-normal h-auto min-h-[32px] py-2 px-3"
            >
              Equipamentos
            </TabsTrigger>
            <TabsTrigger 
              value="training" 
              className="text-xs sm:text-sm whitespace-normal h-auto min-h-[32px] py-2 px-3"
            >
              Treinamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Objetivo</h4>
              <p className="text-sm text-muted-foreground">{activity.objective}</p>
            </div>

            {activity.scope && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Escopo de Aplicação</h4>
                <p className="text-sm text-muted-foreground">{activity.scope}</p>
              </div>
            )}

            {activity.prerequisites && activity.prerequisites.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Pré-requisitos</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {activity.prerequisites.map((prereq, idx) => (
                    <li key={idx}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm mb-2">Responsabilidades</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {activity.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                ~{totalTime} min
              </Badge>
              <Badge variant="outline" className="text-xs">
                {activity.procedure.steps.length} etapas
              </Badge>
              <Badge variant="outline" className="text-xs">
                v{activity.versioning.current_version}
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="procedures">
            <Accordion type="single" collapsible className="w-full">
              {activity.procedure.steps.map((step, idx) => (
                <AccordionItem key={step.id} value={step.id}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {idx + 1}
                      </Badge>
                      <span className="flex-1 text-left">{step.title}</span>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {step.time_estimate_min} min
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-4">
                      <div>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          O que fazer:
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{step.instruction}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold">Por quê:</p>
                        <p className="text-sm text-muted-foreground mt-1">{step.why}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold">Responsável:</p>
                        <p className="text-sm text-muted-foreground mt-1">{step.who}</p>
                      </div>

                      {step.safety && (
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-1 text-orange-600">
                            <AlertTriangle className="w-4 h-4" />
                            Segurança:
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{step.safety}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Controle de Qualidade:
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{step.quality_check}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Camera className="w-4 h-4" />
                          Evidência:
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{step.evidence}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            {activity.equipment.epc.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">EPC - Equipamento de Proteção Coletiva</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {activity.equipment.epc.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.equipment.epi.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">EPI - Equipamento de Proteção Individual</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {activity.equipment.epi.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.equipment.tools.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Ferramentas</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {activity.equipment.tools.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {activity.equipment.consumables.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Consumíveis</h4>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  {activity.equipment.consumables.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Módulos de Treinamento</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                {activity.training.modules.map((module, idx) => (
                  <li key={idx}>{module}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Reciclagem</h4>
              <Badge variant="outline" className="text-sm">
                A cada {activity.training.refresh_cadence_days} dias
              </Badge>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
};
