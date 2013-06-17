(function (global, undefined) {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_girl_';
    var TYPE = location.hash.split('/')[0].replace('#', '') || 'game';

    dojo.declare('website.Girl.Module', [website.IModule], {
        // attr
        type: null,
        category: null,
        sort: null,
        pageIndex: null,
        storePath: null,

        IDS: {
            navigator: BASEPATH + TYPE + '_navigator',
            hotwords: BASEPATH + TYPE + '_hotwords',
            pager: '',
            botAds: BASEPATH + TYPE + '_botAds',
            comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                game: {
                    website_girl_game_navigator: {
                        "module": "navigator",
                        "category_group": '1025'
                    },
                    website_girl_game_hotwords: {
                        "module": "fragment",
                        "frag_id": '1009'
                    },
                    website_girl_game_botAds: {
                        module: 'fragment',
                        frag_id: '1003'
                    },
                    website_girl_game_comAds: {
                        module: 'fragment',
                        frag_id: '1004'
                    }
                },
                app: {
                    website_girl_app_navigator: {
                        module: 'navigator',
                        category_group: '1052'
                    },
                    website_girl_app_hotwords: {
                        "module": "fragment",
                        "frag_id": '1010'
                    },
                    website_girl_app_botAds: {
                        module: 'fragment',
                        frag_id: '1007'
                    },
                    website_girl_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID: 9,
        PAGE_ID:  'girl',
        footer: dojo.query('div.footer')[0],

        // components
        navigator:      null,
        hotWords:       null,
        pager:          null,
        botAds:         null,
        comAds:         null,
        loader: null,

        constructor: function () {
            // this.getPDAInfor();
            this.resolveHash();
            this.resolvePath();

            this.IDS.pager = this.storePath;
            // adjust post json data
            this.postData.data[this.type][this.storePath] = {
                module: 'applist',
                type: 'category',
                category_group: (this.type === 'game' ? '1025' : '1052'),
                sort: this.sort,
                start: (this.pageIndex-1) * 54,
                limit: 54,
                order: 'down'
            };
            if (this.category !== 'all') {
                this.postData.data[this.type][this.storePath]['categoryid'] = this.category;
            }

            var self = this;
            // cross domain ajax request callback
            window.jsonCallback = function (data) {
                if (!data) {
                    if (self.errorCallback && (typeof self.errorCallback === 'function'))
                        self.errorCallback();
                    return;
                }

                var serialization;
                try {
                    serialization = JSON.parse(data);
                } catch (e) {
                    throw new Error("request HomePage data from server format error");
                }
                self.setData(serialization);
            };

            this.initializeComponents();

            dojo.subscribe('/dojo/hashchange', function(hash) {
                self.resolveHash();
                self.resolvePath();
                self.IDS.pager = self.storePath;
                // 发送请求
                var data = LocalStorage.read(self.IDS.pager),
                    o, json;
                if (data) {
                    self.pager.setData(JSON.parse(data));
                    if (self.loader) {
                        self.loader.destroy();
                    }
                    self.loader = self.createImgLoader();
                } else {
                    // 生成请求json
                    o = {data:{}};
                    o.data[self.storePath] = {
                        module: 'applist',
                        type: 'category',
                        category_group: (self.type === 'game' ? '1025' : '1052'),
                        sort: self.sort,
                        start: (self.pageIndex-1) * 54,
                        limit: 54,
                        order: 'down'
                    };
                    if (self.category !== 'all') {
                        o.data[self.storePath]['categoryid'] = self.category;
                    }
                    json = JSON.stringify(o);
                    window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
                }
            });
        },

        /**
         * initialize included components
         */
        initializeComponents: function () {
            this.navigator = new website.Girl.Navigator({
                parent: this,
                container: dojo.byId('navigator'),
                tmplId: 'navigator_tmpl'
            });
            this.hotWords = dojo.byId('hotapps');
            this.pager = new website.Girl.Pager({
                parent: this,
                container: dojo.byId('container'),
                tmplId: 'panel_tmpl'
            });
            this.botAds = new website.AdsBanner({
                parent: this,
                container: dojo.byId('botAds')
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
            // rules of hash like #app/all/hot/1
            var hash = location.hash.replace('#', ''),
                rules = hash.split('/');

            // 页面类型
            this.type = rules[0] || 'game';
            // 类别种类: EG: 1015
            this.category = rules[1] || 'all';
            // 排序类别: 'hot|date|download|fast|new|rate'
            this.sort = rules[2] || 'hot';
            // 当前页码
            this.pageIndex = rules[3] || 1;
        },

        /**
         * 生成localStorage的翻页存储地址
         */
        resolvePath: function () {
            this.storePath = BASEPATH + this.type + LinkerChar + this.category + LinkerChar
                + this.sort + LinkerChar + this.pageIndex;
        },

        /**
         * Data from server side fills in page components
         * @param data
         */
        setData: function (data) {
            if (!data)
                return;

            // navigator
            if (data[this.IDS.navigator]) {
                this.navigator.setData(data[this.IDS.navigator]);
            }
            // hotWords
            if (data[this.IDS.hotwords] && data[this.IDS.hotwords].html) {
                str = decodeURIComponent(data[this.IDS.hotwords].html);
                this.hotWords.innerHTML = str;
            }
            // pager
            if (data[this.IDS.pager]) {
                this.pager.setData(data[this.IDS.pager]);
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
         *  First time load page to check whether there
         *  has data in localStorage
         */
        getData: function () {
            this.sendRequest();
        },

        /**
         * 启动模块功能
         */
        setup: function () {
            this.getData();
            //@PingBack
            $PingBack('msite_' + this.type + '_girl_bv');
        }
    });

})(this);

var module;
module = new website.Girl.Module(this);
module.setup();