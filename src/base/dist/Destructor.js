"use strict";
exports.__esModule = true;
exports.destructor = void 0;
exports.destructor = function (src, destructorUser) {
    var mbDestructor;
    var theUser = null;
    var destroy = function () {
        theUser = null;
        mbDestructor === null || mbDestructor === void 0 ? void 0 : mbDestructor();
    };
    return {
        value: (function (u) {
            theUser = u;
            mbDestructor = src(function (v) {
                if (theUser) {
                    theUser(v);
                }
            });
            if (mbDestructor && destructorUser) {
                destructorUser(destroy);
            }
            return destroy;
        }),
        destroy: destroy
    };
};
