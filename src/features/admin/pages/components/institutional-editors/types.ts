/**
 * Common Contract for Modular Institutional Section Editors
 */

export interface SpecializedSectionEditorProps<T = any> {
  pageSlug: string;
  sectionKey: string;
  body: T;
  onChange: (nextBody: T) => void;
}
