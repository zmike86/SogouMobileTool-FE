/**
 * Tab component
 */

(function (global, undefined) {

    dojo.declare('Sogou.ui.Tab', null, {

        // attr
        config: null,
        // component
        switchable: null,

        constructor: function (configObject) {
            var cfg = dojo.mixin(dojo.clone(defaultCfg), configObject);
            this.config = dojo.mixin({}, cfg);
            this.config.plugins = [
                new Sogou.mod.Effects()
            ];
            this.switchable = new Sogou.mod.Switchable(this.config);
        }
    });

    var defaultCfg = {
        triggerType: "click",
        effect: 'fade'
    };

})(this);
