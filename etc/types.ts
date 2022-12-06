export interface SnippetSourceDefinition {
  /**
   * URI to get the snippet from.
   *
   * Could be:
   *
   * - File system relative path - `./file.ts`
   * - HTTP(S) URL - `http://example.com/hack.rs`
   */
  src: string
  /**
   * Optional filename the source file will have in the snippets directory.
   */
  filename?: string
}
