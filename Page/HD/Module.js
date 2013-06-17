/**
 * @description module logic for Category page
 * @creator Leo
 */

(function () {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_hd_';
    var TYPE = location.hash.split('/')[0].replace('#', '') || 'game';

    dojo.declare('website.HD.Module', [website.IModule], {
        // attr
        type:   null,
        category: null,
        lang:   null,
        sort: null,
        pageIndex: null,
        footer: dojo.query('div.footer')[0],

        // com
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

        // components
        navigator:      null,
        pager:          null,
        botAds:         null,

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
                hd: 1,
                start: (this.pageIndex-1) * 36,
                limit: 36,
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
                        category_group: (self.type === 'game' ? '1014' : '1002'),
                        sort: self.sort,
                        langid: self.lang,
                        hd: 1,
                        start: (self.pageIndex-1) * 36,
                        limit: 36,
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
         * Data from server side fills in page components
         * @param data
         */
        setData: function (data) {
            if (!data)
                return;

            var me = this;
            var useNavagator = false,
                usePager = false,
                useBotAds = false;

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
            if (data[this.IDS.botAds] && data[this.IDS.botAds].html) {
                var str = decodeURIComponent(data[this.IDS.botAds].html);
                this.botAds.innerHTML = str;
                this.botAds.style.visibility = 'visible';
                useBotAds = true;
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
                this.botAds.innerHTML = decodeURIComponent(JSON.parse(data).html);
                this.botAds.style.visibility = 'visible';
                delete this.postData['data'][this.type][this.IDS.botAds];
                ++i;
            }

            if (i === 3) {
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
            $PingBack('msite_' + this.type + '_hd_bv');
        }

    });
})();

var module;
module = new website.HD.Module(this);
module.setup();
