(function(){

    dojo.declare('website.AdsBanner', [website.IComponent], {

        parentControl: null,
        // dom
        titledom: null,
        content: null, // dynamic content
        moredom: null,

        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
        },

        bind: function () {
            dojo.connect(this.moredom, 'click', this, function (evt) {
                window.location = 'Portal.html?type=' + this.parentControl.type;
            });
            dojo.connect(this.moredom, 'mouseenter', this, function (evt) {
                dojo.addClass(this.moredom, 'hover');
            });
            dojo.connect(this.moredom, 'mouseleave', this, function (evt) {
                dojo.removeClass(this.moredom, 'hover press');
            });
            dojo.connect(this.moredom, 'mousedown', this, function (evt) {
                dojo.addClass(this.moredom, 'press');
            });
            dojo.connect(this.moredom, 'mouseup', this, function (evt) {
                dojo.removeClass(this.moredom, 'press');
            });

            //@PingBack
            dojo.query('a', this.content).forEach(function (a) {
                dojo.connect(a, 'click', this, function(evt){
                    dojo.stopEvent(evt);
                    var href = a.getAttribute('href');
                    $PingBack('msite_' + this.parentControl.PAGE_ID + '_frameads_bv');
                    window.location = href;
                });
            }, this);
        },

        setData: function (json) {
            if (!json || !json.html)
                return;

            var html = decodeURIComponent(json.html);
            this.container.innerHTML = html;
            this.data = html;

            var query = dojo.query('.panel', this.container);
            this.titledom = dojo.query('.triggers', this.container)[0];
            this.content = query[0];
            this.moredom = dojo.query('span.more', this.container)[0];

            if (json.text) {
                this.titledom.innerHTML += decodeURI(json.text);
            }

            this.bind();
            this.show();

            return html;
        }

    });

    dojo.declare('website.CommonAds', [website.IComponent], {

        parentControl: null,
        content: null,
        morebtn: null,

        constructor: function (configObject) {
            this.parentControl = configObject.parent;
            this.container = configObject.container;
        },

        bind: function () {
            dojo.connect(this.morebtn, 'mouseenter', this, function(evt){
                dojo.addClass(evt.target, 'hover');
            });
            dojo.connect(this.morebtn, 'mouseleave', this, function(evt){
                dojo.removeClass(evt.target, 'hover press');
            });
            dojo.connect(this.morebtn, 'mousedown', this, function(evt){
                dojo.addClass(evt.target, 'press');
            });
            dojo.connect(this.morebtn, 'mouseup', this, function(evt){
                dojo.removeClass(evt.target, 'press');
            });

            //@PingBack
            dojo.query('a', this.content).forEach(function (a) {
                dojo.connect(a, 'click', this, function(evt){
                    dojo.stopEvent(evt);
                    var href = a.getAttribute('href');
                    $PingBack('msite_' + this.parentControl.PAGE_ID + '_botads_bv');
                    window.location = href;
                });
            }, this);
        },

        setData: function (json) {
            if (!json || !json.html)
                return;

            var html = decodeURIComponent(json.html);
            this.container.innerHTML = html;
            this.data = html;
            this.content = dojo.query('div.textpanel', this.container)[0];
            this.morebtn = dojo.query('span.more', this.container)[0];
            this.bind();
            this.show();
            return html;
        },

        show: function () {
            this.container.style.display = 'inline';
        },

        hide: function () {
            this.container.style.display = 'none';
        }

    });

})();
