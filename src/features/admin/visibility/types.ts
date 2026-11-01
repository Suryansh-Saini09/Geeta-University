export type CmsScopeType = "department" | "page" | "program";

export interface CmsSectionVisibilityRecord {
  scopeType: CmsScopeType;
  scopeId: string;
  sectionKey: string;
  isVisible: boolean;
  updatedAt?: Date | string;
}

export interface UpdateVisibilityPayload {
  scopeType: CmsScopeType;
  scopeId: string;
  sectionKey: string;
  isVisible: boolean;
}

export interface UpdateVisibilityResponse {
  success: boolean;
  isVisible?: boolean;
  error?: string;
}
