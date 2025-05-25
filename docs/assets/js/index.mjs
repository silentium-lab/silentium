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
  memo,
  moment,
  not,
  path,
  record,
  regexpMatch,
  regexpMatched,
  regexpReplaced,
  router,
  set,
  tick,
  shot,
  onlyChanged,
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

// Url source
const basePath = concatenated([
  window.location.origin,
  regexpReplaced(window.location.pathname, "index(-dev)?\\.html", ""),
]);
window.basePath = basePath;

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
  concatenated(["#/", window.langSrc, "/"]),
  "#/",
);

window.urlSrc = urlSrc;

const langUrlPartSrc = branch(
  isDefaultLangSrc,
  "/",
  concatenated(["/", window.langSrc, "/"]),
);

nativeHistoryUrl(
  regexpReplaced(urlSrc, "#/", concatenated(["#", langUrlPartSrc])),
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
      pattern: "/$",
      template: "index.html",
    },
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
          concatenated([
            basePath,
            "layouts",
            langUrlPartSrc,
            "terminology.html",
          ]),
        ),
        branch(
          regexpMatched("/examples/", urlSrc),
          concatenated([basePath, "layouts", langUrlPartSrc, "examples.html"]),
        ),
      ]),
    ),
  }),
);
html(nativeElement("article.container .page-area"), layoutContentSrc);

const templateUrlSrc = deferred(urlSrc, layoutContentSrc);

const templateLangUrlPartSrc = deferred(langUrlPartSrc, layoutContentSrc);

// Template content fetching
const templateSrc = tick(router(templateUrlSrc, routesSrc, "404.html"));

const templateRequestSrc = record({
  method: "get",
  url: memo(
    concatenated([basePath, "pages", templateLangUrlPartSrc, templateSrc]),
  ),
});

const templateContentSrc = nativeFetched(templateRequestSrc, errors);
window.urlChanged = shot(urlSrc, onlyChanged(urlSrc));

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

// chunks rendering
const chunkError = sourceOf();
value(chunkError, patron(errors));
sourceSync(
  sourceMap(
    sourceChain(templateContentSrc, nativeElements(".chunk")),
    lazy((el) => {
      return html(
        el,
        sourceAny([
          sourceChain(chunkError, "ChunkError!"),
          nativeFetched(
            record({
              method: "get",
              url: concatenated([
                basePath,
                "chunks",
                moment(langUrlPartSrc),
                attribute("data-url", el),
              ]),
            }),
            chunkError,
          ),
        ]),
      );
    }),
  ),
);

// scripts alive on new loaded page
value(
  templateContentSrc,
  patron(() => {
    window.setTimeout(() => {
      window.hljs.highlightAll();
    }, 0);
    const destination = window.document.querySelector(
      "article.container .page-area",
    );
    destination.querySelectorAll("script").forEach((x) => {
      if (x.getAttribute("type") === "text/template") {
        return;
      }

      if (x.getAttribute("data-listing")) {
        const listingEl = window.document.querySelector(
          x.getAttribute("data-listing"),
        );
        if (listingEl) {
          listingEl.textContent = x.innerText.trim();
        }
      }

      const sc = window.document.createElement("script");
      sc.setAttribute("type", "module");
      sc.appendChild(window.document.createTextNode(x.innerText));
      destination.appendChild(sc);
    });
  }),
);
