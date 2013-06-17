/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 12-12-24
 * Time: 下午8:36
 * To change this template use File | Settings | File Templates.
 */

(function (global) {

    var toString = Object.prototype.toString;
    var PDAInfo;
    var COMMUCORE = "AppCommuCoreModule";
    var isModernBrowser = true;

    function isObject(o) {
        return toString.call(o) === "[object Object]";
    }

    if(global.LocalStorage && isObject(global.LocalStorage)) return;

    //if(localStorage === arguments[1] || Storage === arguments[1] || !(localStorage instanceof Storage))
        isModernBrowser = false;

    function read(k) {
        if(isModernBrowser) {
            return function(k) {
                return localStorage[k];
            };
        }
        else {
            return function(k) {
                var json;
                json = window.external.GetWebsiteAPPData(k);
                return json;
            };
        }
    }

    function write(k,v) {
        if(isModernBrowser) {
            return function (k,v) {
                localStorage[k] = v;
            };
        }
        else {
            return function (k,v) {
                try {
                    window.external.SetWebsiteAPPData(k, v);
                } catch (e) {
                    throw new Error("write LocalStorage Data, key is: " + k);
                }
            };
        }
    }

    function registerPDAInfo(p) {
        if(isModernBrowser) {
            return function (p) {
                return true;
            };
        }
        else {
            return function (p) {
                PDAInfo = p;
                if(!PDAInfo) throw new Error("when register PDAInfo to LocalStorage...");
            };
        }
    }

    var LocalStorage = {
        read: read(),
        write: write(),
        registerPDAInfo: registerPDAInfo()
    };

    global.LocalStorage = LocalStorage;

})(this);
