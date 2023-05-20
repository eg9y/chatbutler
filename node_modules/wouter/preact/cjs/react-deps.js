'use strict';

var hooks = require('preact/hooks');
var preact = require('preact');

// Copied from:
// https://github.com/facebook/react/blob/main/packages/shared/ExecutionEnvironment.js
const canUseDOM = !!(
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
);

// TODO: switch to `export { useSyncExternalStore } from "preact/compat"` once we update Preact to >= 10.11.3
function is(x, y) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}
function useSyncExternalStore(subscribe, getSnapshot, getSSRSnapshot) {
  if (getSSRSnapshot && !canUseDOM) getSnapshot = getSSRSnapshot;
  const value = getSnapshot();

  const [{ _instance }, forceUpdate] = hooks.useState({
    _instance: { _value: value, _getSnapshot: getSnapshot },
  });

  hooks.useLayoutEffect(() => {
    _instance._value = value;
    _instance._getSnapshot = getSnapshot;

    if (!is(_instance._value, getSnapshot())) {
      forceUpdate({ _instance });
    }
  }, [subscribe, value, getSnapshot]);

  hooks.useEffect(() => {
    if (!is(_instance._value, _instance._getSnapshot())) {
      forceUpdate({ _instance });
    }

    return subscribe(() => {
      if (!is(_instance._value, _instance._getSnapshot())) {
        forceUpdate({ _instance });
      }
    });
  }, [subscribe]);

  return value;
}

// provide forwardRef stub for preact
function forwardRef(component) {
  return component;
}

// Userland polyfill while we wait for the forthcoming
// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
// Note: "A high-fidelty polyfill for useEvent is not possible because
// there is no lifecycle or Hook in React that we can use to switch
// .current at the right timing."
// So we will have to make do with this "close enough" approach for now.
const useEvent = (fn) => {
  const ref = hooks.useRef([fn, (...args) => ref[0](...args)]).current;
  hooks.useLayoutEffect(() => {
    ref[0] = fn;
  });
  return ref[1];
};

Object.defineProperty(exports, 'useContext', {
  enumerable: true,
  get: function () { return hooks.useContext; }
});
Object.defineProperty(exports, 'useInsertionEffect', {
  enumerable: true,
  get: function () { return hooks.useLayoutEffect; }
});
Object.defineProperty(exports, 'useIsomorphicLayoutEffect', {
  enumerable: true,
  get: function () { return hooks.useLayoutEffect; }
});
Object.defineProperty(exports, 'useState', {
  enumerable: true,
  get: function () { return hooks.useState; }
});
Object.defineProperty(exports, 'Fragment', {
  enumerable: true,
  get: function () { return preact.Fragment; }
});
Object.defineProperty(exports, 'cloneElement', {
  enumerable: true,
  get: function () { return preact.cloneElement; }
});
Object.defineProperty(exports, 'createContext', {
  enumerable: true,
  get: function () { return preact.createContext; }
});
Object.defineProperty(exports, 'createElement', {
  enumerable: true,
  get: function () { return preact.createElement; }
});
Object.defineProperty(exports, 'isValidElement', {
  enumerable: true,
  get: function () { return preact.isValidElement; }
});
exports.forwardRef = forwardRef;
exports.useEvent = useEvent;
exports.useSyncExternalStore = useSyncExternalStore;
