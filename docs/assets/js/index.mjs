import {
  personal,
  personalClass,
  sourceAny,
  sourceApplied,
  sourceChain,
  sourceMap,
  sourceOf,
  value,
  patron,
} from "silentium";
import {
  concatenated,
  loading,
  record,
  regexpReplaced,
  router,
  tick,
  not,
  path,
} from "silentium-components";
import {
  classRemoved,
  element,
  fetched,
  historyNewPate,
  historyPoppedPage,
  html,
  link,
  log,
  styleInstalled,
  visible,
} from "silentium-web-api";
import "./components.mjs";

// Initializing components with predefined values
const nativeHistoryUrl = historyNewPate.bind(null, window.history);
const nativeElement = element.bind(
  null,
  personalClass(window.MutationObserver),
  window.document,
);
const nativeLog = log.bind(null, window.console);
const nativeFetched = fetched.bind(null, {
  fetch: window.fetch.bind(window),
});

// Url source
const basePath = concatenated([window.location.origin, "/docs/"]);
const urlSrc = nativeHistoryUrl(
  sourceAny([
    historyPoppedPage(window, sourceOf()),
    window.location.href,
    concatenated([
      window.location.origin,
      window.location.pathname,
      link(nativeElement("body"), ".dynamic-navigation"),
    ]),
  ]),
);

// Loading main styles and remove loading class on body after styles loaded
const bodyStylesReady = sourceChain(
  styleInstalled(
    window.document,
    nativeFetched(
      record({
        method: "get",
        url: "https://raw.githubusercontent.com/kosukhin/patorn-design-system/refs/heads/main/dist/assets/index.css",
      }),
    ),
  ),
  window.document.body,
);
classRemoved(bodyStylesReady, "body-loading");

// All errors collected here
const errors = sourceOf();
nativeLog("ERROR: ", errors);

// Building routes of SPA
const routesRequestSrc = record({
  method: "get",
  url: concatenated([basePath, "routes.json"]),
});
const routesSrc = sourceApplied(
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
    {
      pattern: "\\.html$",
      template: "pages/index.html",
    },
  ]),
);

// Template content fetching
const templateSrc = tick(router(urlSrc, routesSrc, "pages/404.html"));
const templateRequestSrc = record({
  method: "get",
  url: concatenated([basePath, templateSrc]),
});
const templateContentSrc = nativeFetched(templateRequestSrc, errors);

// Template loading visualization
const templateContentLoadingSrc = loading(urlSrc, templateContentSrc);
visible(templateContentLoadingSrc, nativeElement("article.container .loader"));
visible(
  not(templateContentLoadingSrc),
  nativeElement("article.container .page-area"),
);
html(nativeElement("article.container .page-area"), templateContentSrc);

// Template title
value(
  path(
    nativeElement(sourceChain(templateContentSrc, ".page-title")),
    "textContent",
  ),
  patron((v) => (window.document.title = v)),
);
