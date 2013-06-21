/**
 * @description module logic for Category page
 * @creator Leo
 */

(function (global, undefined) {

    dojo.declare('website.NewArrival.Pager', [website.IComponent, website.IPager], {
        // 属性
        parentControl: null,
        template: null,
        time: null,
        _handlers: null,
        // 元素
        refreshbtn: null,
        timespan: null,
        panel: null,
        updatePanel: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.up_template = YayaTemplate(dojo.byId(configObject.up_tmplId).innerHTML);
            this._handlers = [];
            this.container = configObject.container;
            this.refreshbtn = dojo.query('li.refresh', this.container)[0];
            this.timespan = dojo.query('li.date span', this.container)[0];
            this.mini = dojo.query('div.minipager', this.container)[0];
            this.updatePanel = dojo.query('div.updatePanel ul', this.container)[0];
            this.panel = dojo.query('ul.panel', this.container)[0];
            this.pager = dojo.query('div.pager', this.container)[0];

            // 只绑定必要事件
            this.bind();
            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 绑定必要事件
         */
        bind: function () {
            // 刷新按钮
            dojo.connect(this.refreshbtn, 'click', function (e) {
                window.location.reload();
            });
            // 绑定迷你翻页
            var prevbtn = dojo.query('span.prev', this.mini)[0];
            var nextbtn = dojo.query('span.next', this.mini)[0];

            dojo.connect(prevbtn, 'click', this, function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.replaceClass(prevbtn, 'prevhover', 'prevpress');
                var shim = [
                    this.parentControl.type,
                    parseInt(this.parentControl.pageIndex) - 1
                ];
                dojo.hash(shim.join('/'));
            });
            dojo.connect(prevbtn, 'mouseenter', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.addClass(prevbtn, 'prevhover');
            });
            dojo.connect(prevbtn, 'mouseleave', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.removeClass(prevbtn, 'prevhover prevpress');
            });
            dojo.connect(prevbtn, 'mousedown', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.addClass(prevbtn, 'prevpress');
            });
            dojo.connect(prevbtn, 'mouseup', function () {
                if (/disable/.test(prevbtn.className)) return;
                dojo.removeClass(prevbtn, 'prevpress');
            });

            dojo.connect(nextbtn,'click', this, function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.replaceClass(nextbtn, 'nexthover', 'nextpress');
                var shim = [
                    this.parentControl.type,
                    parseInt(this.parentControl.pageIndex) + 1
                ];
                dojo.hash(shim.join('/'));
            });
            dojo.connect(nextbtn,'mouseenter', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.addClass(nextbtn, 'nexthover');
            });
            dojo.connect(nextbtn,'mouseleave', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.removeClass(nextbtn, 'nexthover nextpress');
            });
            dojo.connect(nextbtn,'mousedown', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.addClass(nextbtn, 'nextpress');
            });
            dojo.connect(nextbtn, 'mouseup', function () {
                if (/disable/.test(nextbtn.className)) return;
                dojo.removeClass(nextbtn, 'nextpress');
            });
        },

        /**
         * 绑定数据后绑定事件
         */
        bindPanel: function () {
            var me = this;
            // 最新上架面板
            dojo.query('li', this.updatePanel).forEach(function (li) {
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

            // 下部普通面板
            dojo.query('li', this.panel).onmouseenter(function (e) {
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function (e) {
                dojo.removeClass(e.target, 'hover');
            }).forEach(function (li) {
                var btn = dojo.query('span.installbtn', li)[0];
                me._handlers.push(dojo.connect(btn, 'mouseenter', function () {
                if (/disable/.test(btn.className)) return;
                dojo.addClass(btn, 'installbtnhover')
            }));
                me._handlers.push(dojo.connect(btn, 'mouseleave', function () {
                if (/disable/.test(btn.className)) return;
                dojo.removeClass(btn, 'installbtnhover installbtnpress')
            }));
                me._handlers.push(dojo.connect(btn, 'mousedown', function () {
                if (/disable/.test(btn.className)) return;
                dojo.addClass(btn, 'installbtnpress')
            }));
                me._handlers.push(dojo.connect(btn, 'mouseup', function () {
                if (/disable/.test(btn.className)) return;
                dojo.removeClass(btn, 'installbtnpress')
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
                if (/disable/.test(prevbtn.className)) return;
                dojo.replaceClass(prevbtn, 'prevhover', 'prevpress');
                var shim = [
                    me.parentControl.type,
                    parseInt(me.parentControl.pageIndex) - 1
                ];
                dojo.hash(shim.join('/'));
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
                    parseInt(me.parentControl.pageIndex) + 1
                ];
                dojo.hash(shim.join('/'));
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
                        parseInt(e.target.innerHTML)
                    ];
                    dojo.hash(shim.join('/'));
                }));
            });
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
            // 第一页去掉和最新上架板块的重复数据
            if (json[this.parentControl.IDS.pager] && json[this.parentControl.IDS.pager].list
                && json[this.parentControl.IDS.updatePanel] && json[this.parentControl.IDS.updatePanel].list) {
                this.checkForRepeat(json);
            }

            if (json[this.parentControl.IDS.updatePanel]) {
                this.updatePanel.parentNode.style.display = 'block';
                this.updatePanel.innerHTML = this.up_template.render(json[this.parentControl.IDS.updatePanel]);
            } else {
                this.updatePanel.parentNode.style.display = 'none';
            }

            var html = this.template.render(json[this.parentControl.IDS.pager]);
            this.panel.innerHTML = html;
            this.timespan.innerHTML = this.getDate();
            this.totalPageCount = Math.ceil((json[this.parentControl.IDS.pager]['totalCount'] || 0) / 36);

            this.show();
            this.setFocus();
            this.bindPanel();
            this.bindPager();
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
         * 去掉两个面板的重复数据
         * @param json
         */
        checkForRepeat: function (json) {
            var or = json[this.parentControl.IDS.pager].list,
                cmp = json[this.parentControl.IDS.updatePanel].list;

            for ( var j = 0; j < cmp.length; j++ ) {
                for ( var i = 0; i < or.length; i++ ) {
                    if ( cmp[j].appid === or[i].appid ) {
                        or.splice(i--, 1);
                    }
                }
            }
            // 这一步去掉多余的请求项
            json[this.parentControl.IDS.pager].list = or.slice(0, 36);
        },

        /**
         * 格式化时间
         */
        getDate: function () {
            var d = new Date(),
                month = d.getMonth() + 1,
                day = d.getDate(),
                hour = d.getHours(),
                min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
            return '更新时间：' + month + '月' + day + '日 ' + hour + ':' + min;
        },

        /**
         * @implements IPager
         * @return {number}
         */
        getCurrentPage: function () {
            return parseInt(this.parentControl.pageIndex)
        }
    })

})(this);