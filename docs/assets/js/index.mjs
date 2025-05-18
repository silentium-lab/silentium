import {
  lazy,
  lazyClass,
  patron,
  sourceAny,
  sourceApplied,
  sourceChain,
  sourceMap,
  sourceMemoOf,
  sourceOf,
  sourceSync,
  value,
} from "silentium";
import {
  branch,
  concatenated,
  deferred,
  loading,
  not,
  path,
  record,
  regexpMatch,
  regexpMatched,
  regexpReplaced,
  router,
  set,
  tick,
  memo,
  lock,
} from "silentium-components";
import {
  attribute,
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
// const nativeLog = log.bind(null, () => {});
const nativeFetched = fetched.bind(null, {
  fetch: window.fetch.bind(window),
});

// Internationalization
const defaultLang = "ru";
const langFromUrlSrc = sourceAny([
  "ru",
  path(regexpMatch("/(\\w{2})/", window.location.hash), "1"),
]);
window.langSrc = sourceMemoOf(langFromUrlSrc);
set(nativeElement(".lang-select"), "value", window.langSrc);
const isDefaultLangSrc = sourceApplied(
  window.langSrc,
  (l) => l === defaultLang,
);

nativeLog("lang:", window.langSrc);

// Url source
const basePath = concatenated([window.location.origin, "/docs/"]);
nativeLog("basePath: ", basePath);
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

nativeLog("isDefaultLangSrc: ", isDefaultLangSrc);

nativeHistoryUrl(
  nativeLog(
    "nativeHistoryUrl = ",
    branch(
      sourceChain(urlSrc, window.langSrc, isDefaultLangSrc),
      urlSrc,
      regexpReplaced(urlSrc, "#/", concatenated(["#/", window.langSrc, "/"])),
    ),
  ),
);

nativeLog("url: ", urlSrc);

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

const layoutContentSrc = nativeFetched(
  record({
    method: "get",
    url: tick(
      sourceAny([
        concatenated([basePath, sourceChain(urlSrc, "layouts/default.html")]),
        branch(
          regexpMatched("/source/", urlSrc),
          concatenated([basePath, "layouts/source.html"]),
        ),
        branch(
          regexpMatched("/patron/", urlSrc),
          concatenated([basePath, "layouts/patron.html"]),
        ),
        branch(
          regexpMatched("/guest/", urlSrc),
          concatenated([basePath, "layouts/guest.html"]),
        ),
        branch(
          regexpMatched("/utils/", urlSrc),
          concatenated([basePath, "layouts/utils.html"]),
        ),
        branch(
          regexpMatched("/terminology/", urlSrc),
          concatenated([basePath, "layouts/terminology.html"]),
        ),
        branch(
          regexpMatched("/examples/", urlSrc),
          concatenated([basePath, "layouts/examples.html"]),
        ),
      ]),
    ),
  }),
);
html(nativeElement("article.container .page-area"), layoutContentSrc);

nativeLog(
  "layoutContentSrc",
  sourceApplied(layoutContentSrc, (v) => v.length),
);

const templateUrlSrc = deferred(urlSrc, layoutContentSrc);

const langUrlPartSrc = branch(
  isDefaultLangSrc,
  "/",
  concatenated(["/", window.langSrc, "/"]),
);
nativeLog("langUrlPartSrc:", langUrlPartSrc);

const templateLangUrlPartSrc = deferred(langUrlPartSrc, layoutContentSrc);

// Template content fetching
const templateSrc = tick(router(templateUrlSrc, routesSrc, "404.html"));
nativeLog("templateSrc: ", templateSrc);
const templateRequestSrc = record({
  method: "get",
  url: memo(
    concatenated([basePath, "pages", templateLangUrlPartSrc, templateSrc]),
  ),
});
nativeLog("isDefaultLangSrc:", isDefaultLangSrc);
nativeLog("templateRequestSrc: ", templateRequestSrc);
const templateContentSrc = nativeFetched(templateRequestSrc, errors);

// Template loading visualization
const templateContentLoadingSrc = loading(urlSrc, layoutContentSrc);
visible(templateContentLoadingSrc, nativeElement("article.container .loader"));
visible(
  not(templateContentLoadingSrc),
  nativeElement("article.container .page-area"),
);
html(
  nativeElement(sourceChain(layoutContentSrc, ".layout-content")),
  templateContentSrc,
);

// Template title
value(
  path(
    nativeElement(sourceChain(templateContentSrc, ".page-title")),
    "textContent",
  ),
  patron((v) => (window.document.title = v)),
);

nativeLog(
  "templateContentSrc",
  sourceApplied(templateContentSrc, (v) => v.length),
);

// chunks rendering
const chunkError = sourceOf();
value(chunkError, patron(errors));
sourceSync(
  nativeLog(
    "chunks: ",
    sourceMap(
      nativeLog(
        "chunk elements: ",
        sourceChain(templateContentSrc, nativeElements(".chunk")),
      ),
      lazy((el) => {
        return html(
          el,
          sourceAny([
            sourceChain(chunkError, "ChunkError!"),
            nativeFetched(
              lock(
                record({
                  method: "get",
                  url: nativeLog(
                    "url chunk: ",
                    memo(
                      concatenated([
                        basePath,
                        "chunks",
                        langUrlPartSrc,
                        attribute("data-url", el),
                      ]),
                    ),
                  ),
                }),
                langUrlPartSrc,
              ),
              chunkError,
            ),
          ]),
        );
      }),
    ),
  ),
);
