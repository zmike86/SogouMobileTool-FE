(function (global, undefined) {

    dojo.declare('website.Girl.Navigator', [website.IComponent], {

        parentControl: null,
        // dom
        allbtn: null,
        content: null, // dynamic content
        template: null,
        currentCategory: null,

        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.allbtn = dojo.query('.all', this.container)[0];
            this.content = dojo.query('ul', this.container)[0];

            dojo.addClass(dojo.byId('header'), this.parentControl.type === 'app'?'appheader':'gameheader');
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
                        this.parentControl.sort,
                        '1'
                    ];
                    dojo.hash(shim.join('/'));
                }
            });
            // 切换到全部
            dojo.connect(this.allbtn, 'click', this, function (e) {
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
            });
        },

        setData: function (json) {
            if (!json || !json.list)
                return;

            var html = this.template.render(json);
            this.content.innerHTML = html;
            this.data = json;
            this.bind();
            this.show();
            this.setFocus();
        },

        setFocus: function () {
            var category = this.parentControl.category;
            if (category === 'all') {
                this.currentCategory = this.allbtn;
                dojo.addClass(this.allbtn, 'selected');
            } else {
                this.currentCategory = dojo.query('li[category=' + category + ']', this.content)[0];
                dojo.addClass(this.currentCategory, 'selected');
            }
        }

    });

})(this);
