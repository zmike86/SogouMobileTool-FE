/**
 * Switchable Auto-play plugin
 * @creator {Person} Leo
 */
;(function (global, undefined) {

    //dojo.require("Sogou.mod.Switchable");
    //dojo.require("dojo.fx");

    var Switchable = Sogou.mod.Switchable;

    // insert default props for circular plugin
    // and should be directly modified
    dojo.mixin(Switchable.Config, {
        circular: false
    });

    /**
     * _switchView method will invoke this
     * method in effect plugin.
     * It is a custom animation function.
     * @param from {Array.<Element>}
     * @param to {Array.<Element>}
     * @param callback {function}
     * @param index {number}
     * @param direction {number}
     */
    function circularScroll (from, to, callback, index, direction) {
        var me = this,
            config = this.config,
            len = this.length,
            activeIndex = this.activeIndex,
            isX = (config.scrollType === 'scrollx'),
            prop = isX ? 'left' : 'top',
            viewDiff = this.viewSize[isX ? 0 : 1],
            diff = -viewDiff * index,
            props = {},
            isCritical,
            isBackward = (direction === -1);

        isCritical = ((isBackward && activeIndex === 0 && index === len - 1)
            || (direction === 1 && activeIndex === len - 1 && index === 0));

        if (isCritical) {
            diff = adjustPosition.call(this, this.panels, index, isBackward, prop, viewDiff);
        }
        props[prop] = diff;

        // stop current animation first
        if (this.anim)
            this.anim.stop();

        this.anim = dojo.animateProperty({
            node: this.content,
            properties: props,
            duration: config.duration,
            easing: config.easing,
            onEnd: function() {
                if (isCritical) {
                    resetPosition.call(me, me.panels, index, isBackward, prop, viewDiff);
                }
                me.anim = undefined;
                callback();
            }
        });
        this.anim.play();
    }

    /**
     * Adjust the position of each panel when touch the bounder.
     * Before do animation
     * @param {Array.<Element>} panels
     * @param {number} index Click which trigger
     * @param {number} isBackward true represents backward (direction = -1)
     *                 and false represents forward (direction = 1)
     * @param {string} prop left | top to change the css property
     * @param {number} viewDiff The viewport's width or height per screen
     * @return {*}
     */
    function adjustPosition (panels, index, isBackward, prop, viewDiff) {
        var config = this.config,
            steps = config.steps,
            len = this.length, // how many screens
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        for (i = from; i < to; i++) {
            dojo.style(panels[i], 'position', 'relative');
            panels[i].style[prop] = ((isBackward ? -1 : 1) * viewDiff * len) + 'px';
        }

        return isBackward ? viewDiff : -viewDiff * len;
    }

    /**
     * @param panels
     * @param index
     * @param isBackward
     * @param prop
     * @param viewDiff
     */
    function resetPosition (panels, index, isBackward, prop, viewDiff) {
        var config = this.config,
            steps = config.steps,
            len = this.length,
            start = isBackward ? len - 1 : 0,
            from = start * steps,
            to = (start + 1) * steps,
            i;

        for (i = from; i < to; i++) {
            dojo.style(panels[i], 'position', '');
            dojo.style(panels[i], prop, '');
        }

        //dojo.style(this.content, prop, isBackward ? -viewDiff * (len - 1) : '');
        this.content.style[prop] = (isBackward ? -viewDiff * (len - 1) + 'px' : '');
    }

    dojo.declare('Sogou.mod.Circular', null, {
        name: 'circular',
        host: null,

        constructor: function (config) {

        },
        init: function (host) {
            var config = host.config;
            if (config.circular && /scrollx|scrolly/g.test(config.effect)) {
                config.scrollType = config.effect;
                // set the effect attr to a custom fn
                // which can replace the Effect.scroll method
                config.effect = circularScroll;
            }

            this.host = host;
            this.augment();
        },
        augment: function () {

        }
    });

})(this);