import {
  __commonJS,
  __publicField
} from "./chunk-DC5AMYBS.js";

// node_modules/nprogress-v2/dist/index.js
var require_dist = __commonJS({
  "node_modules/nprogress-v2/dist/index.js"(exports, module) {
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      NProgress: () => NProgress
    });
    module.exports = __toCommonJS(src_exports);
    function clamp(n, min, max) {
      return Math.max(min, Math.min(n, max));
    }
    function toBarPerc(n, direction) {
      if (direction === "rtl") return (1 - n) * 100;
      return (-1 + n) * 100;
    }
    function css(element, properties, value) {
      if (typeof properties === "string") {
        if (value !== void 0) {
          element.style[properties] = value;
        }
      } else {
        for (const prop in properties) {
          if (properties.hasOwnProperty(prop)) {
            const val = properties[prop];
            if (val !== void 0) {
              element.style[prop] = val;
            }
          }
        }
      }
    }
    function addClass(element, name) {
      element.classList.add(name);
    }
    function removeClass(element, name) {
      element.classList.remove(name);
    }
    function removeElement(element) {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
    var _a;
    var NProgress = (_a = class {
      // Configure NProgress with new options
      static configure(options) {
        Object.assign(this.settings, options);
        return this;
      }
      // Check if NProgress has started
      static isStarted() {
        return typeof this.status === "number";
      }
      // Set the progress status
      static set(n) {
        if (this.isPaused) return this;
        const started = this.isStarted();
        n = clamp(n, this.settings.minimum, this.settings.maximum);
        this.status = n === this.settings.maximum ? null : n;
        const progress = this.render(!started);
        const bar = progress.querySelector(
          this.settings.barSelector
        );
        const speed = this.settings.speed;
        const ease = this.settings.easing;
        progress.offsetWidth;
        this.queue((next) => {
          if (this.settings.positionUsing === "") {
            this.settings.positionUsing = this.getPositioningCSS();
          }
          css(bar, this.barPositionCSS(n, speed, ease));
          if (n === this.settings.maximum) {
            css(progress, { transition: "none", opacity: "1" });
            progress.offsetWidth;
            setTimeout(() => {
              css(progress, {
                transition: `all ${speed}ms linear`,
                opacity: "0.5"
              });
              setTimeout(() => {
                this.remove();
                next();
              }, speed);
            }, speed);
          } else {
            setTimeout(next, speed);
          }
        });
        return this;
      }
      // Start the progress
      static start() {
        if (!this.status) this.set(0);
        const work = () => {
          if (this.isPaused) return;
          setTimeout(() => {
            if (!this.status) return;
            this.trickle();
            work();
          }, this.settings.trickleSpeed);
        };
        if (this.settings.trickle) work();
        return this;
      }
      // Complete the progress
      static done(force) {
        if (!force && !this.status) return this;
        return this.inc(0.3 + 0.5 * Math.random()).set(1);
      }
      // Increment the progress
      static inc(amount) {
        if (this.isPaused) return this;
        let n = this.status;
        if (!n) {
          return this.start();
        } else if (n > 1) {
          return this;
        } else {
          if (typeof amount !== "number") {
            if (n >= 0 && n < 0.2) {
              amount = 0.1;
            } else if (n >= 0.2 && n < 0.5) {
              amount = 0.04;
            } else if (n >= 0.5 && n < 0.8) {
              amount = 0.02;
            } else if (n >= 0.8 && n < 0.99) {
              amount = 5e-3;
            } else {
              amount = 0;
            }
          }
          n = clamp(n + amount, 0, 0.994);
          return this.set(n);
        }
      }
      // Advance the progress
      static trickle() {
        if (this.isPaused) return this;
        return this.inc();
      }
      // Handle jQuery promises (for compatibility)
      static promise($promise) {
        if (!$promise || $promise.state() === "resolved") {
          return this;
        }
        let initial = 0, current = 0;
        if (current === 0) {
          this.start();
        }
        initial++;
        current++;
        $promise.always(() => {
          current--;
          if (current === 0) {
            initial = 0;
            this.done();
          } else {
            this.set((initial - current) / initial);
          }
        });
        return this;
      }
      // Render the NProgress component
      static render(fromStart = false) {
        if (this.isRendered()) {
          return document.getElementById("nprogress");
        }
        addClass(document.documentElement, "nprogress-busy");
        const progress = document.createElement("div");
        progress.id = "nprogress";
        progress.innerHTML = this.settings.template;
        const bar = progress.querySelector(
          this.settings.barSelector
        );
        const perc = fromStart ? toBarPerc(0, this.settings.direction) : `${toBarPerc(this.status || 0, this.settings.direction)}`;
        const parent = typeof this.settings.parent === "string" ? document.querySelector(this.settings.parent) : this.settings.parent;
        css(bar, {
          transition: "all 0 linear",
          transform: `translate3d(${perc}%,0,0)`
        });
        if (!this.settings.showSpinner) {
          const spinner = progress.querySelector(
            this.settings.spinnerSelector
          );
          spinner && removeElement(spinner);
        }
        if (parent !== document.body) {
          addClass(parent, "nprogress-custom-parent");
        }
        parent.appendChild(progress);
        return progress;
      }
      // Remove NProgress from the DOM
      static remove() {
        removeClass(document.documentElement, "nprogress-busy");
        const parent = typeof this.settings.parent === "string" ? document.querySelector(this.settings.parent) : this.settings.parent;
        removeClass(parent, "nprogress-custom-parent");
        const progress = document.getElementById("nprogress");
        progress && removeElement(progress);
      }
      // Pause the progress
      static pause() {
        this.isPaused = true;
        return this;
      }
      // Resume the progress
      static resume() {
        this.isPaused = false;
        return this;
      }
      // Check if NProgress is rendered in the DOM
      static isRendered() {
        return !!document.getElementById("nprogress");
      }
      // Determine the CSS positioning method to use
      static getPositioningCSS() {
        const bodyStyle = document.body.style;
        const vendorPrefix = "WebkitTransform" in bodyStyle ? "Webkit" : "MozTransform" in bodyStyle ? "Moz" : "msTransform" in bodyStyle ? "ms" : "OTransform" in bodyStyle ? "O" : "";
        if (`${vendorPrefix}Perspective` in bodyStyle) {
          return "translate3d";
        } else if (`${vendorPrefix}Transform` in bodyStyle) {
          return "translate";
        } else {
          return "margin";
        }
      }
      // Queue function for animations
      static queue(fn) {
        this.pending.push(fn);
        if (this.pending.length === 1) this.next();
      }
      static next() {
        const fn = this.pending.shift();
        if (fn) fn(this.next.bind(this));
      }
      // Compute the CSS for positioning the bar
      static barPositionCSS(n, speed, ease) {
        let barCSS = {};
        if (this.settings.positionUsing === "translate3d") {
          barCSS = {
            transform: `translate3d(${toBarPerc(n, this.settings.direction)}%,0,0)`
          };
        } else if (this.settings.positionUsing === "translate") {
          barCSS = {
            transform: `translate(${toBarPerc(n, this.settings.direction)}%,0)`
          };
        } else {
          barCSS = { "margin-left": `${toBarPerc(n, this.settings.direction)}%` };
        }
        barCSS.transition = `all ${speed}ms ${ease}`;
        return barCSS;
      }
    }, __publicField(_a, "settings", {
      minimum: 0.08,
      maximum: 1,
      template: `<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`,
      easing: "linear",
      positionUsing: "",
      speed: 200,
      trickle: true,
      trickleSpeed: 200,
      showSpinner: true,
      barSelector: '[role="bar"]',
      spinnerSelector: '[role="spinner"]',
      parent: "body",
      direction: "ltr"
    }), __publicField(_a, "status", null), // Queue for animation functions
    __publicField(_a, "pending", []), __publicField(_a, "isPaused", false), _a);
  }
});
export default require_dist();
//# sourceMappingURL=nprogress-v2_dist_index__js.js.map
