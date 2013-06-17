/**
 * Slide component
 */

(function (global, undefined) {

    dojo.declare('Sogou.ui.Slide', null, {

        // attr
        config: null,
        // component
        switchable: null,

        constructor: function (configObject) {
            var cfg = dojo.mixin(dojo.clone(defaultCfg), configObject);
            this.config = dojo.mixin({}, cfg);
            this.config.plugins = [
                new Sogou.mod.Effects(),
                new Sogou.mod.AutoPlay(),
                new Sogou.mod.Circular()
            ];

            this.switchable = new Sogou.mod.Switchable(this.config);
        }
    });

    var defaultCfg = {
        triggerType: 'mouse',
        effect: 'scrollx',
        duration: 250,
        autoplay: true,
        circular: true
    };

})(this);