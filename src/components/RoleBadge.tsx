import { Badge } from "@/components/ui/badge";
import { AppRole } from "@/types/auth";

interface RoleBadgeProps {
  role: AppRole;
}

const roleConfig = {
  supervisor: {
    label: "Supervisor",
    variant: "secondary" as const,
  },
  gerente_zona: {
    label: "Gerente de Zona",
    variant: "default" as const,
  },
  gerente_geral: {
    label: "Gerente Geral",
    variant: "destructive" as const,
  },
};

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const config = roleConfig[role];
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};
