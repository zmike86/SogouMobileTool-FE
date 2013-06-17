dojo.declare('website.Top.Rank', [website.IComponent], {

    parent: null,
    showdate: false,
    datedom: null,
    content: null,
    template: null,

    constructor: function (configObject) {
        this.container = configObject.container;
        this.parentControl = configObject.parent;
        this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
        this.datedom = dojo.query('div.title', this.container)[0];
        this.content = dojo.query('ul.list', this.container)[0];
        this.type = configObject.type;
        this.showdate = configObject.showdate || false;

        if (this.showdate) this.setDate();

        if (configObject.className) this.setTitleClass(configObject.className);
    },

    bind: function () {
        dojo.query('li', this.content)
        .onmouseenter(function(e) {
            dojo.addClass(e.target, 'hover');
        })
        .onmouseleave(function(e) {
            dojo.removeClass(e.target, 'hover');
        })
        .forEach(function(li) {
            var btn = dojo.query('span.installbtn', li)[0];
            dojo.connect(btn, 'mouseenter', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.addClass(evt.target, 'installbtnhover');
            });
            dojo.connect(btn, 'mouseleave', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.removeClass(evt.target, 'installbtnhover installbtnpress');
            });
            dojo.connect(btn, 'mousedown', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.addClass(evt.target, 'installbtnpress');
            });
            dojo.connect(btn, 'mouseup', this, function(evt) {
                if (/disable/.test(btn.className))
                    return;
                dojo.removeClass(evt.target, 'installbtnpress');
            });
            dojo.connect(btn, 'click', this, website.EventManager.onRank);

        }, this);
    },

    setTitleClass: function (className) {
        dojo.addClass(this.datedom, className);
    },

    setDate: function () {
        function normalize (s) {
            if(s < 10 && s > 0)
                s = '0' + s;
            return s;
        }

        var curDate = new Date();
        var aweekAgo = new Date(curDate.getTime() - 604800000);
        this.datedom.innerHTML = normalize(aweekAgo.getMonth() + 1) + normalize(aweekAgo.getDate())
        + '-' + normalize(curDate.getMonth() + 1) + normalize(curDate.getDate());
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
