/**
 * Switchable Auto-play plugin
 * @creator {Person} Leo
 */
;(function (global, undefined) {

    //dojo.require("Sogou.mod.Switchable");
    //dojo.require("dojo.fx");

    var Switchable = Sogou.mod.Switchable;

    // insert default props for auto-play plugin
    // and should be directly modified
    dojo.mixin(Switchable.Config, {
        autoplay: false,
        interval: 4000,
        pauseOnHover: true
    });

    dojo.declare('Sogou.mod.AutoPlay', null, {

        name: 'autoplay',
        host: null,
        _handlers: null,

        constructor: function (config) {
            this._handlers = [];
            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        init: function (host) {
            var config = host.config,
                interval = config.interval,
                timer;

            if (!config.autoplay)
                return;

            if (config.pauseOnHover) {
                this._handlers.push(dojo.connect(host.ele, 'mouseenter', function (evt) {
                    host.stop();
                    host.paused = true;
                }));
                this._handlers.push(dojo.connect(host.ele, 'mouseleave', function (evt) {
                    host.paused = false;
                    startAutoplay();
                }));
            }

            function go () {
                if (host.paused)
                    return;
                host.switchTo(host.activeIndex < host.length - 1 ? host.activeIndex + 1 : 0, 1);
            }

            function startAutoplay () {
                timer = global.setInterval(function () {
                    go();
                }, interval);
            }

            //go();
            startAutoplay();

            host.stop = function () {
                if (timer) {
                    global.clearInterval(timer);
                    timer = undefined;
                }
            };

            this.host = host;
            this.augment();
        },

        augment: function () {

        },

        dispose: function () {
            dojo.forEach(this._handlers, function(handle){
                dojo.disconnect(handle);
            });
        }

    });

})(this);