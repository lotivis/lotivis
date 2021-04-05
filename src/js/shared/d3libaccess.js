export var d3LibraryAccess;
try {
  d3LibraryAccess = require('d3');
} catch (e) {
  d3LibraryAccess = d3;
}

export const loadDynamicScript = (callback) => {
  const existingScript = document.getElementById('scriptId');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'url';
    script.id = 'libraryName';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};

export const loadD3 = (callback) => {
  const existingScript = document.getElementById('d3');

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/d3@6.5.0/dist/d3.min.js';
    script.id = 'd3';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  if (existingScript && callback) callback();
};
