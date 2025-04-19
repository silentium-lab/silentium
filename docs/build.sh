#!/bin/bash

echo "BEGIN"
cd docs
cp template.html index.html
sed -i "s/TPL_SILENTIUM_OOP/https:\/\/cdn.jsdelivr.net\/npm\/silentium@0.0.11\/dist\/silentium.min.mjs/g" "index.html"

sed -i "s/TPL_SILENTIUM_WEB_API/https:\/\/cdn.jsdelivr.net\/npm\/silentium-web-api@0.0.3\/dist\/silentium-web-api.min.mjs/g" "index.html"

sed -i "s/TPL_SILENTIUM_COMPONENTS/https:\/\/cdn.jsdelivr.net\/npm\/silentium-components@0.0.5\/dist\/silentium-components.min.mjs/g" "index.html"


cp template.html index-dev.html
sed -i "s/TPL_SILENTIUM_OOP/http:\/\/127.0.0.1:5502\/dist\/silentium.min.mjs/g" "index-dev.html"

sed -i "s/TPL_SILENTIUM_WEB_API/http:\/\/127.0.0.1:5501\/dist\/silentium-web-api.min.mjs/g" "index-dev.html"

sed -i "s/TPL_SILENTIUM_COMPONENTS/http:\/\/127.0.0.1:5500\/dist\/silentium-components.min.mjs/g" "index-dev.html"

sed -i "s/TPL_SILENTIUM_DESIGN/http:\/\/127.0.0.1:5502\/docs\/assets\/css\/custom.css/g" "index-dev.html"

echo "DONE!"

./buildRoutes.sh
