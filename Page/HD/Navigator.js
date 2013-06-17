(function () {

    dojo.declare('website.HD.Navigator', [website.IComponent], {

        parentControl: null,
        // dom
        title: null,
        content: null, // dynamic content
        langContainer: null,
        template: null,
        currentCategory: null,
        currentLang: null,

        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);

            var query = dojo.query('ul', this.container);
            this.title = dojo.byId('HDTitle').firstChild;
            dojo.addClass(this.title, this.parentControl.type === 'app' ? 'appheader' : 'gameheader');
            this.content = query[0];
            this.langContainer = query[1];
        },

        bind: function () {
            // 切换类别
            dojo.connect(this.content, 'click', this, function (e) {
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
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            });
            // 切换语言
            dojo.connect(this.langContainer, 'click', this, function (e) {
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
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            });
        },

        setData: function (json) {
            if (!json || !json.list)
                return;

            if (json.list[0].id !== 'all')
                json.list.splice(0,0,{id:'all', text: '全部'});

            var html = this.template.render(json);
            this.content.innerHTML = html;
            this.data = json;
            this.bind();
            this.show();
            this.setFocus();
        },

        setFocus: function () {
            var category = this.parentControl.category,
                lang = this.parentControl.lang;

            this.currentCategory = dojo.query('li[category=' + category + ']', this.content)[0];
            this.currentLang = dojo.query('li[languageid=' + lang + ']', this.langContainer)[0];

            dojo.addClass(this.currentCategory, 'selected');
            dojo.addClass(this.currentLang, 'selected');
        }

    });

})(this);
