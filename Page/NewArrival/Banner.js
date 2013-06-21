/**
 * @description module logic for Category page
 * @creator Leo
 */

(function (global, undefined) {

    dojo.declare('website.NewArrival.Banner', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {

        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json || !json.list) return;

            this.dispose();
            var html = this.template.render(json.list[0]);
            this.container.innerHTML = html;
            this.bind();
            this.show();
        }

    });

})(this);
