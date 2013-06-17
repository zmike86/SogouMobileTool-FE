dojo.declare('website.Portal.Rank', [website.IComponent], {

    parent: null,
    titledom: null,
    moredom: null,
    content: null,
    template: null,

    constructor: function (configObject) {
        this.container = configObject.container;
        this.parentControl = configObject.parent;
        this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
        this.titledom = dojo.query('div.title', this.container)[0];
        this.moredom = dojo.query('span.more', this.titledom)[0];
        this.content = dojo.query('ul.list', this.container)[0];

        this.type = configObject.type;
        dojo.addClass(this.titledom, (this.type === 'app' ? 'apptitle' : 'gametitle'));
    },

    bind: function () {
        dojo.query('li', this.content).onmouseenter(function(e) {
            dojo.addClass(e.target, 'hover');
        }).onmouseleave(function(e) {
            dojo.removeClass(e.target, 'hover');
        }).forEach(function(li) {
            var btn = dojo.query('span.installbtn', li)[0];
            dojo.connect(btn, 'mouseenter', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.addClass(btn, 'installbtnhover');
            });
            dojo.connect(btn, 'mouseleave', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.removeClass(btn, 'installbtnhover installbtnpress');
            });
            dojo.connect(btn, 'mousedown', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.addClass(btn, 'installbtnpress');
            });
            dojo.connect(btn, 'mouseup', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.removeClass(btn, 'installbtnpress');
            });
            dojo.connect(btn, 'click', this, website.EventManager.onRank);

        }, this);

        dojo.connect(this.moredom, 'mouseenter', this, function(evt) {
            dojo.addClass(evt.target, 'hover');
        });
        dojo.connect(this.moredom, 'mouseleave', this, function(evt) {
            dojo.removeClass(evt.target, 'hover press');
        });
        dojo.connect(this.moredom, 'mousedown', this, function(evt) {
            dojo.addClass(evt.target, 'press');
        });
        dojo.connect(this.moredom, 'mouseup', this, function(evt) {
            dojo.removeClass(evt.target, 'press');
        });
        dojo.connect(this.moredom, 'click', this, function(){
            window.location = 'Top.html?type=' + this.type;
        });
    },

    setData: function (json) {
        if (!json) return;

        var html = this.template.render(json);
        this.content.innerHTML = html;
        this.data = json;
        this.bind();
        this.show();

        return html;
    }
});
