/**
 * @description module logic for Category page
 * @creator Leo
 */
(function () {

    var filterDangerWords = function (w) {
        return w.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    };

    dojo.declare('website.Result.Navigator', [website.IComponent], {
        // 属性
        parentControl: null,
        template: null,
        _handlers: null,
        // 元素
        content: null, // dynamic content
        currentCategory: null,
        clearbtn: null,
        resultTitle:    null,
        mixText:        null,
        appText:        null,
        gameText:       null,

        /**
         * 构造方法
         * @param configObject
         */
        constructor: function (configObject) {
            this.container = configObject.container;
            this.parentControl = configObject.parent;
            var query = dojo.query('ul', this.container);
            this.content = query[0];
            this._handlers = [];
            // query doms
            this.resultTitle = dojo.query('.result-info', dojo.byId('resultTitle'))[0];
            this.clearbtn = dojo.query('.clear-result-btn', dojo.byId('resultTitle'))[0];
            this.mixText = dojo.query('li[category=mix] a', this.container)[0];
            this.appText = dojo.query('li[category=app] a', this.container)[0];
            this.gameText = dojo.query('li[category=game] a', this.container)[0];

            dojo.connect(window, 'onbeforeunload', this, this.dispose);
        },

        /**
         * 绑定数据后绑定事件
         */
        bind: function () {
            // 切换类别
            this._handlers.push(dojo.connect(this.content, 'click', this, function (e) {
                var target = e.target;
                if (target.nodeName === 'A') {
                    dojo.stopEvent(e);
                    var category = target.parentNode.getAttribute('category');
                    var currentCategory = dojo.query('li[category=' + category + ']', this.content)[0];
                    if (this.currentCategory !== currentCategory) {
                        this.currentCategory && dojo.removeClass(this.currentCategory,'selected');
                        this.currentCategory = currentCategory;
                        dojo.addClass(this.currentCategory,'selected');
                    }
                    var shim = [
                        this.parentControl.type,
                        category,
                        this.parentControl.sort,
                        '1'
                    ];
                    //dojo.hash(shim.join('/'));
					location.hash = shim.join('/');
				}
            }));
            // 清除搜索
            this._handlers.push(dojo.connect(this.clearbtn, 'click', this, function (e) {
                window.history.back();
            }));
        },

        /**
         * 设置数据源
         * @param json
         */
        setData: function (json) {
            if (!json)
                return;

            this.dispose();
            var keyword = filterDangerWords(this.parentControl.keyword);
            this.resultTitle.innerHTML = '搜索" <em>' + keyword + '</em> "共找到' + json.mix.totalCount + '个结果';
            this.mixText.innerHTML = '全部(' + json.mix.totalCount + ')';
            this.appText.innerHTML = '应用(' + json.app.totalCount + ')';
            this.gameText.innerHTML = '游戏(' + json.game.totalCount + ')';

            this.bind();
            this.show();
            this.setFocus();
        },

        /**
         * 设置焦点
         */
        setFocus: function () {
            var category = this.parentControl.category;
            var currentCategory = dojo.query('li[category=' + category + ']', this.content)[0];

            if (this.currentCategory !== currentCategory) {
                this.currentCategory && dojo.removeClass(this.currentCategory, 'selected');
                this.currentCategory = currentCategory;
                dojo.addClass(this.currentCategory, 'selected');
            }
        }
      });

})(this);
