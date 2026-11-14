/**
 * Institutional Pages Configuration & Registry Adapter
 * 
 * Re-exports canonical page registry definitions for backwards compatibility.
 */

export * from "./institutionalPageRegistry";
import { INSTITUTIONAL_PAGES_REGISTRY } from "./institutionalPageRegistry";

// Backwards-compatible alias for existing consumers
export const INSTITUTIONAL_PAGES_CATALOG = INSTITUTIONAL_PAGES_REGISTRY;
