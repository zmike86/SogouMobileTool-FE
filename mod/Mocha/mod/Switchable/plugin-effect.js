/**
 * Switchable Effects plugin
 * @creator {Person} Leo
 */
;(function (global, undefined) {

    //dojo.require('Sogou.mod.Switchable');
    //dojo.require('dojo.fx');

    var Switchable = Sogou.mod.Switchable;
    var Effects;

    // insert default props for effect plugin
    // and should be directly modified
    dojo.mixin(Switchable.Config, {
        effect: 'none', // can be custom effect fn
        duration: 500,
        easing: dojo.fx.easing.cubicInOut
    });


    dojo.declare('Sogou.mod.Effects', null, {

        name: 'effect',
        host: null, // instance

        constructor: function (config) {

        },

        init: function (host) {
            var config = host.config, effect = config.effect,
                panels = host.panels,
                content = host.content,
                steps = config.steps,
                activeIndex = host.activeIndex,
                len = panels.length;

            host.viewSize = [
                config.viewSize[0] || panels[0].offsetWidth * steps,
                config.viewSize[1] || panels[0].offsetHeight * steps
            ];

            if (effect !== 'none') {
                dojo.forEach(panels, function (panel) {
                    dojo.style(panel, 'display', 'block');
                });

                switch (effect) {
                    case 'scrollx':
                    case 'scrolly':
                        // positioning, ready for animation
                        dojo.style(content, 'position', 'absolute');
                        dojo.style(content.parentNode, 'position', 'relative');

                        if(effect === 'scrollx') {
                            dojo.query(panels).style({'float': 'left'});
                            content.style.width = host.viewSize[0] * (len / steps) + 'px';
                            //dojo.style(content, 'width', host.viewSize[0] * (len / steps));
                        }
                        break;
                    case 'fade':
                        var min = activeIndex * steps,
                            max = min + steps - 1,
                            isActivePanel;

                        dojo.forEach(panels, function (panel, i) {
                            isActivePanel = (i >= min && i <= max);
                            dojo.style(panel, {
                                opacity: isActivePanel ? 1 : 0,
                                position: 'absolute',
                                zIndex: isActivePanel ? 9 : 1
                            });
                        });
                        break;
                }
            }
            this.host = host;
            this.augment();
        },

        augment: function () {
            // 'override' super method
            dojo.mixin(this.host, {
                /**
                 * @param {number} from
                 * @param {number} to
                 * @param {number} index
                 * @param {number} direction
                 * @private
                 */
                _switchView: function (from, to, index, direction) {
                    var me = this,
                        config = this.config,
                        effect = config.effect,
                        fn = dojo.isFunction(effect) ? effect : Effects[effect];

                    fn.call(me, from, to, function () {
                        me._fireOnSwitch(index);
                    }, index, direction);
                }

            });
        }

    });

    /**
     * There are totally three animation types
     * @enum {function}
     */
    Sogou.mod.Effects.Effects = {
        /**
         * No effect will be applied
         * @param from {Array.<Element>}
         * @param to {Array.<Element>}
         * @param callback {function}
         */
        none: function (from, to, callback) {
            dojo.query(from).style({display: 'none'});
            dojo.query(to).style({display: 'block'});
            callback();
        },
        /**
         * Fade effect will be applied
         * @param from {Array.<Element>}
         * @param to {Array.<Element>}
         * @param callback {function}
         */
        fade: function (from, to, callback) {
            if (from.length !== 1) {
                throw new Error('fade effect only supports steps == 1.');
            }
            var config = this.config,
                fromEl = from[0], toEl = to[0],
                me = this;

            if (this.anim)
                this.anim.stop(true);

            dojo.style(toEl, 'opacity', 1);
            this.anim = dojo.animateProperty({
                node: fromEl,
                duration: config.duration,
                easing: config.easing,
                properties: {
                    opacity: { start: 1, end: 0 }
                },
                onEnd: function () {
                    me.anim = undefined;
                    dojo.style(toEl, 'z-index', 9);
                    dojo.style(fromEl, 'z-index', 1);
                    callback();
                }
            });
            this.anim.play();
        },
        /**
         * Slide effect will be applied
         * @param from {Array.<Element>}
         * @param to {Array.<Element>}
         * @param callback {function}
         * @param index {number}
         */
        scroll: function (from, to, callback, index) {
            var config = this.config,
                isX = (config.effect === 'scrollx'),
                diff = this.viewSize[isX ? 0 : 1] * index,
                props = {}, me= this;

            props[isX ? 'left' : 'top'] = -diff;
            if(this.anim)
                this.anim.stop();

            this.anim = dojo.animateProperty({
                node: this.content,
                duration: config.duration,
                easing: config.easing,
                properties: props,
                onEnd: function () {
                    me.anim = undefined;
                    callback();
                }
            });
            this.anim.play();
        }
    };

    Effects = Sogou.mod.Effects.Effects;
    Effects.scrollx = Effects.scrolly = Effects.scroll;


})(this);
