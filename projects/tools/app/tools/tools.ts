export type ToolLink =
  // Vue tool built inside this app, e.g. /json-diff
  | { type: 'internal'; to: string }
  // Tool from another repo, served by its own Worker on a tools.gerasaka.dev path
  | { type: 'mounted'; path: string }
  | { type: 'external'; url: string }
  // No web UI (CLI, script); link to the source instead
  | { type: 'repo'; url: string; install?: string };

export type ToolKind = 'web' | 'cli' | 'extension';

export type ToolStatus = 'live' | 'wip';

export type Tool = {
  name: string;
  description: string;
  link: ToolLink;
  kind: ToolKind;
  stack: string[];
  status?: ToolStatus;
  source?: string;
};

export const TOOLS: Tool[] = [];
