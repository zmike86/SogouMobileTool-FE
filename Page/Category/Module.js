/**
 * @description module logic for Category page
 * @creator Leo
 */

(function () {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_category_';
    var TYPE = location.hash.split('/')[0].replace('#', '') || 'game';

    dojo.declare('website.Category.Module', [website.IModule], {
        // attr
        type:   null,
        category: null,
        lang:   null,
        size:   null,
        HD: null,
        sort: null,
        pageIndex: null,

        // com
        loader: null,
        storePath: null,

        IDS: {
            navigator: BASEPATH + TYPE + '_navigator',
            pager: '',
            botAds: BASEPATH + TYPE + '_botAds',
            comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                game: {
                    website_category_game_navigator: {
                        module: 'navigator',
                        category_group: '1014'
                    },
                    website_category_game_botAds: {
                        module: 'fragment',
                        frag_id: '1003'
                    },
                    website_category_game_comAds: {
                        module: 'fragment',
                        frag_id: '1004'
                    }
                },
                app: {
                    website_category_app_navigator: {
                        module: 'navigator',
                        category_group: '1002'
                    },
                    website_category_app_botAds: {
                        module: 'fragment',
                        frag_id: '1007'
                    },
                    website_category_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'category',
        footer: dojo.query('div.footer')[0],

        // components
        navigator:      null,
        pager:          null,
        botAds:         null,
        comAds:         null,

        constructor: function () {
            // this.getPDAInfor();
            this.resolveHash();
            this.resolvePath();

            this.IDS.pager = this.storePath;
            // adjust post json data
            this.postData.data[this.type][this.storePath] = {
                module: 'applist',
                type: 'category',
                category_group: (this.type === 'game' ? '1014' : '1002'),
                sort: this.sort,
                langid: this.lang,
                hd: this.HD,
                start: (this.pageIndex-1) * 54,
                limit: 54,
                order: 'down'
            };
            if (this.category !== 'all') {
                this.postData.data[this.type][this.storePath]['categoryid'] = this.category;
            }
            if (this.size !== 'all') {
                this.postData.data[this.type][this.storePath]['sizeid'] = this.size;
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
                        category_group: (self.type === 'game' ? '1014' : '1002'),
                        sort: self.sort,
                        langid: self.lang,
                        hd: self.HD,
                        start: (self.pageIndex-1) * 54,
                        limit: 54,
                        order: 'down'
                    };
                    if (self.category !== 'all') {
                        o.data[self.storePath]['categoryid'] = self.category;
                    }
                    if (self.size !== 'all') {
                        o.data[self.storePath]['sizeid'] = self.size;
                    }
                    json = JSON.stringify(o);
                    window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
                }
                // 避免是从外界导航到此页面
                data = LocalStorage.read(self.IDS.navigator);
                if (data) {
                    self.navigator.setData(JSON.parse(data));
                } else {
                    // 生成请求json
                    o = {data:{}};
                    o.data[self.IDS.navigator] = self.postData.data[self.type][self.IDS.navigator];
                    json = JSON.stringify(o);
                    window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
                }
            });
        },
        /**
         * initialize included components
         */
        initializeComponents: function () {
            this.navigator = new website.Category.Navigator({
                parent: this,
                container: dojo.byId('navigator'),
                tmplId: 'navigator_tmpl'
            });
            this.pager = new website.Category.Pager({
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
            // rules of hash like #app/all/0/all/0/hot/1
            var hash = location.hash.replace('#', ''),
                rules = hash.split('/');

            // 页面类型
            this.type = rules[0] || 'game';
            // 类别种类: EG: 1015
            this.category = rules[1] || 'all';
            // 语言种类: 1中文 2英文 0所有
            this.lang = rules[2] || '0';
            // 安装包大小: 1： 0-20 MB 2：20-50 MB  3： 50 MB
            this.size = rules[3] || 'all';
            // 分辨率: 1 hd高清 0 通用
            this.HD = rules[4] || '0';
            // 排序类别: 'hot|date|download|fast|new|rate'
            this.sort = rules[5] || 'hot';
            // 当前页码
            this.pageIndex = rules[6] || 1;
        },

        /**
         * 生成localStorage的翻页存储地址
         */
        resolvePath: function () {
            this.storePath = BASEPATH + this.type + LinkerChar + this.category + LinkerChar + this.lang
                + LinkerChar + this.size + LinkerChar + this.HD + LinkerChar + this.sort + LinkerChar + this.pageIndex;
        },

        /**
         * Data from server side fills in page components
         * @param data
         */
        setData: function (data) {
            if (!data)
                return;

            var me = this;
            var useNavagator = false,
                usePager = false,
                useBotAds = false,
                useComAds = false;

            // navigator
            if (data[this.IDS.navigator]) {
                this.navigator.setData(data[this.IDS.navigator]);
                useNavagator = true;
            }
            // pager
            if (data[this.IDS.pager]) {
                this.pager.setData(data[this.IDS.pager]);
                usePager = true;
            }
            // bottom ads
            if (data[this.IDS.botAds]) {
                this.botAds.setData(data[this.IDS.botAds]);
                useBotAds = true;
            }
            // common ads
            if (data[this.IDS.comAds]) {
                this.comAds.setData(data[this.IDS.comAds]);
                useComAds = true;
            }

            this.footer.style.display = 'block';
            // 放在这里才是网页上面所有的img元素都被渲染出来的时机
            // 所以ImageLoader在页面的生命周期中应该在此刻初始化
            if (this.loader) {
                this.loader.destroy();
            }
            this.loader = this.createImgLoader();

            setTimeout(function() {
                var lc = LocalStorage,
                    str = JSON.stringify;

                useNavagator && lc.write(me.IDS.navigator, str(data[me.IDS.navigator]));
                usePager && lc.write(me.IDS.pager, str(data[me.IDS.pager]));
                useBotAds && lc.write(me.IDS.botAds, str(data[me.IDS.botAds]));
                useComAds && lc.write(me.IDS.comAds, str(data[me.IDS.comAds]));

            }, 100);
        },

        /**
         *  First time load page to check whether there
         *  has data in localStorage
         */
        getData: function () {
            var data,
                i = 0;
            // navigator
            data = LocalStorage.read(this.IDS.navigator);
            if (data) {
                this.navigator.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.navigator];
                ++i;
            }
            // pager
            data = LocalStorage.read(this.IDS.pager);
            if (data) {
                this.pager.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.pager];
                ++i;
            }
            // bottom ads
            data = LocalStorage.read(this.IDS.botAds);
            if (data) {
                this.botAds.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.botAds];
                ++i;
            }
            // common ads
            data = LocalStorage.read(this.IDS.comAds);
            if (data) {
                this.comAds.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.comAds];
                ++i;
            }

            if (i === 4) {
                this.footer.style.display = 'block';

                if (this.loader) {
                    this.loader.destroy();
                }
                this.loader = this.createImgLoader();
            } else {
                this.sendRequest();
            }
        },

        /**
         * set up module app
         */
        setup: function () {
            this.getData();
            //@PingBack
            $PingBack('msite_' + this.type + '_category_bv');
        }

    });
})();

var module;
module = new website.Category.Module(this);
module.setup();
