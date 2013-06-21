/**
 * 底部相框推荐位
 */
(function(global, undefined){
    dojo.declare('website.Portal.AdsBanner', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,
        content: null,
        _handlers: null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.parentControl = configObject.parent;
            this.container = configObject.container;
            this.content = dojo.query('ul', this.container)[0];
            this.template = YayaTemplate(dojo.byId(configObject.tmplId).innerHTML);
            this._handlers = [];

            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {
            var lis = dojo.query('li.frame', this.container),
                me = this;
            dojo.forEach(lis, function(li){
                me._handlers.push(dojo.connect(li, 'mouseenter', function(evt){
                    dojo.addClass(li, 'frameHover');
                }));
                me._handlers.push(dojo.connect(li, 'mouseleave', function(evt){
                    dojo.removeClass(li, 'frameHover');
                }));
                me._handlers.push(dojo.connect(li, 'click', function(){
                    window.location = 'final.html?appid=' + li.getAttribute('appid');
                }));
            });
        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json || !json.list) return;

            this.dispose();
            var html = this.template.render(json);
            this.content.innerHTML = html;
            this.bind();
            this.show();
            return html;
        },

        /**
         * @implements IDispose
         */
        disposeInternal_: function () {
            dojo.forEach(this._handlers, function (handle) {
                dojo.disconnect(handle);
            });
            this._handlers = [];
        }

    });
})(this);