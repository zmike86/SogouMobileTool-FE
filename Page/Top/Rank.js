/**
 * @description module logic for portal page
 * @creator Leo
 */

(function (global, undefined) {

    dojo.declare('website.Top.Rank', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,
        _handlers: null,
        // 元素
        datedom: null,
        content: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.datedom = dojo.query('div.title', this.container)[0];
            this.content = dojo.query('ul.list', this.container)[0];
            this.type = configObject.type;
            this._handlers = [];

            if (configObject.className) this.setTitleClass(configObject.className);
            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {
            var me = this;
            dojo.query('li', this.content).onmouseenter(function(e) {
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function(e) {
                dojo.removeClass(e.target, 'hover');
            }).forEach(function(li) {
                var btn = dojo.query('span.installbtn', li)[0];
                me._handlers.push(dojo.connect(btn, 'mouseenter', function(evt) {
                    if (/disable/.test(btn.className)) return;
                    dojo.addClass(btn, 'installbtnhover');
                }));
                me._handlers.push(dojo.connect(btn, 'mouseleave', function(evt) {
                    if (/disable/.test(btn.className)) return;
                    dojo.removeClass(btn, 'installbtnhover installbtnpress');
                }));
                me._handlers.push(dojo.connect(btn, 'mousedown', function(evt) {
                    if (/disable/.test(btn.className)) return;
                    dojo.addClass(btn, 'installbtnpress');
                }));
                me._handlers.push(dojo.connect(btn, 'mouseup', function(evt) {
                    if (/disable/.test(btn.className)) return;
                    dojo.removeClass(btn, 'installbtnpress');
                }));
                me._handlers.push(dojo.connect(btn, 'click', me, website.EventManager.onRank));

            });
        },

        /**
         * 改变头部样式
         */
        setTitleClass: function (className) {
            dojo.addClass(this.datedom, className);
        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json) return;

            this.dispose();
            var html = this.template.render(json);
            this.content.innerHTML = html;
            this.bind();
            this.show();

            return html;
        },

        /**
         * @implements IDispose
         */
        disposeInternal_: function () {
            dojo.forEach(this._handlers, function (handle) {
                dojo.disconnect(handle);
            });
            this._handlers = [];
        }
    });

})(this);