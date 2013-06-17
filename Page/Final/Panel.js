/**
 * Static Panel component
 */

(function () {

    dojo.declare('website.Final.Panel', [website.IComponent], {
        // attr
        config: null,
        parentControl: null,
        template: null,
        // dom
        content: null,
        moredom: null,

        constructor: function (configObject) {
            this.container = configObject.container;
            this.content = dojo.query('ul.panel', this.container)[0];
            this.parentControl = configObject.parent;
            this.moredom = dojo.query('span.more', this.container)[0];
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this.type = configObject.type;
        },

        setData: function (json) {
            if (!json )
                return;

            var html = this.template.render({data:json});
            this.content.innerHTML = html;
            this.data = json;
            this.bind();
            this.show();
        },

        bind: function () {
            dojo.query('li', this.content).onmouseenter(function(e){
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function(e){
                dojo.removeClass(e.target, 'hover');
            }).forEach(function (li) {
                var btn = dojo.query('span.installbtn', li)[0];
                dojo.connect(btn, 'mouseenter', this, function (evt) {
                    if (/disable/.test(btn.className))
                        return;
                    dojo.addClass(btn, 'installbtnhover');
                });
                dojo.connect(btn, 'mouseleave', this, function (evt) {
                    if (/disable/.test(btn.className))
                        return;
                    dojo.removeClass(btn, 'installbtnhover installbtnpress');
                });
                dojo.connect(btn, 'mousedown', this, function (evt) {
                    if (/disable/.test(btn.className))
                        return;
                    dojo.addClass(btn, 'installbtnpress');
                });
                dojo.connect(btn, 'mouseup', this, function (evt) {
                    if (/disable/.test(btn.className))
                        return;
                    dojo.removeClass(btn, 'installbtnpress');
                });
                dojo.connect(btn, 'click', this, website.EventManager.on);

            }, this);

            dojo.connect(this.moredom, 'mouseover', this, function (evt) {
                dojo.addClass(this.moredom, 'hover');
            });
            dojo.connect(this.moredom, 'mouseout', this, function (evt) {
                dojo.removeClass(this.moredom, 'hover press');
            });
            dojo.connect(this.moredom, 'mousedown', this, function(evt) {
                dojo.addClass(evt.target, 'press');
            });
            dojo.connect(this.moredom, 'mouseup', this, function(evt) {
                dojo.removeClass(evt.target, 'press');
            });
            dojo.connect(this.moredom, 'click', this, function(){
                window.location = "Portal.html?type="+this.type;
            });
        }

    });
})();

