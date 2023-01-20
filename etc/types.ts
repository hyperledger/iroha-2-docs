export interface SnippetSourceDefinition {
  /**
   * URI from which to get the snippet.
   *
   * Could be:
   *
   * - HTTP(S) URL (e. g. `http://example.com/hack.rs`)
   * - File system path (e. g. `./file.ts`, `src/file.ts`)
   */
  src: string
  /**
   * (Optional) The name that the source file will have in the snippets directory.
   */
  filename?: string
}
