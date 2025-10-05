"use strict";
exports.__esModule = true;
exports.destructor = void 0;
exports.destructor = function (src, destructorUser) {
    var mbDestructor;
    return {
        value: (function (u) {
            mbDestructor = src(u);
            if (mbDestructor && destructorUser) {
                destructorUser(mbDestructor);
            }
            return function () {
                mbDestructor === null || mbDestructor === void 0 ? void 0 : mbDestructor();
            };
        }),
        destroy: function () {
            mbDestructor === null || mbDestructor === void 0 ? void 0 : mbDestructor();
        }
    };
};
