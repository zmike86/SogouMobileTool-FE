/**
 * ImageLoader Effects plugin collection, for the component which
 * inherited from ImageLoader.
 * @creator {Person} Leo
 */
;(function(global, undefined) {

    //dojo.require("Mocha.mod.ImageLoader");
    //dojo.require("dojo.fx");

    var ImageLoader = Mocha.mod.ImageLoader;
    var Effects;

    // insert default props for effect plugin
    // and should be directly modified
    dojo.mixin(ImageLoader.Config, {
        effect: 'none', // can be custom effect fn
        duration: 500,
        easing: dojo.fx.easing.sineInOut,
        nativeAnim: true // left for css3
    });

    /**
     * Add static property to ImageLoader Class
     * There are totally three animation types
     * @enum {function}
     */
    ImageLoader.Effects = {
        /**
         * No effect will be applied
         * @param {Element} img
         * @param {function} callback
         */
        none: function (img, callback) {
            if (!img.loaded) {
                var me = this;
                var handler;
                handler = dojo.connect(img, 'load', this, function (evt) {
                    img.loaded = true;

                    /* Remove image from array so it is not looped next time. */
                    this.imgList = dojo.filter(this.imgList, function(img) {
                        return !img.loaded;
                    });

                    dojo.disconnect(handler);

                    if (this.imgList.length === 0 &&
                        this.config.event === 'scroll')
                        dojo.disconnect(this.h_Scroll);
                });

                img.src = img.getAttribute(me.config.data_attribute);
            }
            callback();
        },
        /**
         * Fade effect will be applied
         * @param {Element} img
         * @param {function} callback
         */
        fade: function (img, callback) {
            if (!img.loaded) {
                var me = this;
                var handler;
                var maskImg = document.createElement('img');
                var config = this.config,
                    anim;

                handler = dojo.connect(maskImg, 'load', this, function (evt) {
                    img.loaded = true;

                    dojo.style(img, 'opacity', 0);
                    img.src = img.getAttribute(me.config.data_attribute);
                    anim = dojo.fadeIn({
                        node: img,
                        duration: config.duration,
                        onEnd: function() {
                            anim = undefined;
                            callback();
                        }
                    });
                    anim.play();

                    /* Remove image from array so it is not looped next time. */
                    this.imgList = dojo.filter(this.imgList, function(img) {
                        return !img.loaded;
                    });

                    dojo.disconnect(handler);

                    if (this.imgList.length === 0 && this.config.event === 'scroll') {
                        dojo.disconnect(this.h_Scroll);
                    }

                });

                maskImg.src = img.getAttribute(me.config.data_attribute);
            }
        }
    };

    Effects = ImageLoader.Effects;

    ImageLoader.Plugins.push({
        name: 'effect',
        /**
         * Mixin
         * @param {ImageLoader} host An Instance
         */
        init: function(host) {
            var config = host.config,
                effect = config.effect;

            if (effect !== 'none') {
                switch(effect) {
                    case 'fade':
                        /*
                            Here should do something to prepare for effect,
                            Impacted on img dom
                        */
                        break;
                }
            }
        }
    });

    // override super method
    dojo.extend(ImageLoader, {
        /**
         * @param {Element} img
         * @public
         */
        load: function(img) {
            var me = this,
                config = this.config,
                effect = config.effect,
                fn = dojo.isFunction(effect) ? effect : Effects[effect];

            // use the custom fn to execute effect
            fn.call(me, img, function() {});
        }

    });

})(this);
