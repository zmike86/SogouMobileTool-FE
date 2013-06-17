/**
 * @description module logic for Search Result page
 * @creator Leo
 */
(function () {

    var LinkerChar = '_';
    var BASEPATH = 'website_result_';
    // 这里的type是预示着从哪个版块过来的
    // 如果从首页过来则是应用
    var TYPE = location.hash.split('/')[0].replace('#', '') || 'app';

    (function(){
        // 正常情况下得到的queryString就是编码后的关键字了
        var queryString = location.search.match(/keyword=([^#&])*/g)[0].replace('keyword=','');
        queryString = decodeURIComponent(queryString);
        // 但IE6下面会把#编码成%23，所以此时得到的queryString含有页面来源类型的哈希
        // location.hash就取到空值
        if (/(#|\%23)(app|game)$/g.test(queryString) && dojo.isIE == 6) {
            queryString = queryString.replace(/(#|\%23)(app|game)$/g,'');
            queryString = decodeURIComponent(queryString);
            // 第一步执行resolve keyWord会让后面的resolve hash正常工作
            TYPE = RegExp['$2'];
        }
    })();

    dojo.declare('website.Result.Module', [website.IModule], {
        // attr
        type:           null,
        category:       null,
        sort:           null,
        pageIndex:      null,
        keyword:        '',
        footer: dojo.query('div.footer')[0],

        // com
        loader:         null,
        storePath:      null,

        IDS: {
            downloadRank: BASEPATH + TYPE + '_downloadRank',
            recPanel: BASEPATH + TYPE + '_recPanel',
            ads: BASEPATH + TYPE + '_ads'
        },
        postData: {
            data: {
                game: {
                    website_result_game_downloadRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1014',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_result_game_recPanel: {
                        module: 'recommend',
                        position: 'game_14',
                        start: 0,
                        limit: 12
                    },
                    website_result_game_ads: {
                        module: 'fragment',
                        frag_id: '1012'
                    }
                },
                app: {
                    website_result_app_downloadRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1002',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_result_app_recPanel: {
                        module: 'recommend',
                        position: 'app_7',
                        start: 0,
                        limit: 12
                    },
                    website_result_app_ads: {
                        module: 'fragment',
                        frag_id: '1012'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'result',

        // components
        navigator:      null,
        pager:          null,
        downloadRank:   null,
        recPanel:       null,
        Ads:            null,

        constructor: function () {
            // this.getPDAInfor();
            this.resolvekeyWord();
            this.resolveHash();
            this.resolvePath();

            this.IDS.pager = this.storePath;
            // adjust post json data
            this.postData.data[this.type][this.storePath] = {
                module: 'search',
                groupid: this.category,
                sort: this.sort,
                keyword: encodeURIComponent(this.keyword),
                start: (this.pageIndex-1) * 14,
                limit: 14,
                order: 'down'
            };

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
                var o, json;
                // 生成请求json
                o = {data:{}};
                o.data[self.storePath] = {
                    module: 'search',
                    groupid: self.category,
                    sort: self.sort,
                    keyword: encodeURIComponent(self.keyword),
                    start: (self.pageIndex-1) * 14,
                    limit: 14,
                    order: 'down'
                };
                json = JSON.stringify(o);
                window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
            });
        },

        /**
         * initialize included components
         */
        initializeComponents: function () {
            this.navigator = new website.Result.Navigator({
                parent: this,
                container: dojo.byId('topbar')
            });
            this.pager = new website.Result.Pager({
                parent: this,
                container: dojo.byId('container'),
                tmplId: 'list_tmpl'
            });
            this.downloadRank = new website.Portal.Rank({
                parent: this,
                container: dojo.byId('downloadRank'),
                tmplId: 'rank_tmpl',
                type: this.type
            });
            this.recPanel = new website.Result.Panel({
                parent: this,
                container: dojo.byId('recPanel'),
                tmplId: 'panel_tmpl'
            });
            this.Ads = dojo.byId('adsList');
        },

        /**
         * 根据hash取得各种排序属性
         */
        resolveHash: function () {
            // 正常情况下得到的queryString就是编码后的关键字了
            var queryString = location.search.match(/keyword=([^#&])*/g);
			if (queryString) {
				queryString = queryString[0].replace('keyword=','');
				queryString = decodeURIComponent(queryString);
			} else {
				queryString = '';
			}

            // rules of hash like #app/mix/download/3
	        var hash, rules;
            hash = location.hash.replace('#', '');
            if (!hash && /(#|\%23)(app|game)$/g.test(queryString) && dojo.isIE == 6) {
                queryString = queryString.match(/(#|\%23)(app|game)$/g)[0];
		        hash = queryString.replace('#', '');
	        }
            rules = hash.split('/');

            // 来源页面的类型 game|app
            this.type = rules[0] || 'app';
            // 过滤类型 mix|game|app
            this.category = rules[1] || 'mix';
            // 排序类别: 'all|download|rate'
            this.sort = rules[2] || 'all';
            // 当前页码
            this.pageIndex = rules[3] || 1;
        },

        /**
         * 生成localStorage的翻页存储地址
         */
        resolvePath: function () {
            this.storePath = BASEPATH + this.type + LinkerChar + this.category +
                LinkerChar + this.sort + LinkerChar + this.pageIndex;
        },

        /**
         * 取得由query string传来的搜索关键字
		 * 只在页面第一次加载时执行
         */
        resolvekeyWord: function () {
            // 正常情况下得到的queryString就是编码后的关键字了
            var queryString = location.search.match(/keyword=([^#&])*/g)[0].replace('keyword=','');
            queryString = decodeURIComponent(queryString);
            // 但IE6下面会把#编码成%23，所以此时得到的queryString含有页面来源类型的哈希
            // location.hash就取到空值
            if (/(#|\%23)(app|game)$/g.test(queryString) && dojo.isIE == 6) {
                queryString = queryString.replace(/(#|\%23)(app|game)$/g,'');
				queryString = decodeURIComponent(queryString);
				//alert(queryString);
				//alert(decodeURIComponent(queryString));
				//alert(RegExp.$2);
                // 第一步执行resolve keyWord会让后面的resolve hash正常工作
                // dojo.hash(RegExp.$2);
			}
            this.keyword = queryString;
        },

        /**
         * Data from server side fills in page components
         * @param data
         */
        setData: function (data) {
            if (!data)
                return;

            var d;
            // pager
            if (data[this.IDS.pager]) {
                d = data[this.IDS.pager][this.category];
                this.navigator.setData(data[this.IDS.pager]);
                this.pager.setData(d);
            }
            // download rank
            if (data[this.IDS.downloadRank]) {
                this.downloadRank.setData(data[this.IDS.downloadRank]);
            }
            // recommend panel
            if (data[this.IDS.recPanel]) {
                this.recPanel.setData(data[this.IDS.recPanel]);
            }
            //ads
            if (data[this.IDS.ads] && data[this.IDS.ads].html) {
                this.Ads.innerHTML = decodeURIComponent(data[this.IDS.ads].html);
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
         * set up module app
         */
        setup: function () {
            this.getData();
            //@PingBack
            $PingBack('msite_' + this.type + '_result_bv');
        }

    });
})();

var module;
module = new website.Result.Module(this);
module.setup();
