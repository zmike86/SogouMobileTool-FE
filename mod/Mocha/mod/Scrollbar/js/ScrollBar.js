/**
 * Custom scroll bar component
 * For old ie browser
 * @description
 * @creator {Person} LiLi.Liu
 */
(function (global, undefined) {

    var mattr = 'marginTop';
    var noop = function () {},
        createScrollbar = function (con) {
            dojo.create('div', {
                className: 'scroll',
                innerHTML: '<div class = "scrollbar"> </div>'
            }, con);
        };

    // 真实内容所占高度
    var totalHeight,
        // 容器可见高度
        viewportHeight,
        // 计算滚动条的高度
        barHeight,
        //最大滚动距离
        maxScrollMargin,
        //内容的最大滚动距离
        maxListMargin;

    dojo.declare('Mocha.mod.Scrollbar', null, {

        /**
         * @typedef {Element} for which dom to attach scrollbar
         */
        container: null,

        /**
         * @typedef {Element} in the wrapper, the main content
         */
        content: null,

        /**
         * @typedef {Element} scrollbar's background
         */
        canvas: null,

        /**
         * @typedef {Element} body of bar, known as a slider
         */
        slider: null,

        /**
         * @enum {object}
         * 顶部, 中间任意位置, 底部
         */
        position: null,

        /**
         * @typedef {number}
         * 滚动快慢
         */
        speed: 0.05,

        /**
         * @type {function}
         * 滚动回调
         */
        callback: noop,

        /**
         * @type {boolean}
         * 表明是否处于可被拖动状态
         */
        actived: false,

        /**
         * 构造函数
         * @param {object} config 配置对象
         */
        constructor: function (config) {
            // dom
            this.container = config.container;
            this.content = config.content;
            // attr
            this.speed = config.speed || 0.05;
            this.position = null;
            this.callback = config.callback || noop;

            if (!this.validate())
                return null;

            createScrollbar(this.container);

            this.canvas = dojo.query('.scroll', this.container)[0];
            this.slider = dojo.query('.scrollbar', this.container)[0];

            this.adjustHeight();
            this.bind();
        },

        validate: function () {
            // 真实内容所占高度
            totalHeight = Math.round(this.content.offsetHeight);
            // 容器可见高度
            viewportHeight = Math.round(this.container.clientHeight);

            // 如果真实高度小于容器高度, 就不需要滚动条了
            return totalHeight > viewportHeight;
        },

        adjustHeight: function () {
            // hidden 去掉默认滚动条
            dojo.style(this.container, 'overflow', 'hidden');
            dojo.style(this.canvas, 'height', viewportHeight + 'px');

            // TODO: 需要设置一个最小高度
            barHeight = Math.round(( viewportHeight / totalHeight) * viewportHeight);
            maxScrollMargin = viewportHeight - barHeight;
            maxListMargin = totalHeight - viewportHeight;

            // 设置滚动条的可拖拽的高度.
            dojo.style(this.slider, 'height', barHeight + 'px');
        },

        hide: function () {
            this.canvas.style.display = 'none';
        },

        show: function () {
            this.canvas.style.display = 'block';
        },

        bind: function () {
            dojo.connect(this.slider, 'mousedown', this, function (evt) {
                this.actived = true;
                var ey = evt.clientY;
                var nowMargin = parseInt(dojo.getComputedStyle(this.slider).marginTop) || 0;
                var newMargin, boxMargin;
                var hid, iid;

                hid = dojo.connect(document.body, 'mousemove', this, function(ev) {
                    if (!this.actived) return;

                    var y = ev.clientY - ey;
                    //向下滚动... y 达到了最大滚动距离
                    if ((nowMargin + y) > maxScrollMargin) {
                        y = maxScrollMargin - nowMargin;
                    }
                    //向上滚动... y滚到顶部了
                    if ((nowMargin + y) < 0) {
                        y = -nowMargin;
                    }
                    newMargin = nowMargin + y;

                    //滚动距离等于0并且已经在最上面的话
                    if (newMargin == 0 && this.position == 'TOP') {
                        return false;
                    }
                    //滚动距离等于最大滚动距离 并且在最下面
                    if (maxScrollMargin == newMargin && this.position == 'BOTTOM') {
                        return false;
                    }
                    dojo.style(this.slider, mattr, newMargin + 'px');

                    boxMargin = maxListMargin * (newMargin / maxScrollMargin);
                    if (boxMargin > maxListMargin) {
                        boxMargin = maxListMargin;
                    }
                    dojo.style(this.content, mattr, -1 * boxMargin + 'px');

                    this.position = newMargin == 0 ? 'TOP' : (newMargin == maxScrollMargin ? 'BOTTOM' : 'defaults');

                    this.callback();
                    dojo.stopEvent(ev);
                });

                iid = dojo.connect(this.container, 'mouseup', this, function(ev) {
                    this.actived = false;
                    dojo.disconnect(hid);
                    dojo.disconnect(iid);
                    dojo.stopEvent(ev);
                });

                dojo.stopEvent(evt);
            });

            dojo.connect(this.container, 'mousewheel', this, function (evt) {
                dojo.stopEvent(evt);

                var nowMargin = parseInt(dojo.getComputedStyle(this.slider).marginTop) || 0;
                var newMargin, boxMargin;
                var delta = evt.wheelDelta;
                //向上滚动
                if (delta > 0) {
                    //滚动到顶部
                    if (nowMargin <= 0) {
                        //复位, 避免有误差
                        if (this.position != 'TOP') {
                            dojo.style(this.content, mattr, '0px');
                            this.position = 'TOP';
                        }
                        return false;
                    }
                    this.position = 'defaults';
                    newMargin = nowMargin - this.speed * maxScrollMargin;
                    boxMargin = maxListMargin * (newMargin / maxScrollMargin);
                    if (newMargin < 0) {
                        newMargin = 0;
                    }
                    dojo.style(this.slider, mattr, newMargin + 'px');

                //向下滚动
                } else if (delta < 0) {
                    //滚动到底部了
                    if (nowMargin >= maxScrollMargin) {
                        return false;
                    }
                    this.position = 'defaults';
                    newMargin = nowMargin + this.speed * maxScrollMargin;
                    boxMargin = maxListMargin * (newMargin / maxScrollMargin);
                    if (newMargin > maxScrollMargin) {
                        newMargin = maxScrollMargin;
                    }
                    dojo.style(this.slider, mattr, newMargin + 'px');
                }

                if (boxMargin > maxListMargin) {
                    boxMargin = maxListMargin;
                }
                dojo.style(this.content, mattr, -1 * boxMargin + 'px');
                this.callback();
            });

            dojo.connect(this.container, 'resize', this, function () {
                if (this.container === document.body ||
                    this.container === document.body.firstChild ||
                    this.container === document.body.firstElementChild) {

                    dojo.style(this.container, 'height', document.body.clientHeight + 'px');
                    var ret = this.validate();
                    if (ret) {
                        this.show();
                        this.adjustHeight();
                    } else {
                        this.hide();
                    }
                }
            });
        }

    });

})(this);

/**
 * Notes:
 * 1. mousewheel事件wheelDelta属性IE和标准有很大不同，目前在快速滚到上面时留白会突然变高一下再恢复正常，
 *    怀疑和此有关，应尽快研究一下
 * 2. 一般元素的:hover伪类选择器IE6是不支持的，需要添加mouseenter/mouseleave事件监听器
 * 3. 关于性能建议异步处理，每次scroll时执行的函数有部分dom操作，建议setTimeout延时处理监听器
 * 4. 在resize的监听里，假设了this.container是完全填充body的，所以设置的高度和视口一样，不过这个问题目前没有任何影响
 * 5. totalHeight,viewportHeight,barHeight,maxScrollMargin,maxListMargin应作为实例属性
 * 6. 针对点中滚动条又拖走到别的区域的事件监听，可能有更好的方案
 */
