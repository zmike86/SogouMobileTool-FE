/**
 * Slide component
 * @creator Leo
 */

(function(){
    dojo.declare('website.Portal.Slide', [website.IComponent], {
        // attr
        config: null,
        parentControl: null,
        hasData: false,
        // component
        slide: null,

        constructor: function (configObject) {
            this.config = configObject;
            this.container = this.config.container;
            this.parentControl = this.config.parent;
        },

        init: function () {
            if (this.hasData)
                this.start();
        },

        start: function () {
            if (!this.slide) {
                this.slide = new Sogou.ui.Slide(this.config);
            }
        },

        bind: function () {

        },

        setData: function (json) {
            var i, a, img, li,
                triggersContainer = dojo.query('ul.triggers', this.container)[0],
                panelsContainer = dojo.query('div.panel', this.container)[0];

            if (!json || !json.list)
                return;

            this.data = json.list;
            for (i = 0; i < this.data.length; i++) {
                var icon = decodeURIComponent(this.data[i].icon),
                    alt = decodeURIComponent(this.data[i].tip),
                    id = decodeURIComponent(this.data[i].id);

                img = dojo.create('img', {
                    original: icon,
                    src: icon,
                    alt: alt,
                    id: id,
                    type: this.data[i].type
                });

                a = document.createElement('a');
                a.appendChild(img);
                a.href = 'final.html?appid=' + id;
                panelsContainer.appendChild(a);

                li = document.createElement('li');
                if (i === 0)
                    dojo.addClass(li, 'selected');
                triggersContainer.appendChild(li);
            }

            this.config.triggers = dojo.query('ul.triggers li', this.container);
            this.config.panels = dojo.query('div.panel a', this.container);

            this.bind();
            this.show();

            this.hasData = true;
        }

    });
})();
