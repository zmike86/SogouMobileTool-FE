dojo.declare('website.Portal.Ads', website.IComponent, {
    // attr
    parentControl: null,
    content: null,
    template: null,

    constructor: function (config) {
        this.parentControl = config.parent;
        this.content = config.content;
        this.container = config.container || document.body;
        this.template = YayaTemplate(dojo.byId(config.tmplId).innerHTML);
    },

    setData: function (json) {
        if (!json || !json.list) return;

        var html = this.template.render(json.list[0]);
        this.content.innerHTML = html;
        this.data = json;
        this.show();
        return html;
    },

    /**
     * @implements IDispose
     */
    dispose: function () {
        return true;
    }

});