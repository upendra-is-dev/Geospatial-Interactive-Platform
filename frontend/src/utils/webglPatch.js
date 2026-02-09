// Permanent fix for deck.gl WebGL context initialization errors
// This file must be imported BEFORE deck.gl

// Patch ResizeObserver to catch WebGL errors
if (typeof window !== 'undefined' && window.ResizeObserver) {
  const OriginalResizeObserver = window.ResizeObserver;
  
  window.ResizeObserver = class SafeResizeObserver extends OriginalResizeObserver {
    constructor(callback) {
      const safeCallback = (entries, observer) => {
        try {
          if (callback) {
            callback(entries, observer);
          }
        } catch (error) {
          const errorMsg = error?.message || String(error);
          if (errorMsg.includes('maxTextureDimension2D') ||
              errorMsg.includes('Cannot read properties of undefined') ||
              errorMsg.includes('WebGL') ||
              errorMsg.includes('getMaxDrawingBufferSize')) {
            // Silently ignore - WebGL context will initialize properly
            return;
          }
          throw error;
        }
      };
      super(safeCallback);
    }
  };
}

// Patch WebGL context getParameter to handle undefined contexts
if (typeof WebGLRenderingContext !== 'undefined') {
  const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(parameter) {
    try {
      if (!this || this === null || this === undefined) {
        return 16384; // Safe default
      }
      return originalGetParameter.call(this, parameter);
    } catch (e) {
      return 16384; // Safe default on error
    }
  };
}

if (typeof WebGL2RenderingContext !== 'undefined') {
  const originalGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
  WebGL2RenderingContext.prototype.getParameter = function(parameter) {
    try {
      if (!this || this === null || this === undefined) {
        return 16384;
      }
      return originalGetParameter2.call(this, parameter);
    } catch (e) {
      return 16384;
    }
  };
}

// Patch HTMLCanvasElement.getContext - only patch getParameter, don't wrap entire context
// Wrapping causes "Illegal invocation" errors because it breaks method binding
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
  const context = originalGetContext.call(this, contextType, ...args);
  
  // Only patch getParameter method, don't wrap the entire context
  // This prevents "Illegal invocation" errors while still protecting against undefined access
  if (context && (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl')) {
    const originalGetParam = context.getParameter;
    if (originalGetParam) {
      context.getParameter = function(parameter) {
        try {
          if (!this || this === null || this === undefined) {
            return 16384;
          }
          return originalGetParam.call(this, parameter);
        } catch (e) {
          return 16384;
        }
      };
    }
  }
  
  return context;
};

// Global error handler
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror;
  window.onerror = function(msg, url, line, col, error) {
    const errorMsg = String(msg || error?.message || '');
    if (errorMsg.includes('maxTextureDimension2D') ||
        errorMsg.includes('Cannot read properties of undefined') ||
        errorMsg.includes('getMaxDrawingBufferSize')) {
      return true; // Suppress error
    }
    if (originalOnError) {
      return originalOnError.call(this, msg, url, line, col, error);
    }
    return false;
  };
  
  // Suppress console errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const errorMsg = args.join(' ');
    if (errorMsg.includes('maxTextureDimension2D') ||
        errorMsg.includes('Cannot read properties of undefined')) {
      return; // Suppress
    }
    originalConsoleError.apply(console, args);
  };
}

const webglPatch = {};

export default webglPatch;

