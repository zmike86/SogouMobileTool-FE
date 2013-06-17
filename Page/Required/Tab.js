(function (global, undefined) {

    var span = 4;

    dojo.declare('website.Required.Tab', [website.IComponent], {
        // attr
        sort: null,
        parent: null,
        template: null,
        currentIndex: 0,
        path: null,
        // dom
        triggers: null,
        panels: null,
        panelsContainer: null,

        constructor: function (configObject) {
            var self = this;

            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.sort = this.parentControl.sort;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.triggers = dojo.query('ul li', this.container);
            this.panelsContainer = dojo.query('div.panels', this.container)[0];
            this.path = 'website_required_app_' + this.sort;

            this.shimPanels();
            this.panels = dojo.query('ul', this.panelsContainer);
            this.bind();
            dojo.addClass(dojo.query('li[sortid=' + this.sort + ']')[0], 'selected');

            global.tabCallback = function (data) {
                if (!data) {
                    if (self.errorCallback && (typeof self.errorCallback === 'function'))
                        self.errorCallback();
                    return;
                }

                var serialization;
                try {
                    serialization = JSON.parse(data)[self.path];
                } catch (e) {
                    throw new Error("request HomePage data from server format error");
                }
                self.setData(serialization);
            };
        },

        shimPanels: function () {
            // 补充除第一个外后面的面板
            var frag = document.createDocumentFragment();
            var ul,len = dojo.query('ul.triggers li', this.container).length;
            for (var i = 0; i < len - 1; ++i) {
                ul = dojo.create('ul', {
                    className: 'panel'
                });
                ul.style.display = 'none';
                frag.appendChild(ul);
            }
            this.panelsContainer.appendChild(frag);
        },

        setData: function (json) {
            var ul = this.panels[this.currentIndex];
            if (!json)
                return;

            if (ul.getAttribute('hasData') !== 'true') {
                ul.innerHTML = this.template.render(json);
                dojo.query('li', ul).onmouseenter(function (e) {
                    dojo.addClass(e.target, 'hover');
                }).onmouseleave(function (e) {
                    dojo.removeClass(e.target, 'hover');
                }).forEach(function (li) {
                    var btn = dojo.query('span.installbtn', li)[0];
                    dojo.connect(btn, 'mouseenter', this, function (e) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.addClass(btn, 'installbtnhover')
                    });
                    dojo.connect(btn, 'mouseleave', this, function (e) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.removeClass(btn, 'installbtnhover installbtnpress')
                    });
                    dojo.connect(btn, 'mousedown', this, function (e) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.addClass(btn, 'installbtnpress')
                    });
                    dojo.connect(btn, 'mouseup', this, function (e) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.removeClass(btn, 'installbtnpress')
                    });
                    dojo.connect(btn, 'click', this, website.EventManager.on);
                }, this);

                if (this.parentControl.loader) {
                    this.parentControl.loader.destroy();
                }
                this.parentControl.loader = this.parentControl.createImgLoader();
                this.show();

                ul.setAttribute('hasData', 'true');
                LocalStorage.write(this.path, JSON.stringify(json));
            }
        },

        bind: function () {
            // 切换tab
            this.triggers.forEach(function(li, index) {
                dojo.connect(li, 'click', this, function (e) {
                    var sorter = li.getAttribute('sortid');
                    // trigger切换样式
                    dojo.removeClass(dojo.query('li[sortid=' + this.sort + ']')[0], 'selected');
                    dojo.addClass(li, 'selected');
                    // panels切换样式
                    dojo.style(this.panels[this.currentIndex], 'display', 'none');
                    this.currentIndex = index;
                    dojo.style(this.panels[this.currentIndex], 'display', 'block');

                    this.parentControl.sort = this.sort = sorter;
                    window.location.hash = sorter;

                    if (li.getAttribute('hasData') !== 'true') {
                        this.sendRequest();
                    }
                });
            }, this);
        },

        sendRequest: function () {
            // tab
            this.path = 'website_required_app_' + this.sort;
            var data = LocalStorage.read(this.path);
            if (data) {
                this.setData(JSON.parse(data));
            } else {
                var json = this.generatePostJson();
                window.external.GetWebsiteAPPInfo_Async(json, 'tabCallback', document);
            }
        },

        generatePostJson: function () {
            var sort = this.sort;
            var o = { data: {}};
            o.data[this.path] = {
                module: 'applist',
                type: 'normal',
                sort: 'download',
                categoryid: sort,
                category_group: '1002',
                start: 0,
                limit: 54,
                order: 'down'
            };
            return JSON.stringify(o);
        }

    });

})(this);
