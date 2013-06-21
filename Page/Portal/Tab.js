/**
 * Tab component
 */

(function () {

    var indexArr = ['c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

    dojo.declare('website.Portal.Tab', [website.IComponent], {
        // 属性
        config: null,
        parentControl: null,
        template: null,
        hasData: false,
        useTip: false,
        _handlers: null,
        // 元素
        moredom: null,
        // 组件
        tab: null,
        tooltip: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.config = configObject;
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.moredom = dojo.query('span.more', this.container)[0];
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.resolveTriggers();
            this._handlers = [];
            if (configObject.useTip) {
                this.tooltip = this.parentControl.tooltip;
            }

            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 可切换的功能可用
         */
        init: function () {
            if (this.hasData)
                this.start();
        },

        /**
         * 初始化tab组件
         */
        start: function () {
            if (!this.tab) {
                this.tab = new Sogou.ui.Tab(this.config);
            }
        },

        /**
         * 根据所处模块不同, 动态生成切换标签
         */
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

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            var panelsContainer = dojo.query('div.panels', this.container)[0],
                ul, i = 0;
            if (!json) return;

            this.dispose();

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

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {
            var me = this;

            dojo.forEach(this.config.panels, function (panel) {
                dojo.query('li', panel).onmouseenter(function(e){
                    dojo.addClass(e.target, 'hover');
                    me.tooltip && me.tooltip.setData(e.target).show();
                }).onmouseleave(function(e){
                    dojo.removeClass(e.target, 'hover');
                    me.tooltip && me.tooltip.hide();
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
            });

            me._handlers.push(dojo.connect(me.moredom, 'mouseover', function (evt) {
                dojo.addClass(me.moredom, 'hover');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'mouseout', function (evt) {
                dojo.removeClass(me.moredom, 'hover press');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'mousedown', function(evt) {
                dojo.addClass(evt.target, 'press');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'mouseup', function(evt) {
                dojo.removeClass(evt.target, 'press');
            }));
            me._handlers.push(dojo.connect(me.moredom, 'click', function(){
                window.location = 'Category.html#' + this.parentControl.type;
            }));
        },

        /**
         * @implements IDispose
         */
        disposeInternal_: function () {
            if (this.tab && this.tab.dispose) {
                this.tab.dispose();
            }
            dojo.forEach(this._handlers, function (handle) {
                dojo.disconnect(handle);
            });
            this._handlers = [];
        }

    });
})();