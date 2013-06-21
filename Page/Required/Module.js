/**
 * @description {string} module logic for Required page
 * @creator {*} Leo
 */
(function (global, undefined) {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_required_';
    var TYPE = 'app';
    var URL = "http://zhushou.sogou.com/data/data.html?Os_type=Android&data=@";

    // Store for pager's localStorage path
    var PATH = '';

    dojo.declare('website.Required.Module', [website.IModule], {
        // 属性
        type:       'app',
        category:   null,
        loader:     null,
        storePath:  null,
        footer: dojo.query('div.footer')[0],

        IDS: {
            tab: '',
            botAds: BASEPATH + TYPE + '_botAds',
            comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                app: {
                    website_required_app_botAds: {
                        module: 'fragment',
                        frag_id: '1007'
                    },
                    website_required_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'required',

        // 组件
        tab:            null,
        botAds:         null,
        comAds:         null,

        /**
         * 构造方法
         */
        constructor: function () {
            this.resolveHash();
            this.resolvePath();
            this.IDS.tab = this.storePath;
            this.initializeComponents();

            var me = this;
            dojo.subscribe('/dojo/hashchange', function(hash) {
                me.resolveHash();
                me.resolvePath();
                me.IDS.tab = me.storePath;
                // 发送请求
                var o, json;
                // 生成请求json
                o = {data:{}};
                o.data[me.storePath] = {
                    module: 'applist',
                    type: 'normal',
                    sort: 'download',
                    categoryid: me.category,
                    category_group: '1002',
                    start: 0,
                    limit: 54,
                    order: 'down'
                };
                o.returnFormat = 'jsonp';
                json = JSON.stringify(o);

                dojo.io.script.get({
                    url: URL.replace('@', json),
                    callbackParamName: 'callback'
                }).then(function(data){
                    if (!data) {
                        if(me.errorCallback && (typeof me.errorCallback === 'function'))
                            me.errorCallback();
                        return;
                    }

                    var serialization;
                    try {
                        serialization = JSON.parse(data);
                    } catch(e) {
                        throw new Error("request HomePage data from server format error");
                    }
                    me.setData(serialization);
                });
            });
        },

        /**
         * 生成http请求的json数据格式
         * @override
         * @return {json}
         */
        generatePostJson: function () {
            // 修正要请求的数据
            this.postData.data[this.type][this.storePath] = {
                module: 'applist',
                type: 'normal',
                sort: 'download',
                categoryid: this.category,
                category_group: '1002',
                start: 0,
                limit: 54,
                order: 'down'
            };

            return this.inherited(arguments);
        },

        /**
         * 初始化页面组件
         */
        initializeComponents: function () {
            this.tab = new website.Required.Tab({
                parent: this,
                container: dojo.byId('container'),
                tmplId: 'panel_tmpl'
            });
            this.botAds = new website.AdsBanner({
                parent: this,
                container: dojo.byId('botAds'),
                tmplId: 'ads_tmpl'
            });
            this.comAds = new website.CommonAds({
                parent: this,
                container: dojo.query('div.commonAds')[0]
            });
        },

        /**
         * 根据hash取得各种排序属性
         */
        resolveHash: function () {
            // rules of hash like #1045
            var hash = location.hash.replace('#', ''),
                rules = hash.split('/');

            // 类别种类: EG: 1045
            this.category = rules[0] || '1045';
        },

        /**
         * 生成localStorage的翻页存储地址
         */
        resolvePath: function () {
            this.storePath = BASEPATH + this.type + LinkerChar + this.category;
        },

        /**
         * 设置页面组件数据源
         * @param {object} data
         */
        setData: function (data) {
            if (!data) return;
            // tab
            if (data[this.IDS.tab]) {
                this.tab.setData(data[this.IDS.tab]);
            }
            // bottom ads
            if (data[this.IDS.botAds]) {
                this.botAds.setData(data[this.IDS.botAds]);
            }
            // common ads
            if (data[this.IDS.comAds]) {
                this.comAds.setData(data[this.IDS.comAds]);
            }

            this.footer.style.display = 'block';
            // 放在这里才是网页上面所有的img元素都被渲染出来的时机
            // 所以ImageLoader在页面的生命周期中应该在此刻初始化
            if (this.loader) {
                this.loader.destroy();
            }
            this.loader = this.createImgLoader();
        },

        /**
         *  发起页面数据请求
         */
        getData: function () {
            this.sendRequest();
        },

        /**
         * 启动页面逻辑
         */
        setup: function () {
            this.getData();
            // @PingBack
            // $PingBack('msite_app_required_bv');
        }

    });

    var module;
    module = new website.Required.Module();
    module.setup();
})(this);