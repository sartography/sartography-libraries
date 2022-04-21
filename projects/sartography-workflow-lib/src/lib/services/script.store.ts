interface Scripts {
  name: string;
  src: string;
}

/**
 * related to the Script Service - Define any external libraries provided over a CDN here,
 * and the Script Service will be able to load them up for you.
 */
export const ScriptStore: Scripts[] = [
  {name: 'pyodide', src: 'https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js'},
];
