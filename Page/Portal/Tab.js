/**
 * Tab component
 */

(function () {

    var indexArr = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

    dojo.declare('website.Portal.Tab', [website.IComponent], {
        // attr
        config: null,
        parentControl: null,
        template: null,
        hasData: false,
        // dom
        moredom: null,
        // component
        tab: null,

        constructor: function (configObject) {
            this.config = configObject;
            this.container = configObject.container;
            this.parentControl = this.config.parent;
            this.moredom = dojo.query('span.more', this.container)[0];
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.resolveTriggers();
        },

        init: function () {
            if (this.hasData)
                this.start();
        },

        start: function () {
            if (!this.tab) {
                this.tab = new Sogou.ui.Tab(this.config);
            }
        },

        resolveTriggers: function () {
            var frag = document.createDocumentFragment();
            var li;
            var at = ({
                app: ['热门推荐','聊天交友','系统工具','学习办公','便捷生活','美图视频','图书阅读'],
                game: ['热门推荐','动作射击','赛车体育','休闲益智','棋牌麻将','战略塔防','策略经营']
            })[this.parentControl.type];
            for (var i=0; i<at.length; ++i) {
                li = document.createElement('li');
                li.innerHTML = at[i];
                !i && (li.className = 'selected');
                frag.appendChild(li);
            }

            dojo.query('ul.triggers', this.container)[0].appendChild(frag);
        },

        setData: function (json) {
            var panelsContainer = dojo.query('div.panels', this.container)[0],
                ul, i = 0;

            if (!json)
                return;

            var html, me = this;

            function render (k) {
                ul = document.createElement('ul');
                ul.className = 'panel';
                html = me.template.render(json[k]);
                ul.innerHTML = html;
                if (i !== 0)
                    ul.style.display = 'none';
                i++;
                panelsContainer.appendChild(ul);
            }

            render(indexArr[0]);
            this.show();

            var def = new dojo.Deferred();
            def.then(function(){
                for (var k = 1; k < indexArr.length; k++) {
                    render(indexArr[k]);
                }
            }).then(function(){
                me.config.triggers = dojo.query('ul.triggers li', me.container);
                me.config.panels = dojo.query('div.panels ul', me.container);

                me.bind();
                me.hasData = true;
                me.init();
            });

            setTimeout(function(){
                def.resolve();
            }, 10);
        },

        bind: function () {
            dojo.forEach(this.config.panels, function (panel) {
                dojo.query('li', panel)
                .onmouseenter(function(e){
                    dojo.addClass(e.target, 'hover');
                })
                .onmouseleave(function(e){
                    dojo.removeClass(e.target, 'hover');
                })
                .forEach(function (li) {
                    var btn = dojo.query('span.installbtn', li)[0];
                    dojo.connect(btn, 'mouseenter', this, function (evt) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.addClass(btn, 'installbtnhover');
                    });
                    dojo.connect(btn, 'mouseleave', this, function (evt) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.removeClass(btn, 'installbtnhover installbtnpress');
                    });
                    dojo.connect(btn, 'mousedown', this, function (evt) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.addClass(btn, 'installbtnpress');
                    });
                    dojo.connect(btn, 'mouseup', this, function (evt) {
                        if (/disable/.test(btn.className))
                            return;
                        dojo.removeClass(btn, 'installbtnpress');
                    });
                    dojo.connect(btn, 'click', this, website.EventManager.on);

                }, this);
            }, this);

            dojo.connect(this.moredom, 'mouseover', this, function (evt) {
                dojo.addClass(this.moredom, 'hover');
            });
            dojo.connect(this.moredom, 'mouseout', this, function (evt) {
                dojo.removeClass(this.moredom, 'hover press');
            });
            dojo.connect(this.moredom, 'mousedown', this, function(evt) {
                dojo.addClass(evt.target, 'press');
            });
            dojo.connect(this.moredom, 'mouseup', this, function(evt) {
                dojo.removeClass(evt.target, 'press');
            });
            dojo.connect(this.moredom, 'click', this, function(){
                window.location = 'Category.html#' + this.parentControl.type;
            });
        }

    });
})();