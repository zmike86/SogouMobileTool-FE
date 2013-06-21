/**
 * Rank component
 * @creator Leo
 */

(function (global, undefined) {

    dojo.declare('website.Portal.Rank', [website.IComponent], {
        // 属性
        parentControl: null,
        content: null,
        template: null,
        _handlers: null,
        // 元素
        titledom: null,
        moredom: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.titledom = dojo.query('div.title', this.container)[0];
            this.moredom = dojo.query('span.more', this.titledom)[0];
            this.content = dojo.query('ul.list', this.container)[0];
            this._handlers = [];

            this.type = configObject.type;
            dojo.addClass(this.titledom, (this.type === 'app' ? 'apptitle' : 'gametitle'));

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

            me._handlers.push(dojo.connect(this.moredom, 'mouseenter', function(evt) {
                dojo.addClass(evt.target, 'hover');
            }));
            me._handlers.push(dojo.connect(this.moredom, 'mouseleave', function(evt) {
                dojo.removeClass(evt.target, 'hover press');
            }));
            me._handlers.push(dojo.connect(this.moredom, 'mousedown', function(evt) {
                dojo.addClass(evt.target, 'press');
            }));
            me._handlers.push(dojo.connect(this.moredom, 'mouseup', function(evt) {
                dojo.removeClass(evt.target, 'press');
            }));
            me._handlers.push(dojo.connect(this.moredom, 'click', function(){
                window.location = 'Top.html?type=' + me.type;
            }));
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