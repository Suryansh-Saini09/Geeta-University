/**
 * Institutional Specialized Editors Index & Dispatcher
 */

import React from "react";
import { PlacementsSectionEditor } from "./PlacementsSectionEditor";
import { CampusLifeSectionEditor } from "./CampusLifeSectionEditor";
import { LibrarySectionEditor } from "./LibrarySectionEditor";
import { MedalPolicySectionEditor } from "./MedalPolicySectionEditor";
import { AdvisoryBoardSectionEditor } from "./AdvisoryBoardSectionEditor";
import type { SpecializedSectionEditorProps } from "./types";

export * from "./types";
export * from "./PlacementsSectionEditor";
export * from "./CampusLifeSectionEditor";
export * from "./LibrarySectionEditor";
export * from "./MedalPolicySectionEditor";
export * from "./AdvisoryBoardSectionEditor";

export type SpecializedEditorComponent = React.ComponentType<SpecializedSectionEditorProps>;

export const SPECIALIZED_EDITORS_MAP: Record<string, SpecializedEditorComponent> = {
  placements: PlacementsSectionEditor,
  "campus-life": CampusLifeSectionEditor,
  library: LibrarySectionEditor,
  "medal-policy": MedalPolicySectionEditor,
  "advisory-board": AdvisoryBoardSectionEditor,
};

/**
 * Returns the specialized section editor for a page if registered, or null.
 */
export function getSpecializedEditor(pageSlug: string): SpecializedEditorComponent | null {
  return SPECIALIZED_EDITORS_MAP[pageSlug] || null;
}
