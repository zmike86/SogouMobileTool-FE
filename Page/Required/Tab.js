/**
 * @description module logic for Required tab
 * @creator Leo
 */
(function (global, undefined) {

    dojo.declare('website.Required.Tab', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,
        _handlers: null,
        // 元素
        sorter: null,
        panel: null,
        currentSort: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            var query = dojo.query('ul', this.container);
            this.sorter = query[0];
            this.panel = query[1];
            this._handlers = [];

            // 只绑定必要事件
            this.bind();
            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 绑定必要事件
         */
        bind: function () {
            // 切换tab
            dojo.connect(this.sorter, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'LI') {
                    var sorter = target.getAttribute('sortid');
                    var shim = [sorter];
                    dojo.hash(shim.join('/'));
                }
            });
        },

        /**
         * 绑定数据后绑定事件
         */
        bindPanel: function () {
            var me = this;
            // 面板的鼠标响应
            dojo.query('li', this.panel).onmouseenter(function (e) {
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function (e) {
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
        },

        /**
         * @implements IDispose
         */
        dispose: function () {
            this.disposeInternal_();
        },

        /**
         * @implements IDispose
         */
        disposeInternal_: function () {
            dojo.forEach(this._handlers, function (handle) {
                dojo.disconnect(handle);
            });
            this._handlers = [];
        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json || json.totalCount == 0) {
                this.dispose();
                dojo.empty(this.panel);
                this.show();
                this.setFocus();
                return;
            }

            this.dispose();
            var html = this.template.render(json);
            this.panel.innerHTML = html;

            this.show();
            this.setFocus();
            this.bindPanel();
        },

        /**
         * @override IPager
         */
        setFocus: function () {
            var sort = this.parentControl.category,
                currentSort = dojo.query('li[sortid=' + sort + ']', this.sorter)[0];

            if (!this.currentSort) {
                this.currentSort = dojo.query('li[sortid=' + sort + ']', this.sorter)[0];
                dojo.addClass(this.currentSort, 'selected');
            } else if (this.currentSort !== currentSort) {
                dojo.removeClass(this.currentSort, 'selected');
                this.currentSort = currentSort;
                dojo.addClass(this.currentSort, 'selected');
            }
        }

    });

})(this);
