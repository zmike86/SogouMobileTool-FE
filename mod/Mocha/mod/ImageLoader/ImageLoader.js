/**
 * Image lazy load component
 * @creator {Person} Leo
 */
;(function (global, undefined) {

    /**
     * Judge if the img is above current viewport
     * @param {!Element} img
     * @return {Boolean}
     */
    function aboveViewPort (img) {
        var fold, off;

        fold = this.container === document.body ?
            document.body.scrollTop :
            this.container.scrollTop;

        off = this.container === document.body ?
            img.getBoundingClientRect().bottom + this.threshold :
            img.offsetTop + this.threshold + img.offsetHeight;

        return fold >= off;
    }

    /**
     * Judge if the img is left to current viewport
     * @param {!Element} img
     * @return {Boolean}
     */
    function leftViewPort (img) {
        var fold, off;
        fold = this.container === document.body ?
            document.body.scrollLeft :
            this.container.scrollLeft;

        off = this.container === document.body ?
            img.getBoundingClientRect().left + this.threshold + img.offsetWidth:
            img.offsetLeft + this.threshold + img.offsetWidth;

        return fold >= off;
    }

    /**
     * Judge if the img is right beyond current viewport
     * @param {!Element} img
     * @return {Boolean}
     */
    function rightViewPort (img) {
        var fold, off;
        fold = this.container === document.body ?
            document.documentElement.clientWidth :
            this.container.scrollLeft + this.container.clientWidth;

        off = this.container === document.body ?
            img.getBoundingClientRect().left - this.threshold :
            img.offsetLeft - this.threshold;

        return fold <= off;
    }

    /**
     * Judge if the img is below current viewport
     * @param {!Element} img
     * @return {Boolean}
     */
    function belowViewPort (img) {
        var fold, off;
        fold = this.container === document.body ?
            document.documentElement.clientHeight :
            this.container.scrollTop + this.container.clientHeight;

        off = this.container === document.body ?
            img.getBoundingClientRect().top - this.threshold :
            img.offsetTop - this.threshold;

        return fold <= off;
    }

    /**
     * triggered when scroll、window.resize or window.load
     * @private
     */
    function update () {
        var counter = 0,
            config = this.config;

        dojo.forEach(this.imgList, function (img, index) {
            if (config.skipInvisible &&
                dojo.getComputedStyle(img).display === 'none')
                return;

            if (aboveViewPort.call(config, img) || leftViewPort.call(config, img)) {

            }
            else if (!belowViewPort.call(config, img) && !rightViewPort.call(config, img)) {
                this.load(img);
                counter = 0;
            }
            else {
                if (++counter > config.failureLimit) {
                    return false;
                }
            }

        }, this);
    }

    dojo.declare('Mocha.mod.ImageLoader', null, {

        // attr
        config:       null,
        scrollTimer:  null,
        scrollHandle: null,
        placeholder:  null,
        effect:       null,
        // dom
        container:    null,
        scope:        null,
        imgList:      null,
        // handlers
        h_Scroll:      null,
        h_Custom:      null,
        h_Resize:      null,
        h_Load:        null,


        constructor: function (config) {
            var cfg = dojo.mixin(dojo.clone(Mocha.mod.ImageLoader.Config), config);
            this.config = dojo.mixin(this.config || {}, cfg);

            this.container = config.container || document.body;
            this.scope = (this.container === document.body ? window : this.container);
            this.imgList = dojo.query('img', this.container);
            this.effect = this.config.effect;

            dojo.forEach(this.imgList, function(img, index) {
                // custom attr
                img.loaded = false;
            }, this);

            this._bind();

            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
                dojo.connect(global, 'pageshow', this, function(event) {
                    if (event.originalEvent.persisted) {
                        dojo.forEach(this.imgList, function(img) {
                            this.load(img);
                        }, this);
                    }
                });
            }

            // initialize each plugin
            if (Mocha.mod.ImageLoader.Plugins.length > 0) {
                dojo.forEach(Mocha.mod.ImageLoader.Plugins, function(item, index) {
                    item.init(this);
                }, this);
            }
        },

        /**
         * Bind listener
         * @private
         */
        _bind: function () {
            var f = dojo.hitch(this, update);
            this.scrollHandle = function () {
                if (this.scrollTimer) {
                    clearTimeout(this.scrollTimer);
                    this.scrollTimer = undefined;
                }
                this.scrollTimer = setTimeout(function() {
                    f();
                }, 50);
            };
            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if (this.config.event === 'scroll') {
                this.h_Scroll = dojo.connect(this.scope, 'scroll', this, this.scrollHandle);
            } else {
                // custom event triggered load original image
                this.h_Custom = dojo.subscribe(this.config.event, this, function (ev) {
                    f();
                    /*
                    dojo.forEach(this.imgList, function(img, index) {
                        this.load(img);
                    }, this);
                    */
                });
            }
            this.h_Resize = dojo.connect(window, 'resize', f);
            // force to update
            this.h_Load = dojo.connect(window, 'load', f);
            f();
        },

        /**
         * Actually, this method should be override with effect plugin,
         * code here are duplicated in case the plugin file is not be imported.
         * @description set src
         * @param {Element} img
         * @public
         */
        load: function (img) {
            if (!img.loaded && this.effect === 'none') {
                var me = this;
                var handler;
                handler = dojo.connect(img, 'load', this, function (evt) {
                    img.loaded = true;

                    /* Remove image from array so it is not looped next time. */
                    this.imgList = dojo.filter(this.imgList, function(img) {
                        return !img.loaded;
                    });

                    dojo.disconnect(handler);

                    if(this.imgList.length === 0 &&
                        this.config.event === 'scroll')
                        dojo.disconnect(this.h_Scroll);
                });

                img.src = img.getAttribute(me.config.data_attribute);
            }
        },

        /**
         * destroy the instance
         */
        destroy: function () {
            this.reset();
        },

        /**
         * If dynamically add img to the viewport scope, reset method
         * should be invoked.
         */
        reset: function () {
            this.h_Resize && dojo.disconnect(this.h_Resize);
            this.h_Load && dojo.disconnect(this.h_Load);
            if (this.h_Scroll) {
                dojo.disconnect(this.h_Scroll);
            } else if (this.h_Custom) {
                dojo.unsubscribe(this.h_Custom);
            }

            this.config = this.scrollTimer = this.scrollHandle = this.placeholder = this.effect
            = this.container = this.scope = this.imgList = null;
        }
    });

    /**
     * Static attr
     * @type {Object} default configuration object
     */
    Mocha.mod.ImageLoader.Config = {
        interval        : 300,
        threshold       : 0,
        failureLimit    : 10,
        event           : 'scroll',
        effect          : 'none',
        data_attribute  : 'original',
        skipInvisible   : true
    };

    /**
     * Static attr
     * @type {Array} self's plugins collection
     */
    Mocha.mod.ImageLoader.Plugins = [];

})(this);


/*
 Notes:
    为了得到较为准确的定位和盒子的长宽,懒加载的元素及其容器要使用block显示,
    写样式时可以为img加上float,但display一定为block.
    如果使用前端模板, 注意不要使用img的src而是配置参数data_attribute保存图片网络地址

 Reference:
     http://www.appelsiini.net/projects/lazyload
     https://developer.mozilla.org/en-US/docs/Determining_the_dimensions_of_elements
     http://msdn.microsoft.com/en-us/library/ms530302(VS.85).aspx
 */
