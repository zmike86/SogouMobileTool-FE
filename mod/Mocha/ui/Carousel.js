/**
 * Carousel component
 */

(function (global, undefined) {

    dojo.declare('Sogou.ui.Carousel', null, {

        // attr
        prevBtnCls: 'Sogou-ui-prev-btn',
        nextBtnCls: 'Sogou-ui-next-btn',
        disableBtnCls: 'Sogou-ui-disable-btn',
        config: null,
        // dom
        prevBtn: null,
        nextBtn: null,
        // component
        switchable: null,

        constructor: function (configObject) {
            var cfg = dojo.mixin(dojo.clone(defaultCfg), configObject);
            this.config = dojo.mixin({}, cfg);
            this.config.plugins = [
                new Sogou.mod.Effects()
            ];
            this.switchable = new Sogou.mod.Switchable(this.config);

            var config = this.config,
                disableCls = config.disableBtnCls;

            dojo.connect(config.prevBtn, 'click', this, function(evt) {
                dojo.stopEvent(evt);
                var target = evt.target;
                if (!dojo.hasClass(target, disableCls)) {
                    this.switchable.prev();
                }
            });
            dojo.connect(config.nextBtn, 'click', this, function (evt) {
                dojo.stopEvent(evt);
                var target = evt.target;
                if (!dojo.hasClass(target, disableCls)) {
                    this.switchable.next();
                }
            });

            var onPublish = dojo.hitch(this, function () {
                dojo.publish(this.switchable.gid + ':itemselected', { item: this });
            });

            if (!config.circular) {
                dojo.subscribe(this.switchable.gid + ':onswitch', this, function (ev) {
                    var i = ev.currentIndex,
                        disableBtn = (i === 0) ? config.prevBtn
                            : ((i === this.switchable.length - 1) ? config.nextBtn
                            : undefined);

                    dojo.removeClass(config.prevBtn, disableCls);
                    dojo.removeClass(config.nextBtn, disableCls);
                    if (disableBtn)
                        dojo.addClass(disableBtn, disableCls);
                });
            }

            // publish itemselected event
            dojo.query(this.panels).connect('click', onPublish);
            dojo.query(this.panels).connect('focus', onPublish);
        }
    });

    var defaultCfg = {
        effect: 'scrollx',
        hasTriggers: false,
        circular: false,
        autoplay: false
    };

})(this);
