(function () {

    var span = 4;
    var condi = 0;
    var dom;

    dojo.declare('website.HD.Pager', [website.IComponent], {
        // attr
        parentControl: null,
        template: null,
        totalPageCount: null,
        // dom
        sorter: null,
        mini: null,
        panel: null,
        pager: null,
        currentSort: null,

        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);

            var query = dojo.query('ul', this.container);
            this.sorter = query[0];
            this.mini = dojo.query('div.minipager', this.container)[0];
            this.panel = query[1];
            this.pager = dojo.query('div.pager', this.container)[0];

            // 只绑定必要事件
            this.bind();
        },

        bind: function () {
            // 切换排序规则
            dojo.connect(this.sorter, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'LI') {
                    var sorter = target.getAttribute('sortid');
                    var shim = [
                        this.parentControl.type,
                        this.parentControl.category,
                        this.parentControl.lang,
                        sorter,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                    this.setFocus();
                }
            });
            // 绑定迷你翻页
            var prevbtn = dojo.query('span.prev', this.mini)[0];
            var nextbtn = dojo.query('span.next', this.mini)[0];

            dojo.connect(prevbtn, 'click', this, function (e) {
                if (/disable/.test(e.target.className))
                    return;
                dojo.replaceClass(e.target, 'prevhover', 'prevpress');
                var shim = [
                    this.parentControl.type,
                    this.parentControl.category,
                    this.parentControl.lang,
                    this.parentControl.sort,
                    parseInt(this.parentControl.pageIndex) - 1
                ];
                dojo.hash(shim.join('/'));
            });
            dojo.connect(prevbtn, 'mouseenter', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'prevhover');
            });
            dojo.connect(prevbtn, 'mouseleave', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'prevhover prevpress');
            });
            dojo.connect(prevbtn, 'mousedown', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'prevpress');
            });
            dojo.connect(prevbtn, 'mouseup', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'prevpress');
            });

            dojo.connect(nextbtn, 'click', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.replaceClass(e.target, 'nexthover', 'nextpress');
                var shim = [
                    this.parentControl.type,
                    this.parentControl.category,
                    this.parentControl.lang,
                    this.parentControl.sort,
                    parseInt(this.parentControl.pageIndex) + 1
                ];
                dojo.hash(shim.join('/'));
            });
            dojo.connect(nextbtn,'mouseenter', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'nexthover');
            });
            dojo.connect(nextbtn,'mouseleave', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'nexthover nextpress');
            });
            dojo.connect(nextbtn, 'mousedown', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'nextpress');
            });
            dojo.connect(nextbtn, 'mouseup', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'nextpress');
            });
        },

        bindPanel: function () {
            // 面板的鼠标响应
            dojo.query('li', this.panel).onmouseenter(function (e) {
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function (e) {
                dojo.removeClass(e.target, 'hover');
            }).forEach(function (li) {
                var btn = dojo.query('span.installbtn', li)[0];
                dojo.connect(btn, 'mouseenter', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.addClass(target, 'installbtnhover');
                });
                dojo.connect(btn, 'mouseleave', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.removeClass(target, 'installbtnhover installbtnpress');
                });
                dojo.connect(btn, 'mousedown', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.addClass(target, 'installbtnpress');
                });
                dojo.connect(btn, 'mouseup', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.removeClass(target, 'installbtnpress');
                });
                dojo.connect(btn, 'click', this, website.EventManager.on);

            }, this);
        },

        bindPager: function () {
            var prevbtn = dojo.query('span.prev', this.pager)[0];
            var nextbtn = dojo.query('span.next', this.pager)[0];

            dojo.connect(prevbtn, 'click', this, function (e) {
                if (/disable/.test(e.target.className))
                    return;
                dojo.replaceClass(e.target, 'prevhover', 'prevpress');
                var shim = [
                    this.parentControl.type,
                    this.parentControl.category,
                    this.parentControl.lang,
                    this.parentControl.sort,
                    parseInt(this.parentControl.pageIndex) - 1
                ];
                dojo.hash(shim.join('/'));
            });
            dojo.connect(prevbtn, 'mouseenter', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'prevhover');
            });
            dojo.connect(prevbtn, 'mouseleave', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'prevhover prevpress');
            });
            dojo.connect(prevbtn, 'mousedown', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'prevpress');
            });
            dojo.connect(prevbtn, 'mouseup', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'prevpress');
            });

            dojo.connect(nextbtn, 'click', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.replaceClass(e.target, 'nexthover', 'nextpress');
                var shim = [
                    this.parentControl.type,
                    this.parentControl.category,
                    this.parentControl.lang,
                    this.parentControl.sort,
                    parseInt(this.parentControl.pageIndex) + 1
                ];
                dojo.hash(shim.join('/'));
            });
            dojo.connect(nextbtn,'mouseenter', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'nexthover');
            });
            dojo.connect(nextbtn,'mouseleave', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'nexthover nextpress');
            });
            dojo.connect(nextbtn, 'mousedown', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.addClass(e.target, 'nextpress');
            });
            dojo.connect(nextbtn, 'mouseup', this, function (e) {
                if (/disable/.test(e.target.className)) return;
                dojo.removeClass(e.target, 'nextpress');
            });

            dojo.query('a', this.pager).onclick(this, function (e) {
                dojo.stopEvent(e);
                var node = e.target.parentNode;
                if (/selected|abbr/g.test(node.className))
                    return;
                dojo.addClass(node, 'selected');
                var shim = [
                    this.parentControl.type,
                    this.parentControl.category,
                    this.parentControl.lang,
                    this.parentControl.sort,
                    parseInt(e.target.innerHTML)
                ];
                dojo.hash(shim.join('/'));
            });
        },

        setData: function (json) {
            if (!json || json.totalCount == 0) {
                dojo.empty(this.panel);
                this.totalPageCount = 0;
                this.data = null;
                this.show();
                this.setFocus();
                return;
            }

            var html = this.template.render(json);
            this.totalPageCount = Math.ceil((json.totalCount || 0) / 36);
            this.panel.innerHTML = html;
            this.data = json;

            this.show();
            this.setFocus();
            this.bindPanel();
            this.bindPager();
        },

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
                this.mini.style.visibility = 'hidden';
                this.pager.style.visibility = 'hidden';
                return;
            } else {
                this.mini.style.visibility = 'visible';
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

            dojo.query('span.count', this.mini)[0].innerHTML = pageIndex + '/' + this.totalPageCount;
        },

        renderPager: function () {
            // 清空
            dojo.empty(this.pager);

            var pageIndex = parseInt(this.parentControl.pageIndex);
            dom = document.createElement('span');
            dom.className = 'prev';
            this.pager.appendChild(dom);

            if (this.totalPageCount <= 6)
                condi = 1; // 全部显示

            else if (pageIndex <= 1 + span)
                condi = 2; // 前端连续显示
            else if (pageIndex >= this.totalPageCount - span)
                condi = 3; // 后端连续显示
            else
                condi = 4; // 两端均省略显示

            switch (condi) {
                case 1:
                    for (var i = 0; i < this.totalPageCount; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    break;
                case 2:
                    for (var i = 0; i < 5; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    this.insertAbbr();
                    this.insertSpan(this.totalPageCount - 1, -1);
                    break;
                case 3:
                    this.insertSpan(0, -1);
                    this.insertAbbr();
                    for (var i = this.totalPageCount - 5; i < this.totalPageCount; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    break;
                case 4:
                    this.insertSpan(0, -1);
                    this.insertAbbr();
                    for (var i = pageIndex-3; i < pageIndex + 1; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    this.insertAbbr();
                    this.insertSpan(this.totalPageCount - 1, -1);
                    break;
            }

            dom = document.createElement('span');
            dom.className = 'next';
            this.pager.appendChild(dom);
        },

        insertSpan: function (i, index) {
            dom = document.createElement('span');
            dom.innerHTML = "<a href='#'>" + (i+1) + "</a>";
            dom.className = 'text';
            ((i + 1) == index) && (dom.className += ' selected ');
            this.pager.appendChild(dom);
        },

        insertAbbr: function () {
            dom = document.createElement('span');
            dom.innerHTML = '…';
            dom.className = 'text abbr';
            this.pager.appendChild(dom);
        }

    })

})();
