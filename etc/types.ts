export interface SnippetSourceDefinition {
  /**
   * URI from which to get the snippet.
   *
   * Could be:
   *
   * - File system relative path (e. g. `./file.ts`)
   * - HTTP(S) URL (e. g. `http://example.com/hack.rs`)
   */
  src: string
  /**
   * (Optional) The name that the source file will have in the snippets directory.
   */
  filename?: string
}
