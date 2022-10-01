/**
 * Defines a snippet source
 *
 *
 */
export type SourceDefinition = {
  // The software version to display in a tab title
  version: string;
  // A url to query and parse
  url: string;
  // A language highlight mode
  lang: string;
  // Text content of the page
  content: string | undefined;
};

/**
 * Defines an individual snippet
 *
 * @typedef {object} IndividualSnippet
 */
export type IndividualSnippet = {
  name: string;
  text: string;
  lang: string;
  url: string;
  version: string;
};

/**
 * Defines the state of the snippet retrieval
 *
 * @typedef {object} SnippetProcessingState
 */
export type SnippetProcessingState = {
  output_dir_accessible: boolean;
  error: Error | null;
  sources: SourceDefinition[];
  parsing_result: any;
  output_strings: Record<string, string>;
  parsed: IndividualSnippet[];
};
