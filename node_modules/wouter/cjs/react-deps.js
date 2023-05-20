'use strict';

var React = require('react');
var useSyncExternalStore = require('./use-sync-external-store');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React);

// React.useInsertionEffect is not available in React <18
const {
  useEffect,
  useLayoutEffect,
  useRef,
  useInsertionEffect: useBuiltinInsertionEffect,
} = React__namespace;

// Copied from:
// https://github.com/facebook/react/blob/main/packages/shared/ExecutionEnvironment.js
const canUseDOM = !!(
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
);

// Copied from:
// https://github.com/reduxjs/react-redux/blob/master/src/utils/useIsomorphicLayoutEffect.ts
// "React currently throws a warning when using useLayoutEffect on the server.
// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser."
const useIsomorphicLayoutEffect = canUseDOM
  ? useLayoutEffect
  : useEffect;

// useInsertionEffect is already a noop on the server.
// See: https://github.com/facebook/react/blob/main/packages/react-server/src/ReactFizzHooks.js
const useInsertionEffect =
  useBuiltinInsertionEffect || useIsomorphicLayoutEffect;

// Userland polyfill while we wait for the forthcoming
// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
// Note: "A high-fidelity polyfill for useEvent is not possible because
// there is no lifecycle or Hook in React that we can use to switch
// .current at the right timing."
// So we will have to make do with this "close enough" approach for now.
const useEvent = (fn) => {
  const ref = useRef([fn, (...args) => ref[0](...args)]).current;
  // Per Dan Abramov: useInsertionEffect executes marginally closer to the
  // correct timing for ref synchronization than useLayoutEffect on React 18.
  // See: https://github.com/facebook/react/pull/25881#issuecomment-1356244360
  useInsertionEffect(() => {
    ref[0] = fn;
  });
  return ref[1];
};

Object.defineProperty(exports, 'Fragment', {
  enumerable: true,
  get: function () { return React.Fragment; }
});
Object.defineProperty(exports, 'cloneElement', {
  enumerable: true,
  get: function () { return React.cloneElement; }
});
Object.defineProperty(exports, 'createContext', {
  enumerable: true,
  get: function () { return React.createContext; }
});
Object.defineProperty(exports, 'createElement', {
  enumerable: true,
  get: function () { return React.createElement; }
});
Object.defineProperty(exports, 'forwardRef', {
  enumerable: true,
  get: function () { return React.forwardRef; }
});
Object.defineProperty(exports, 'isValidElement', {
  enumerable: true,
  get: function () { return React.isValidElement; }
});
Object.defineProperty(exports, 'useContext', {
  enumerable: true,
  get: function () { return React.useContext; }
});
Object.defineProperty(exports, 'useState', {
  enumerable: true,
  get: function () { return React.useState; }
});
Object.defineProperty(exports, 'useSyncExternalStore', {
  enumerable: true,
  get: function () { return useSyncExternalStore.useSyncExternalStore; }
});
exports.useEvent = useEvent;
exports.useInsertionEffect = useInsertionEffect;
exports.useIsomorphicLayoutEffect = useIsomorphicLayoutEffect;
