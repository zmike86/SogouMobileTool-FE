/**
 * Static Panel component
 */

(function (global, undefined) {

    dojo.declare('website.Result.Panel', [website.IComponent], {
        // 属性
        config: null,
        parentControl: null,
        template: null,
        _handlers: null,
        // 元素
        content: null,
        moredom: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.content = dojo.query('ul.panel', this.container)[0];
            this.parentControl = configObject.parent;
            this.moredom = dojo.query('span.more', this.container)[0];
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this._handlers = [];

            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json || !json.list) return;

            this.dispose();
            var html = this.template.render(json);
            this.content.innerHTML = html;
            this.data = json;
            this.bind();
            this.show();
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {
            var me = this;

            dojo.query('li', this.content).onmouseenter(function(e){
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function(e){
                dojo.removeClass(e.target, 'hover');
            }).forEach(function (li) {
                var btn = dojo.query('span.installbtn', li)[0];
                me._handlers.push(dojo.connect(btn, 'mouseenter', function () {
                    if (/disable/.test(btn.className)) return;
                    dojo.addClass(btn, 'installbtnhover');
                }));
                me._handlers.push(dojo.connect(btn, 'mouseleave', function () {
                    if (/disable/.test(btn.className)) return;
                    dojo.removeClass(btn, 'installbtnhover installbtnpress');
                }));
                me._handlers.push(dojo.connect(btn, 'mousedown', function () {
                    if (/disable/.test(btn.className)) return;
                    dojo.addClass(btn, 'installbtnpress');
                }));
                me._handlers.push(dojo.connect(btn, 'mouseup', function () {
                    if (/disable/.test(btn.className)) return;
                    dojo.removeClass(btn, 'installbtnpress');
                }));
                me._handlers.push(dojo.connect(btn, 'click', me, website.EventManager.on));

            });

            me._handlers.push(dojo.connect(me.moredom, 'mouseover', function () {
                dojo.addClass(me.moredom, 'hover');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'mouseout', function () {
                dojo.removeClass(me.moredom, 'hover press');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'mousedown', function () {
                dojo.addClass(me.moredom, 'press');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'mouseup', function () {
                dojo.removeClass(me.moredom, 'press');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'click', function () {
                window.location = 'Portal.html?type=' + me.parentControl.type;
            }));
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