/**
 * Slide component
 * @creator Leo
 */

(function(){
    dojo.declare('website.Portal.Slide', [website.IComponent], {
        // 属性
        config: null,
        parentControl: null,
        hasData: false,
        _handlers: null,
        // 组件
        slide: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.config = configObject;
            this.container = this.config.container;
            this.parentControl = this.config.parent;
            this._handlers = [];

            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 轮播的功能可用
         */
        init: function () {
            if (this.hasData)
                this.start();
        },

        /**
         * 初始化tab组件
         */
        start: function () {
            if (!this.slide) {
                this.slide = new Sogou.ui.Slide(this.config);
            }
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {

        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            var i, a, img, li,
                triggersContainer = dojo.query('ul.triggers', this.container)[0],
                panelsContainer = dojo.query('div.panel', this.container)[0];

            if (!json || !json.list) return;

            this.dispose();
            this.data = json.list;
            for (i = 0; i < this.data.length; i++) {
                var icon = decodeURIComponent(this.data[i].icon),
                    alt = decodeURIComponent(this.data[i].tip),
                    id = decodeURIComponent(this.data[i].id);

                img = dojo.create('img', {
                    original: icon,
                    src: icon,
                    alt: alt,
                    id: id,
                    type: this.data[i].type
                });

                a = document.createElement('a');
                a.appendChild(img);
                a.href = 'final.html?appid=' + id;
                panelsContainer.appendChild(a);

                li = document.createElement('li');
                if (i === 0)
                    dojo.addClass(li, 'selected');
                triggersContainer.appendChild(li);
            }

            this.config.triggers = dojo.query('ul.triggers li', this.container);
            this.config.panels = dojo.query('div.panel a', this.container);

            this.bind();
            this.show();

            this.hasData = true;
        },

        /**
         * @implements IDispose
         */
        disposeInternal_: function () {
            if (this.slide && this.slide.dispose) {
                this.slide.dispose();
            }
            dojo.forEach(this._handlers, function (handle) {
                dojo.disconnect(handle);
            });
            this._handlers = [];
        }

    });
})();
