import { useRole } from "./useRole";

export const usePermissions = () => {
  const { primaryRole, isGerenteZona, isGerenteGeral } = useRole();

  return {
    canEditCatalog: isGerenteZona || isGerenteGeral,
    canViewAllPops: isGerenteGeral,
    canViewZonePops: isGerenteZona,
    canDeleteAnyPop: isGerenteGeral,
    canManageUsers: isGerenteGeral,
    primaryRole
  };
};
