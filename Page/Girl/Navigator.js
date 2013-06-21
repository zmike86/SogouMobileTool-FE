/**
 * @description module logic for Category page
 * @creator Leo
 */

(function (global, undefined) {

    dojo.declare('website.Girl.Navigator', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,
        currentCategory: null,
        _handlers: null,
        // dom
        allbtn: null,
        content: null, // dynamic content

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.allbtn = dojo.query('.all', this.container)[0];
            this.content = dojo.query('ul', this.container)[0];
            this._handlers = [];

            dojo.connect(window, 'onbeforeunload', this, this.dispose);

            dojo.addClass(dojo.byId('header'), this.parentControl.type === 'app'?'appheader':'gameheader');
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {
            // 切换类别
            this._handlers.push(dojo.connect(this.content, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'A') {
                    dojo.stopEvent(e);
                    var category = target.parentNode.getAttribute('category');
                    var currentCategory = dojo.query('li[category=' + category + ']', this.content)[0];
                    if (this.currentCategory !== currentCategory) {
                        this.currentCategory && dojo.removeClass(this.currentCategory,'selected');
                        this.currentCategory = currentCategory;
                        dojo.addClass(this.currentCategory,'selected');
                    }
                    var shim = [
                        this.parentControl.type,
                        category,
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            }));
            // 切换到全部
            this._handlers.push(dojo.connect(this.allbtn, 'click', this, function (e) {
                dojo.stopEvent(e);
                if (this.currentCategory !== this.allbtn) {
                    this.currentCategory && dojo.removeClass(this.currentCategory,'selected');
                    this.currentCategory = this.allbtn;
                    dojo.addClass(this.allbtn,'selected');
                    var shim = [
                        this.parentControl.type,
                        'all',
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            }));
        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json || !json.list)
                return;

            this.dispose();
            var html = this.template.render(json);
            this.content.innerHTML = html;
            this.bind();
            this.show();
            this.setFocus();
        },

        /**
         * 设置焦点
         */
        setFocus: function () {
            var category = this.parentControl.category;
            if (category === 'all') {
                this.currentCategory = this.allbtn;
                dojo.addClass(this.allbtn, 'selected');
            } else {
                this.currentCategory = dojo.query('li[category=' + category + ']', this.content)[0];
                dojo.addClass(this.currentCategory, 'selected');
            }
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
