"use strict";
exports.__esModule = true;
exports.OwnerPool = void 0;
/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
var OwnerPool = /** @class */ (function () {
    function OwnerPool() {
        var _this = this;
        this.owners = new Set();
        this.innerOwner = function (v) {
            _this.owners.forEach(function (g) {
                g(v);
            });
        };
    }
    OwnerPool.prototype.owner = function () {
        return this.innerOwner;
    };
    OwnerPool.prototype.size = function () {
        return this.owners.size;
    };
    OwnerPool.prototype.has = function (owner) {
        return this.owners.has(owner);
    };
    OwnerPool.prototype.add = function (owner) {
        this.owners.add(owner);
        return this;
    };
    OwnerPool.prototype.remove = function (g) {
        this.owners["delete"](g);
        return this;
    };
    OwnerPool.prototype.destroy = function () {
        var _this = this;
        this.owners.forEach(function (g) {
            _this.remove(g);
        });
        return this;
    };
    return OwnerPool;
}());
exports.OwnerPool = OwnerPool;
