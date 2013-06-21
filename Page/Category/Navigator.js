/**
 * @description module logic for Category page
 * @creator Leo
 */
(function (global, undefined) {

    dojo.declare('website.Category.Navigator', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,
        _handlers: null,
        // 元素
        content: null, // dynamic content
        langContainer: null,
        sizeContainer: null,
        visualContainer: null,
        currentCategory: null,
        currentLang: null,
        currentSize: null,
        currentVisual: null,

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
            this.content = query[0];
            this.langContainer = query[1];
            this.sizeContainer = query[2];
            this.visualContainer = query[3];

            dojo.connect(window, 'onbeforeunload', this, this.dispose);
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
                        this.parentControl.lang,
                        this.parentControl.size,
                        this.parentControl.HD,
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            }));
            // 切换语言
            this._handlers.push(dojo.connect(this.langContainer, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'A') {
                    dojo.stopEvent(e);
                    var language = target.parentNode.getAttribute('languageid');
                    var currentLang = dojo.query('li[languageid=' + language + ']', this.langContainer)[0];
                    if (this.currentLang !== currentLang) {
                        this.currentLang && dojo.removeClass(this.currentLang,'selected');
                        this.currentLang = currentLang;
                        dojo.addClass(this.currentLang,'selected');
                    }
                    var shim = [
                        this.parentControl.type,
                        this.parentControl.category,
                        language,
                        this.parentControl.size,
                        this.parentControl.HD,
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            }));
            // 切换尺寸
            this._handlers.push(dojo.connect(this.sizeContainer, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'A') {
                    dojo.stopEvent(e);
                    var size = target.parentNode.getAttribute('size');
                    var currentSize = dojo.query('li[size=' + size + ']', this.sizeContainer)[0];
                    if (this.currentSize !== currentSize) {
                        this.currentSize && dojo.removeClass(this.currentSize,'selected');
                        this.currentSize = currentSize;
                        dojo.addClass(this.currentSize,'selected');
                    }
                    var shim = [
                        this.parentControl.type,
                        this.parentControl.category,
                        this.parentControl.lang,
                        size,
                        this.parentControl.HD,
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            }));
            // 切换是否高清
            this._handlers.push(dojo.connect(this.visualContainer, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'A') {
                    dojo.stopEvent(e);
                    var visual = target.parentNode.getAttribute('visual');
                    var currentVisual = dojo.query('li[visual=' + visual + ']', this.visualContainer)[0];
                    if (this.currentVisual !== currentVisual) {
                        this.currentVisual && dojo.removeClass(this.currentVisual,'selected');
                        this.currentVisual = currentVisual;
                        dojo.addClass(this.currentVisual,'selected');
                    }
                    var shim = [
                        this.parentControl.type,
                        this.parentControl.category,
                        this.parentControl.lang,
                        this.parentControl.size,
                        visual,
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
            if (json.list[0].id !== 'all')
                json.list.splice(0,0,{id:'all', text: '全部'});

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
            var category = this.parentControl.category,
                lang = this.parentControl.lang,
                size = this.parentControl.size,
                visual = this.parentControl.HD;

            var currentCategory = dojo.query('li[category=' + category + ']', this.content)[0],
                currentLang = dojo.query('li[languageid=' + lang + ']', this.langContainer)[0],
                currentSize = dojo.query('li[size=' + size + ']', this.sizeContainer)[0],
                currentVisual = dojo.query('li[visual=' + visual + ']', this.visualContainer)[0];

            if (this.currentCategory !== currentCategory) {
                this.currentCategory && dojo.removeClass(this.currentCategory, 'selected');
                this.currentCategory = currentCategory;
                dojo.addClass(this.currentCategory, 'selected');
            }
            if (this.currentLang !== currentLang) {
                this.currentLang && dojo.removeClass(this.currentLang, 'selected');
                this.currentLang = currentLang;
                dojo.addClass(this.currentLang, 'selected');
            }
            if (this.currentSize !== currentSize) {
                this.currentSize && dojo.removeClass(this.currentSize, 'selected');
                this.currentSize = currentSize;
                dojo.addClass(this.currentSize, 'selected');
            }
            if (this.currentVisual !== currentVisual) {
                this.currentVisual && dojo.removeClass(this.currentVisual, 'selected');
                this.currentVisual = currentVisual;
                dojo.addClass(this.currentVisual, 'selected');
            }
        }
      });

})(this);
