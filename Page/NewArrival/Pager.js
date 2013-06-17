(function () {

    var span = 4;
    var condi = 0;
    var dom;

    dojo.declare('website.NewArrival.Pager', [website.IComponent], {

        // attr
        parentControl: null,
        template: null,
        totalPageCount: null,
        time: null,
        // dom
        refreshbtn: null,
        timespan: null,
        mini: null,
        panel: null,
        updatePanel: null,
        pager: null,

        constructor: function (configObject) {
            // attr
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.up_template = YayaTemplate(dojo.byId(configObject.up_tmplId).innerHTML);
            // dom
            this.container = configObject.container;
            this.refreshbtn = dojo.query('li.refresh', this.container)[0];
            this.timespan = dojo.query('li.date span', this.container)[0];
            this.mini = dojo.query('div.minipager', this.container)[0];
            this.updatePanel = dojo.query('div.updatePanel ul', this.container)[0];
            this.panel = dojo.query('ul.panel', this.container)[0];
            this.pager = dojo.query('div.pager', this.container)[0];

            // 只绑定必要事件
            this.bind();
        },

        bind: function () {
            // 刷新按钮
            dojo.connect(this.refreshbtn, 'click', this, function (e) {
                window.location.reload();
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

            dojo.connect(nextbtn,'click', this, function (e) {
                if (/disable/.test(e.target.className))
                    return;
                dojo.replaceClass(e.target, 'nexthover', 'nextpress');
                var shim = [
                    this.parentControl.type,
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
            // 最新上架面板
            dojo.query('li', this.updatePanel).forEach(function (li) {
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

            // 下部普通面板
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
                    dojo.addClass(target, 'installbtnhover')
                });
                dojo.connect(btn, 'mouseleave', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.removeClass(target, 'installbtnhover installbtnpress')
                });
                dojo.connect(btn, 'mousedown', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.addClass(target, 'installbtnpress')
                });
                dojo.connect(btn, 'mouseup', this, function (e) {
                    var target = e.target;
                    if (/disable/.test(target.className))
                        return;
                    dojo.removeClass(target, 'installbtnpress')
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

            dojo.connect(nextbtn,'click', this, function (e) {
                if (/disable/.test(e.target.className))
                    return;
                dojo.replaceClass(e.target, 'nexthover', 'nextpress');
                var shim = [
                    this.parentControl.type,
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
            this.data = json;
            this.totalPageCount = Math.ceil((json[this.parentControl.IDS.pager]['totalCount'] || 0) / 36);

            this.show();
            this.setFocus();
            this.bindPanel();
            this.bindPager();
        },

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

        getDate: function () {
            var d = new Date(),
                month = d.getMonth() + 1,
                day = d.getDate(),
                hour = d.getHours(),
                min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
            return '更新时间：' + month + '月' + day + '日 ' + hour + ':' + min;
        },

        setFocus: function () {
            var pageIndex = parseInt(this.parentControl.pageIndex);

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
                    for (var i = pageIndex - 3; i < pageIndex + 1; i++) {
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
            dom.innerHTML = "<a href=''>" + (i+1) + "</a>";
            dom.className = 'text';
            ((i+1) == index) && (dom.className += ' selected ');
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
