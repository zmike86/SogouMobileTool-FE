/**
 * @description module logic for Category page
 * @creator Leo
 */
(function () {

    dojo.declare('website.Result.Pager', [website.IComponent, website.IPager], {
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
            this._handlers = [];
            var query = dojo.query('ul', this.container);
            this.sorter = query[0];
            this.panel = query[1];
            this.pager = dojo.query('div.pager', this.container)[0];

            // 只绑定必要事件
            this.bind();
            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 绑定必要事件
         */
        bind: function () {
            // 切换排序规则
            dojo.connect(this.sorter, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'LI') {
                    var sorter = target.getAttribute('sortid');
                    var shim = [
                        this.parentControl.type,
                        this.parentControl.category,
                        sorter,
                        '1'
                    ];
                    //dojo.hash(shim.join('/'));
					location.hash = shim.join('/');
                }
            });
        },

        /**
         * 绑定数据后绑定事件
         */
        bindPanel: function () {
            var me = this;
            // 面板的鼠标响应
            dojo.query('li', this.panel).forEach(function (li) {
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
         * 绑定翻页事件
         */
        bindPager: function () {
            var me = this;
            var prevbtn = dojo.query('span.prev', this.pager)[0];
            var nextbtn = dojo.query('span.next', this.pager)[0];

            this._handlers.push(dojo.connect(prevbtn, 'click', function () {
                if (/disable/.test(prevbtn.className))
                    return;
                dojo.replaceClass(prevbtn, 'prevhover', 'prevpress');
                var shim = [
                    me.parentControl.type,
                    me.parentControl.category,
                    me.parentControl.sort,
                    parseInt(me.parentControl.pageIndex) - 1
                ];
                //dojo.hash(shim.join('/'));
				location.hash = shim.join('/');
            }));
            this._handlers.push(dojo.connect(prevbtn, 'mouseenter', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.addClass(prevbtn, 'prevhover');
            }));
            this._handlers.push(dojo.connect(prevbtn, 'mouseleave', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.removeClass(prevbtn, 'prevhover prevpress');
            }));
            this._handlers.push(dojo.connect(prevbtn, 'mousedown', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.addClass(prevbtn, 'prevpress');
            }));
            this._handlers.push(dojo.connect(prevbtn, 'mouseup', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.removeClass(prevbtn, 'prevpress');
            }));

            this._handlers.push(dojo.connect(nextbtn, 'click', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.replaceClass(nextbtn, 'nexthover', 'nextpress');
                var shim = [
                    me.parentControl.type,
                    me.parentControl.category,
                    me.parentControl.sort,
                    parseInt(me.parentControl.pageIndex) + 1
                ];
                //dojo.hash(shim.join('/'));
				location.hash = shim.join('/');
			}));
            this._handlers.push(dojo.connect(nextbtn, 'mouseenter', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.addClass(nextbtn, 'nexthover');
            }));
            this._handlers.push(dojo.connect(nextbtn, 'mouseleave', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.removeClass(nextbtn, 'nexthover nextpress');
            }));
            this._handlers.push(dojo.connect(nextbtn, 'mousedown', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.addClass(nextbtn, 'nextpress');
            }));
            this._handlers.push(dojo.connect(nextbtn, 'mouseup', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.removeClass(nextbtn, 'nextpress');
            }));

            var as = dojo.query('a', this.pager);
            dojo.forEach(as, function (a) {
                me._handlers.push(dojo.connect(a, 'click', function (e) {
                    dojo.stopEvent(e);
                    var node = e.target.parentNode;
                    if (/selected|abbr/g.test(node.className))
                        return;
                    dojo.addClass(node, 'selected');
                    var shim = [
                        me.parentControl.type,
                        me.parentControl.category,
                        me.parentControl.sort,
                        parseInt(e.target.innerHTML)
                    ];
                    //dojo.hash(shim.join('/'));
                    location.hash = shim.join('/');
                }));
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
                this.totalPageCount = 0;
                this.show();
                this.setFocus();
                return;
            }

            this.dispose();
            var html = this.template.render(json);
            this.totalPageCount = Math.ceil((json.totalCount || 0) / 14);
            this.panel.innerHTML = html;

            this.show();
            this.setFocus();
            this.bindPanel();
            this.bindPager();
        },

        /**
         * @override IPager
         */
        setFocus: function () {
            var sort = this.parentControl.sort,
                currentSort = dojo.query('li[sortid=' + sort + ']', this.sorter)[0],
                pageIndex = parseInt(this.parentControl.pageIndex);

            if (!this.currentSort) {
                this.currentSort = dojo.query('li[sortid=' + sort + ']', this.sorter)[0];
                dojo.addClass(this.currentSort, 'selected');
            } else if (this.currentSort !== currentSort) {
                dojo.removeClass(this.currentSort, 'selected');
                this.currentSort = currentSort;
                dojo.addClass(this.currentSort, 'selected');
            }

            if (this.totalPageCount === 1 || this.totalPageCount === 0) {
                this.pager.style.visibility = 'hidden';
                return;
            } else {
                this.pager.style.visibility = 'visible';
            }

            this.renderPager();

            if (pageIndex == 1) {
                dojo.query('span.prev', this.container).addClass('prevdisable');
                dojo.query('span.next', this.container).removeClass('nextdisable');
            } else if (pageIndex == this.totalPageCount) {
                dojo.query('span.prev', this.container).removeClass('prevdisable');
                dojo.query('span.next', this.container).addClass('nextdisable');
            } else {
                dojo.query('span.prev', this.container).removeClass('prevdisable');
                dojo.query('span.next', this.container).removeClass('nextdisable');
            }
        },

        /**
         * @implements IPager
         * @return {number}
         */
        getCurrentPage: function () {
            return parseInt(this.parentControl.pageIndex)
        }

    })

})();
