// @ts-check

import lzString from "lz-string";

function parseQuery() {
    var query = window.location.hash.replace(/^\#\?/, '');

    if (!query) {
      return null;
    }

    return query.split('&').map(function(param) {
      var splitPoint = param.indexOf('=');

      return {
        key : param.substring(0, splitPoint),
        value : param.substring(splitPoint + 1)
      };
    }).reduce(function(params, param){
      if (param.key && param.value) {
        params[param.key] =
          param.key === "code" || param.key === "html" || param.key === "css"
            ? lzString.decompressFromEncodedURIComponent(param.value)
            : decodeURIComponent(param.value);
      }
      return params;
    }, {});
}

export function updateQuery(code, html, css) {
    var object =
        { code : lzString.compressToEncodedURIComponent(code),
          html : lzString.compressToEncodedURIComponent(html),
          css : lzString.compressToEncodedURIComponent(css) };
    var query = Object.keys(object).map(function(key) {
      return key + '=' + object[key];
    }).join('&');

    window.location.hash = '?' + query;
}

export function loadState(key) {
    return Object.assign({
        // @ts-ignore
        html: require("!raw-loader!./../../../public/samples/tour/index.html"),
        // @ts-ignore
        css: require("!raw-loader!./../../../public/samples/tour/index.css"),
        // @ts-ignore
        code: require("!raw-loader!./../../../public/samples/tour/functions.fs")
      },
      JSON.parse(window.localStorage.getItem(key)) || {},
      parseQuery()
    );
}

export function saveState(key, code, html, css) {
    window.localStorage.setItem(key, JSON.stringify({ code, html, css }));
}
