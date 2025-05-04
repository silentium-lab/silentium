import {
  sourceOf,
  sourceMap,
  personal,
  sourceApplied,
  sourceChain,
} from "silentium";
import {
  log,
  fetched,
  styleInstalled,
  classToggled,
  element,
  html,
} from "silentium-web-api";
import {
  concatenated,
  record,
  regexpReplaced,
  router,
} from "silentium-components";
import "./components.mjs";

const nativeElement = element.bind(
  null,
  personal((...args) => new window.MutationObserver(...args)),
  window.document,
);
const nativeLog = log.bind(null, window.console);
const nativeFetched = fetched.bind(null, {
  fetch: window.fetch.bind(window),
});

const basePath = concatenated([window.location.origin, "/docs/"]);
const urlSrc = nativeLog("url: ", window.location.href);

const bodyStylesReady = sourceChain(
  nativeLog(
    "style installed: ",
    styleInstalled(
      window.document,
      nativeFetched(
        record({
          method: "get",
          url: "https://raw.githubusercontent.com/kosukhin/patorn-design-system/refs/heads/main/dist/assets/index.css",
        }),
      ),
    ),
  ),
  window.document.body,
);
classToggled(bodyStylesReady, "body-loading");

const errors = sourceOf();
nativeLog("ERROR: ", errors);

const routesRequestSrc = record({
  method: "get",
  url: concatenated([basePath, "routes.json"]),
});

const routesSrc = nativeLog(
  "routes: ",
  sourceApplied(
    sourceMap(
      sourceApplied(nativeFetched(routesRequestSrc, errors), JSON.parse),
      personal((route) =>
        record({
          pattern: regexpReplaced(route, "pages/(.+).html", "#/$1/?$"),
          template: route,
        }),
      ),
    ),
    Array.prototype.concat.bind([
      {
        pattern: "#/$",
        template: "pages/index.html",
      },
    ]),
  ),
);

const templateSrc = nativeLog(
  "template: ",
  router(urlSrc, routesSrc, "pages/404.html"),
);

const templateRequestSrc = record({
  method: "get",
  url: concatenated([basePath, templateSrc]),
});

const templateContentSrc = nativeLog(
  "content: ",
  nativeFetched(templateRequestSrc, errors),
);

const contentSrc = nativeLog("el: ", nativeElement("article.container"));
html(contentSrc, templateContentSrc);
