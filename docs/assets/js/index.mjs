import {
  sourceOf,
  sourceMap,
  personalClass,
  personal,
  sourceApplied,
  sourceChain,
  sourceAny,
} from "silentium";
import {
  log,
  fetched,
  styleInstalled,
  classToggled,
  element,
  html,
  link,
  historyNewPate,
  historyPoppedPage,
} from "silentium-web-api";
import {
  concatenated,
  record,
  regexpReplaced,
  router,
} from "silentium-components";
import "./components.mjs";

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
classToggled(bodyStylesReady, "body-loading");

const errors = sourceOf();
nativeLog("ERROR: ", errors);

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

const templateSrc = router(urlSrc, routesSrc, "pages/404.html");

const templateRequestSrc = record({
  method: "get",
  url: concatenated([basePath, templateSrc]),
});

const templateContentSrc = nativeFetched(templateRequestSrc, errors);

html(nativeElement("article.container"), templateContentSrc);
