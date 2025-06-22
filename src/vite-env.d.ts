/// <reference types="vite/client" />

// Declaration for importing HTML files as raw strings
declare module '*.html?raw' {
  const content: string;
  export default content;
}

// You can also add declarations for other raw imports if needed
declare module '*.svg?raw' {
  const content: string;
  export default content;
}

declare module '*.txt?raw' {
  const content: string;
  export default content;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}
