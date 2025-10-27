import { Activity } from "@/types/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivitySelectorProps {
  activities: Activity[];
  selectedActivityId?: string;
  selectedActivityIds?: string[];
  onSelectActivity?: (activityId: string) => void;
  onSelectMultipleActivities?: (activityIds: string[]) => void;
  multiple?: boolean;
}

export const ActivitySelector = ({ 
  activities, 
  selectedActivityId,
  selectedActivityIds = [],
  onSelectActivity,
  onSelectMultipleActivities,
  multiple = false
}: ActivitySelectorProps) => {
  const calculateTotalTime = (activity: Activity) => {
    return activity.procedure.steps.reduce((sum, step) => sum + step.time_estimate_min, 0);
  };

  const handleActivityToggle = (activityId: string) => {
    if (multiple && onSelectMultipleActivities) {
      if (selectedActivityIds.includes(activityId)) {
        onSelectMultipleActivities(selectedActivityIds.filter(id => id !== activityId));
      } else {
        onSelectMultipleActivities([...selectedActivityIds, activityId]);
      }
    } else if (onSelectActivity) {
      onSelectActivity(activityId);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          2️⃣ {multiple ? "Selecione as Atividades" : "Selecione a Atividade"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {multiple 
            ? "Escolha um ou mais procedimentos para incluir no mesmo PDF" 
            : "Escolha o procedimento específico que deseja documentar"}
        </p>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const isSelected = multiple 
            ? selectedActivityIds.includes(activity.id)
            : selectedActivityId === activity.id;
          const totalTime = calculateTotalTime(activity);
          
          return (
            <Card
              key={activity.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md relative",
                isSelected && "ring-2 ring-primary shadow-md"
              )}
              onClick={() => handleActivityToggle(activity.id)}
            >
              {multiple && (
                <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => handleActivityToggle(activity.id)}
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-8">
                    <CardTitle className="text-base flex items-center gap-2">
                      {activity.name}
                      {isSelected && !multiple && <CheckCircle2 className="w-4 h-4 text-primary" />}
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
                    v{activity.versioning?.current_version || '1.0'}
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
