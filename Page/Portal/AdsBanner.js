dojo.declare('website.Portal.AdsBanner', [website.IComponent], {

    parentControl: null,
    template: null,
    content: null,

    constructor: function (configObject) {
        this.parentControl = configObject.parent;
        this.container = configObject.container;
        this.content = dojo.query('ul', this.container)[0];
        this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
    },

    bind: function () {
        var lis = dojo.query('li.frame', this.container);
        lis.onmouseenter(function(evt){
            dojo.addClass(evt.target, 'frameHover');

        }).onmouseleave(function(evt){
            dojo.removeClass(evt.target, 'frameHover');
        });
        lis.forEach(function(li){
            dojo.connect(li, 'click', function(){
                window.location = 'final.html?appid=' + li.getAttribute('appid');
            });
        });
    },

    setData: function (json) {
        if (!json || !json.list)
            return;

        var html = this.template.render(json);
        this.content.innerHTML = html;
        this.data = html;
        this.bind();
        this.show();
        return html;
    }

});
