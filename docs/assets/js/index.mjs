import {
  lazy,
  lazyClass,
  sourceAny,
  sourceApplied,
  sourceChain,
  sourceSync,
  sourceMap,
  sourceOf,
  sourceMemoOf,
  value,
  patron,
} from "silentium";
import {
  concatenated,
  loading,
  record,
  regexpReplaced,
  regexpMatch,
  router,
  fork,
  tick,
  not,
  path,
  set,
} from "silentium-components";
import {
  classRemoved,
  element,
  elements,
  fetched,
  historyNewPate,
  historyPoppedPage,
  html,
  link,
  log,
  styleInstalled,
  visible,
  attribute,
} from "silentium-web-api";
import "./components.mjs";

// Initializing components with predefined values
const nativeHistoryUrl = historyNewPate.bind(null, window.history);
const nativeElement = element.bind(
  null,
  lazyClass(window.MutationObserver),
  window.document,
);
const nativeElements = elements.bind(
  null,
  lazyClass(window.MutationObserver),
  window.document,
);
const nativeLog = log.bind(null, window.console);
const nativeFetched = fetched.bind(null, {
  fetch: window.fetch.bind(window),
});

// Internationalization
const defaultLang = "ru";
const landFromUrlSrc = sourceAny([
  "ru",
  path(regexpMatch("#/(\\w+)/", window.location.href), "1"),
]);
window.langSrc = sourceMemoOf(landFromUrlSrc);
const langSyncSrc = sourceSync(window.langSrc);
set(nativeElement(".lang-select"), "value", window.langSrc);

// Url source
const basePath = concatenated([window.location.origin, "/docs/"]);
const urlSrc = regexpReplaced(
  sourceAny([
    historyPoppedPage(window, sourceOf()),
    window.location.href,
    concatenated([
      window.location.origin,
      window.location.pathname,
      link(nativeElement("body"), ".dynamic-navigation"),
    ]),
  ]),
  concatenated(["/", window.langSrc, "/"]),
  "/",
);
nativeHistoryUrl(
  fork(
    window.langSrc,
    (l) => l === defaultLang,
    urlSrc,
    regexpReplaced(urlSrc, "#/", concatenated(["#/", window.langSrc, "/"])),
  ),
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
    lazy((route) =>
      record({
        pattern: regexpReplaced(route, "pages/(.+).html", "#/$1/?$"),
        template: regexpReplaced(route, "pages/", ""),
      }),
    ),
  ),
  Array.prototype.concat.bind([
    {
      pattern: "#/$",
      template: "index.html",
    },
    {
      pattern: "\\.html$",
      template: "index.html",
    },
  ]),
);

// Template content fetching
const templateSrc = tick(router(urlSrc, routesSrc, "404.html"));
const templateRequestSrc = record({
  method: "get",
  url: concatenated([
    basePath,
    fork(
      window.langSrc,
      (l) => l === defaultLang,
      "pages/",
      concatenated(["pages/", window.langSrc, "/"]),
    ),
    templateSrc,
  ]),
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

// chunks rendering
const chunkError = sourceOf();
value(chunkError, patron(errors));
sourceSync(
  sourceMap(
    nativeElements(sourceChain(templateContentSrc, ".chunk")),
    lazy((el) =>
      html(
        el,
        sourceAny([
          sourceChain(chunkError, "ChunkError!"),
          nativeFetched(
            record({
              method: "get",
              url: concatenated([
                basePath,
                fork(
                  window.langSrc,
                  (l) => l === defaultLang,
                  "chunks/",
                  concatenated(["chunks/", window.langSrc, "/"]),
                ),
                attribute("data-url", el),
              ]),
            }),
            chunkError,
          ),
        ]),
      ),
    ),
  ),
);
