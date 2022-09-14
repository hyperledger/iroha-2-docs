/**
 * @module Constants
 *
 * Constants, used by the documentation scripts.
 */

import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";
import { SourceDefinition } from "./types.mjs";
import _sources from "../snippet_sources.json";

// Matches languages to the file extensions
export const langExtensions: Record<string, string> = {
  java: "java",
  python: "py",
  javascript: "js",
  typescript: "ts",
  rust: "rs",
  shellscript: "sh",
  shell: "sh",
  bash: "sh",
  sh: "sh"
};

// Locate the current file
export const __filename = fileURLToPath(import.meta.url);
// Locate a directory, containing this file
export const __dirname = dirname(__filename);

// Resolve a parent directory path
export const SRC_PATH_RESOLVED = resolve(__dirname, "..");

// A relative path to the snippet URL list
const SOURCES: SourceDefinition[] = _sources.map((source) => {
  return { ...source, content: undefined };
});
export { SOURCES };

// Resolve a path to the directory needed for saving the snippets
export const SNIPPET_SRC_DIR = resolve(__dirname, "../src/snippets");
