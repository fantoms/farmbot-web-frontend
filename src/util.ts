import * as _ from "lodash";
import { Color } from "./interfaces";
import { box } from "boxed_value";
import { t } from "i18next";

// http://stackoverflow.com/a/901144/1064917
// Grab a query string param by name, because react-router-redux doesn't
// support query strings yet.
export function getParam(name: string): string {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    r = regex.exec(location.search);
  return r === null ? "" : decodeURIComponent(r[1].replace(/\+/g, " "));
}

export let colors: Array<Color> = [
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "gray",
  "red"
];

/** Picks a color that is compliant with sequence / regimen color codes */
export function randomColor(): Color {
  return _.sample(colors);
}

export function defensiveClone<T>(target: T): T {
  let jsonString = JSON.stringify(target);
  return JSON.parse(jsonString || "null");
}

export interface AxiosErrorResponse {
  response?: {
    data: {
      [reason: string]: string
    };
  };
};

/** Concats and capitalizes all of the error key/value
 *  pairs returned by the /api/xyz endpoint. */
export function prettyPrintApiErrors(err: AxiosErrorResponse) {
  return _.map(safelyFetchErrors(err),
    (v, k) => `${(k || "").split("_").join(" ")}: ${v.toString()}.`.toLowerCase())
    .map(str => _.capitalize(str)).join(" ");
}

/** */
function safelyFetchErrors(err: AxiosErrorResponse): { [key: string]: string } {
  // In case the interpreter gives us an oddball error message.
  if (err && err.response && err.response.data) {
    return err.response.data;
  } else {
    console.warn("DONT KNOW HOW TO HANDLE THIS ERROR MESSAGE.");
    console.dir(err);
    return { problem: "Farmbot Web App hit an unhandled exception." };
  };
}

/** Moves an array item from one position in an array to another. Note that this
 * is a pure function so a new array will be returned, instead of altering the
 * array argument.
 * SOURCE:
 *   https://github.com/granteagon/move/blob/master/src/index.js */
export function move<T>(array: T[], moveIndex: number, toIndex: number) {

  let item = array[moveIndex];
  let length = array.length;
  let diff = moveIndex - toIndex;

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length)
    ];
  } else if (diff < 0) {
    // move right
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, toIndex + 1),
      item,
      ...array.slice(toIndex + 1, length)
    ];
  }
  return array;
}

export function isMobile() {
  if (window &&
    window.innerWidth <= 800 && window.innerHeight <= 600 &&
    navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
}
/** USAGE: DYNAMICALLY plucks `obj[key]`.
 *         * `undefined` becomes `""`
 *         * `number` types are coerced to strings (Eg: "5").
 *         * `boolean` is converted to "true" and "false" (a string).
 *         * All other types raise a runtime exception (Objects, functions,
 *           Array, Symbol, etc)
 */
export function safeStringFetch(obj: any, key: string): string {
  let boxed = box(obj[key]);
  switch (boxed.kind) {
    case "undefined":
    case "null":
      return "";
    case "number":
    case "string":
      return boxed.value.toString();
    case "boolean":
      return (boxed.value) ? "true" : "false";
    default:
      let msg = `Numbers strings and null only (got ${boxed.kind}).`;
      throw new Error(msg);
  }
}

/** We don't support IE. This method stops users from trying to use the site.
 * It's unfortunate that we need to do this, but the site simply won't work on
 * old browsers and our error logs were getting full of IE related bugs. */
export function stopIE() {
  function flunk() {
    // Can't use i18next here, because old IE versions don't have promises,
    // so English only here, unfortunatly.
    alert("This app only works with modern browsers.");
    window.location.href = "https://www.google.com/chrome/";
  }

  let REQUIRED_GLOBALS = ["Promise", "console", "WebSocket"];
  // Can't use Array.proto.map because IE.
  // Can't translate the text because IE (no promises)
  for (var i = 0; i < REQUIRED_GLOBALS.length; i++) {
    if (!window.hasOwnProperty(REQUIRED_GLOBALS[i])) {
      flunk();
    }
  }
  let REQUIRED_ARRAY_METHODS = ["includes", "map", "filter"];
  for (i = 0; i < REQUIRED_ARRAY_METHODS.length; i++) {
    if (!Array.prototype.hasOwnProperty(REQUIRED_ARRAY_METHODS[i])) {
      flunk();
    }
  }
}

export function pick<T, K extends keyof T>(target: T, key: K): T[K] {
  return target[key];
}

/** _Safely_ check a value at runtime to know if it can be used for square
 * bracket access.
 * ```
 *   if (oneOf<User>(["email"], myVar1)) {
 *     // Safe to use `myVar1` with square bracket access.
 *   } else {
 *     // Handle errors / failures.
 *   }
 * ```
 */
export function hasKey<T>(base: (keyof T)[]) {
  return (target: T | any): target is keyof T => {
    return base.includes(target);
  };
}

/** Usefull for calculating uploads and progress bars for Promise.all */
export class Progress {
  constructor(public total: number,
    public cb: ProgressCallback,
    public completed = 0) { };

  get isDone() {
    return this.completed >= this.total;
  }

  bump = (force = false) => {
    if (force || !this.isDone) { this.cb(this); }
  }

  inc = () => { this.completed++; this.bump(); }

  finish = () => { this.completed = this.total; this.bump(true); }
}
/** If you're creating a module that publishes Progress state, you can use this
 * to prevent people from directly modifying the progress. */
export type ProgressCallback = (p: Readonly<Progress>) => void;

/** Used only for the sequence scrolling at the moment.
 * Native DOM methods just aren't standardized enough yet,
 * so this is an implementation without libs or polyfills. */
export function smoothScrollToBottom() {
  let body = document.body;
  let html = document.documentElement;

  // Not all browsers for mobile/desktop compute height the same, this fixes it.
  let height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);

  let startY = window.pageYOffset;
  let stopY = height;
  let distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }

  // Higher the distance divided, faster the scroll.
  // Numbers too low will cause jarring ui bugs.
  let speed = Math.round(distance / 14);
  if (speed >= 6) { speed = 14; };
  let step = Math.round(distance / 25);
  let leapY = stopY > startY ? startY + step : startY - step;
  let timer = 0;
  if (stopY > startY) {
    for (let i = startY; i < stopY; i += step) {
      setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
      leapY += step;
      if (leapY > stopY) { leapY = stopY; }
      timer++;
    } return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
    leapY -= step; if (leapY < stopY) { leapY = stopY; }
    timer++;
  }
}

/** Fancy debug */
var last = "";
export function fancyDebug(t: any) {
  var next = Object
    .entries(t)
    .map((x: any) => `${_.padRight(x[0], 20, " ")} => ${JSON.stringify(x[1]).slice(0, 52)}`)
    .join("\n");
  if (last === next) {
  } else {
    last = next;
    console.log(next);
  }
  console.log();
}
