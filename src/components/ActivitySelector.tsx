import { Activity } from "@/types/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";

interface ActivitySelectorProps {
  activities: Activity[];
  selectedActivityId?: string;
  onSelectActivity: (activityId: string) => void;
}

export const ActivitySelector = ({ activities, selectedActivityId, onSelectActivity }: ActivitySelectorProps) => {
  const calculateTotalTime = (activity: Activity) => {
    return activity.procedure.steps.reduce((sum, step) => sum + step.time_estimate_min, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">2️⃣ Selecione a Atividade</h3>
        <p className="text-sm text-muted-foreground">Escolha o procedimento específico que deseja documentar</p>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const isSelected = selectedActivityId === activity.id;
          const totalTime = calculateTotalTime(activity);
          
          return (
            <Card
              key={activity.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
              onClick={() => onSelectActivity(activity.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {activity.name}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">{activity.objective}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {activity.procedure.steps.length} etapas
                  </Badge>
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{totalTime} min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{activity.versioning.current_version}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
