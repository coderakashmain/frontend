import {
  gsapWithCSS
} from "./chunk-LB2R3FI5.js";
import {
  require_react
} from "./chunk-4SFRHSJ3.js";
import {
  __toESM
} from "./chunk-EQCVQC35.js";

// node_modules/@gsap/react/src/index.js
var import_react = __toESM(require_react());
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var isConfig = (value) => value && !Array.isArray(value) && typeof value === "object";
var emptyArray = [];
var defaultConfig = {};
var _gsap = gsapWithCSS;
var useGSAP = (callback, dependencies = emptyArray) => {
  let config = defaultConfig;
  if (isConfig(callback)) {
    config = callback;
    callback = null;
    dependencies = "dependencies" in config ? config.dependencies : emptyArray;
  } else if (isConfig(dependencies)) {
    config = dependencies;
    dependencies = "dependencies" in config ? config.dependencies : emptyArray;
  }
  callback && typeof callback !== "function" && console.warn("First parameter must be a function or config object");
  const { scope, revertOnUpdate } = config, mounted = (0, import_react.useRef)(false), context = (0, import_react.useRef)(_gsap.context(() => {
  }, scope)), contextSafe = (0, import_react.useRef)((func) => context.current.add(null, func)), deferCleanup = dependencies && dependencies.length && !revertOnUpdate;
  useIsomorphicLayoutEffect(() => {
    callback && context.current.add(callback, scope);
    if (!deferCleanup || !mounted.current) {
      return () => context.current.revert();
    }
  }, dependencies);
  deferCleanup && useIsomorphicLayoutEffect(() => {
    mounted.current = true;
    return () => context.current.revert();
  }, emptyArray);
  return { context: context.current, contextSafe: contextSafe.current };
};
useGSAP.register = (core) => {
  _gsap = core;
};
useGSAP.headless = true;
export {
  useGSAP
};
/*! Bundled license information:

@gsap/react/src/index.js:
  (*!
   * @gsap/react 2.1.1
   * https://gsap.com
   *
   * Copyright 2008-2024, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license or for
   * Club GSAP members, the agreement issued with that membership.
   * @author: Jack Doyle, jack@greensock.com
  *)
*/
//# sourceMappingURL=@gsap_react.js.map