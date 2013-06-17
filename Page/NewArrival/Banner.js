(function (global) {

    dojo.declare('website.NewArrival.Banner', website.IComponent, {

        parent: null,
        template: null,

        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
        },

        bind: function () {

        },

        setData: function (json) {
            if (!json || !json.list) return;

            var html = this.template.render(json.list[0]);
            this.container.innerHTML = html;
            this.data = json;
            this.bind();
            this.show();
        }

    });

})(this);
