/**
 * @description module logic for Category page
 * @creator Leo
 */

(function (global, undefined) {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_hd_';
    var TYPE = location.hash.split('/')[0].replace('#', '') || 'game';
    var URL = "http://zhushou.sogou.com/data/data.html?Os_type=Android&data=@";

    dojo.declare('website.HD.Module', [website.IModule], {
        // 属性
        type:   null,
        category: null,
        lang:   null,
        sort: null,
        pageIndex: null,
        footer: dojo.query('div.footer')[0],
        loader: null,
        storePath: null,

        IDS: {
            navigator: BASEPATH + TYPE + '_navigator',
            pager: '',
            botAds: BASEPATH + TYPE + '_botAds'
        },
        postData: {
            data: {
                game: {
                    website_hd_game_navigator: {
                        module: 'navigator',
                        category_group: '1090'
                    },
                    website_hd_game_botAds: {
                        module: 'fragment',
                        frag_id: '1014'
                    }
                },
                app: {
                    website_hd_app_navigator: {
                        module: 'navigator',
                        category_group: '1098'
                    },
                    website_hd_app_botAds: {
                        module: 'fragment',
                        frag_id: '1016'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'hd',

        // 组件
        navigator:      null,
        pager:          null,
        botAds:         null,

        /**
         * 构造方法
         */
        constructor: function () {
            this.resolveHash();
            this.resolvePath();
            this.IDS.pager = this.storePath;
            this.initializeComponents();

            var me = this;
            dojo.subscribe('/dojo/hashchange', function(hash) {
                me.resolveHash();
                me.resolvePath();
                me.IDS.pager = me.storePath;
                // 发送请求
                var o, json;
                // 生成请求json
                o = {data:{}};
                o.data[me.storePath] = {
                    module: 'applist',
                    type: 'category',
                    category_group: (me.type === 'game' ? '1014' : '1002'),
                    sort: me.sort,
                    langid: me.lang,
                    hd: 1,
                    start: (me.pageIndex-1) * 36,
                    limit: 36,
                    order: 'down'
                };
                if (me.category !== 'all') {
                    o.data[me.storePath]['categoryid'] = me.category;
                }
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
                //window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
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
                type: 'category',
                category_group: (this.type === 'game' ? '1014' : '1002'),
                sort: this.sort,
                langid: this.lang,
                hd: 1,
                start: (this.pageIndex-1) * 36,
                limit: 36,
                order: 'down'
            };
            if (this.category !== 'all') {
                this.postData.data[this.type][this.storePath]['categoryid'] = this.category;
            }

            return this.inherited(arguments);
        },

        /**
         * 初始化页面组件
         */
        initializeComponents: function () {
            this.navigator = new website.HD.Navigator({
                parent: this,
                container: dojo.byId('navigator'),
                tmplId: 'navigator_tmpl'
            });
            this.pager = new website.HD.Pager({
                parent: this,
                container: dojo.byId('container'),
                tmplId: 'panel_tmpl'
            });
            this.botAds = dojo.query('.bottomads')[0];
        },

        /**
         * 根据hash取得各种排序属性
         */
        resolveHash: function () {
            // rules of hash like #app/all/0/all/0/hot/1
            var hash = location.hash.replace('#', ''),
                rules = hash.split('/');

            // 页面类型
            this.type = rules[0] || 'game';
            // 类别种类: EG: 1015
            this.category = rules[1] || 'all';
            // 语言种类: 1中文 2英文 0所有
            this.lang = rules[2] || '0';
            // 排序类别: 'hot|date|download|fast|new|rate'
            this.sort = rules[3] || 'hot';
            // 当前页码
            this.pageIndex = rules[4] || 1;
        },

        /**
         * 生成localStorage的翻页存储地址
         */
        resolvePath: function () {
            this.storePath = BASEPATH + this.type + LinkerChar + this.category + LinkerChar
                + this.lang + LinkerChar + this.sort + LinkerChar + this.pageIndex;
        },

        /**
         * 设置页面组件数据源
         * @param {object} data
         */
        setData: function (data) {
            if (!data)
                return;

            // navigator
            if (data[this.IDS.navigator]) {
                this.navigator.setData(data[this.IDS.navigator]);
            }
            // pager
            if (data[this.IDS.pager]) {
                this.pager.setData(data[this.IDS.pager]);
            }
            // bottom ads
            if (data[this.IDS.botAds] && data[this.IDS.botAds].html) {
                var str = decodeURIComponent(data[this.IDS.botAds].html);
                this.botAds.innerHTML = str;
                this.botAds.style.visibility = 'visible';
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
            // $PingBack('msite_' + this.type + '_hd_bv');
        }
    });

    var module;
    module = new website.HD.Module();
    module.setup();
})(this);