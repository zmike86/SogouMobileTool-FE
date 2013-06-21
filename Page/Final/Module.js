
dojo.declare('website.Final.Module', website.IModule, {

    // attr
    systemID:       9,
    PAGE_ID:        'final',

    // components
    
    hotRank:        null,
    constructor:function(config){   
       
        
        this.navimg = dojo.byId('navimg');
        this.navbtn = dojo.byId('navbtn');
        this.category = dojo.byId('category');
        this.bigicon = dojo.byId('bigicon');
        this.name = dojo.byId('name');
        this.downloadCount = dojo.byId('downloadCount');
        this.size = dojo.byId('size');
        this.updatetime =  dojo.byId('updatetime');
        this.version =  dojo.byId('version');
        this.language = dojo.byId('language');
        this.system = dojo.byId('system');
        this.freeinstallbtn = dojo.byId('freeinstallbtn');
        this.gameintro =dojo.byId('gameintro');
        this.score = dojo.byId('score');
        this.markednum = dojo.byId('markednum');
        this.tabbar = dojo.byId('tabbar');
        this.currentTab = dojo.byId('profile');
        this.imgList = dojo.byId('imgList');
        this.imgHeng = [];
        this.imgShu = [];
        this.template = YayaTemplate(dojo.byId('rank_tmpl').innerHTML);
        //this.downloadRank = dojo.byId('downloadRank');
       // this.hotRank = dojo.byId('hotRank');
       // this.hotTemplate = YayaTemplate(dojo.byId("panel_tmpl").innerHTML);
        this.downmore = dojo.byId('downmore');
        //this.hotmore = dojo.byId('hotmore');
        this.adslist = dojo.byId('adsList');
        this.star = dojo.byId('star');
        this.author = dojo.byId('author');
        this.warning = dojo.byId('warning');
        this.sourcebtn = dojo.byId('sourcebtn');
        this.sourceList = dojo.byId('sourceList');

    },
    
   
    changePage:function(event){
        var target = event.target;
        if(target.id == 'barname'){return;}
        if(target.id == 'type'){
            if(this.finalData.final.detail.category.group.id=="1"){
                window.location = 'hot.html#app/all';
            }else{
                 window.location = 'hot.html#game/all';
            }
            

        }
        if(target.id == 'category'){
            
            if(this.finalData.final.detail.category.group.id=="1"){
                window.location = 'hot.html#app/'+this.finalData.final.detail.category.category.id;
            }else{
                 window.location = 'hot.html#game/'+this.finalData.final.detail.category.category.id;;
            }
        }
    },
    over:function(){

        this.freeinstallbtn.className = 'freebtnhover';
    },
    out:function(){
        this.freeinstallbtn.className = 'freeinstallbtn';
    },
    sourceover:function(){
	
	//setTimeout(function(){this.sourcebtn.className = 'sourcehover';},10);
        this.sourcebtn.className = 'sourcehover';
    },
    sourceout:function(){
	
	//setTimeout(function(){this.sourcebtn.className = 'source';},10);
        this.sourcebtn.className = 'source';
    },
    adspingBack:function(){
        //@pingBack
        $PingBack('msite_final_ads_bv');
    },
    displaySource:function(event){

        if(this.sourceflag==false){
            return;
        }
        var target = event.target;
        if(this.sourceList.style.display == 'block'){
            this.sourceList.style.display = 'none';
            this.sourcebtn.className='source';
        }else{
            this.sourceList.style.display = 'block';
            this.sourcebtn.className='sourceup';
        }
        
    },
    sourceliover:function(event){
	var target = event.target;

	if(target.nodeName=='LI'){
		target.className = 'sourcelihover';
	 }
	},
    sourceliout:function(event){
	var target = event.target;

	if(target.nodeName=='LI'){
		target.className = '';
	 }
    },
    bindListener:function(){

        dojo.connect(this.tabbar,"onclick",this,this.jump);
        dojo.connect(this.freeinstallbtn,"onclick",this,this.eventhandle);
        dojo.connect(this.hotRank,"onclick",this,this.hoteventhandle);
        dojo.connect(this.category,"onclick",this,this.categoryJump);
        dojo.connect(this.navbtn,"onclick",this,this.displayUp);
       dojo.connect(this.downmore,"onclick",this,this.jumpMore);
        dojo.connect(this.hotmore,"onclick",this,this.jumpMore);
        dojo.connect(this.freeinstallbtn,"mouseenter",this,this.over);
         dojo.connect(this.freeinstallbtn,"mouseleave",this,this.out);
         dojo.connect(this.sourcebtn,"mouseenter",this,this.sourceover);
         dojo.connect(this.sourcebtn,"mouseleave",this,this.sourceout);

	
          dojo.connect(this.adsList,"click",this,this.adspingBack);
           dojo.connect(this.sourcebtn,"onclick",this,this.displaySource);
           dojo.connect(this.sourceList,"onclick",this,this.displaySource);
            dojo.connect(this.sourceList,"onclick",this,this.eventhandle);
    /*    dojo.connect(this.installbtn,"onclick",this,this.downloadHandle);
        dojo.connect(this.category,"onclick",this,this.changePage);
         
        this.rankinstallbtn = dojo.query('.rankinstallbtn');
        
        for(i=0;i<this.rankinstallbtn.length;i++){
            dojo.connect(this.rankinstallbtn[i],"onclick",this,this.rankdownloadHandle);
        }*/

    },
    jumpMore:function(event){
        var target = event.target;
        if(target.id=="downmore"){
            window.location = "Top.html?type="+this.categoryType;

        }else{

           window.location = "Portal.html?type="+this.categoryType;
        }
    },
    displayUp:function(event){

        if(this.gameintro.className == "gameintro"){
            this.gameintro.className = "displayup";
            
            this.navimg.src = "../img/final/navbtnup.gif";
        }else{

            this.gameintro.className = "gameintro";
            this.navimg.src = "../img/final/navbtn.gif";
        }
    },
    categoryJump:function(event){
        var target = event.target;
        if(target.id=="categoryType"){

            window.location = "Category.html#"+ this.categoryType;
        }else if(target.id=="categorys"){
           
            window.location = "Category.html#"+ this.categoryType+"/"+this.categoryid ;
        }else if(target.id=="homepage"){

             window.location ="Portal.html?type="+ this.categoryType;

        }else{return;}
    },
    taskId:function(){
        return Math.floor(Math.random()*100000 - Math.random()*100);
    },
    eventhandle:function(event){
        
            //@pingBack
              
        $PingBack('_msite'+module.PAGE_ID+'_bs'+this.appId); 
        var target = event.target;
        
        if(target.getAttribute('state')=="disabled"){
            return
        }
        var url =target.url?target.url:"http://zhushou.sogou.com/data/download.html?Os_type=Android&appid=@";
        
        url = window.decodeURIComponent(url);
        var taskid = this.taskId();
        var appid = this.finalData.final.detail.appid;
       
        window.external.InstallApp(taskid, parseInt(appid),
                this.finalData.final.detail.name, url.replace(/@/g, appid), this.finalData.final.detail.icon,
                event.clientX, event.clientY, document);
    },
    hoteventhandle:function(event){
        
        var url = "http://zhushou.sogou.com/data/download.html?Os_type=Android&appid=@";
        var target = event.target;
        if(target.name!==undefined){
             window.location = 'final.html?appid='+target.appid;
         }else{
        var taskid = this.taskId();

        var parent = target.parentNode;
        var appid = parent.getAttribute('appid');
      
        //target.innerHTML = '安装中';
        //target.className = "installbtndisabled";

        window.external.InstallApp(taskid, parseInt(appid),
                parent.getAttribute('appname'), url.replace(/@/g, appid), parent.getAttribute('appicon'),
                event.clientX, event.clientY, document);
         }
        
    },
    jump:function(event){
        
        var target = event.target;
        if(target.nodeName == 'DIV'){
            return
        }
        
        if(target.id == "hotimgs"){
            //window.location.href = "#POS";
            var _h = dojo.byId('infoWraper').offsetHeight+35+134+12+31;
            window.scrollTo(0,_h);

        }
        if(this.currentTab!==target){
            target.className = "pressed";
            this.currentTab.className="";
            this.currentTab = target;
        }
       

    },
    deCode:function(data){

            if(data.icon_l!==undefined){
                data.icon_l = window.decodeURIComponent(data.icon_l); 
            }
            data.icon= window.decodeURIComponent(data.icon);
            data.name = window.decodeURIComponent(data.name);
            data.tip = window.decodeURIComponent(data.tip);
            data.size = window.decodeURIComponent(data.size);
            data.description = window.decodeURIComponent(data.description);

            data.tip =  window.decodeURIComponent(data.tip);
            //data.category.category_group.name = window.decodeURIComponent(data.category.category_group.name));
            
            if(data.category.categorys==undefined){
                return
            }
            
            data.category.categorys[0].name = window.decodeURIComponent(data.category.categorys[0].name);
            this.categoryid = data.category.categorys[0].category_id;

    },
    setData:function(data){

        var data = data.final.detail;
       
        this.deCode(data);
        
        if(data.category.categorys!==undefined){
            this.category.innerHTML = "<span id='homepage'>手机"+window.decodeURIComponent(data.category.category_group.name)+"</span>&nbsp;>&nbsp;<span id='categoryType'>"+window.decodeURIComponent(data.category.category_group.name)+"分类</span>&nbsp;>&nbsp;<span id='categorys'>"+data.category.categorys[0].name+"</span>";
        }
        if(window.decodeURIComponent(data.category.category_group.name)=="应用"){
            this.categoryType = "app";

        }else{
            this.categoryType = "game";
        }
        this.bigicon.original = data.icon_l? data.icon_l:data.icon;
        this.name.innerHTML = data.name.substring(0,10);
        this.downloadCount.innerHTML = '下载次数：'+data.downloadCount+'次';
       
        this.warning.innerHTML = '<a href="http://zhushou.sogou.com/report.html?appid='+this.appId+'" target="_blank" hidefocus="true">举报</a>';
        
        this.size.innerHTML = '大小：'+data.size;
        this.updatetime.innerHTML = '更新：'+ new Date(parseInt(data.modifiedtime*1000)).toLocaleString().replace(/:\d{1,2}$/,' ').split(' ')[0];
        
        this.version.innerHTML = '版本：'+window.decodeURIComponent(data.version);
        if(data.langid==1){
            this.language.innerHTML = '语言：中文';
        }else if(data.langid==2){
            this.language.innerHTML = '语言：英文';
        }else{
            this.language.innerHTML = '语言：全部';
        }
        
        this.system.innerHTML = '平台：'+window.decodeURIComponent(data.platform);
        
        if(data.author!==undefined){
            this.author.innerHTML = '作者：'+window.decodeURIComponent(data.author);
        }
        
        if(this.categoryType=='app'){
            this.currentTab.innerHTML = '应用概况';
            this.gameintro.innerHTML = '★应用简介：<br>'+data.description;
        }else{

            this.currentTab.innerHTML = '游戏概况';
            this.gameintro.innerHTML = '★游戏简介：<br>'+data.description;
        }
       
       

        this.score.innerHTML = '<em>'+data.score+'</em>分';
        //this.markednum.innerHTML = '共&nbsp<em>'+data.ratenum+'<em>&nbsp人打分';
        this.freeinstallbtn.appid = this.appId;
        if(Math.ceil(data.score/2) == 0){
            this.star.className = "dark";
            dojo.byId('markword').innerHTML = ''
        }
        if(Math.ceil(data.score/2) == 1){
            this.star.className = "starone";
            dojo.byId('markword').innerHTML = '呃~~(╯﹏╰)b';
        }
        if(Math.ceil(data.score/2) == 2){
            this.star.className = "startwo";
            dojo.byId('markword').innerHTML = '差劲 ╮(╯▽╰)╭';
        }
        if(Math.ceil(data.score/2) == 3){
            this.star.className = "starthree";
            dojo.byId('markword').innerHTML = '还行 (>^ω^<)';
        }
        if(Math.ceil(data.score/2) == 4){
            this.star.className = "starfour";
            dojo.byId('markword').innerHTML = '推荐下载O(∩_∩)O';
        }
        if(Math.ceil(data.score/2) == 5){
            this.star.className = "starfive";
             dojo.byId('markword').innerHTML = '力荐啦~\(≧▽≦)/~';

        }
        
        //data.source = [{'text':'应用汇','url':'www.baidu.com'},{'text':'应用汇','url':'www.baidu.com'},{'text':'应用汇','url':'www.baidu.com'}];
        if(data.source==undefined||data.source==[]){
            
            this.sourceflag=false;
            
        }else{
            var sourcestr='';
            for(i=0;i<data.source.length;i++){
             sourcestr += '<li url="'+data.source[i].url+'">来源：'+data.source[i].text+'</li>';
            }
            this.sourceList.innerHTML = '<ul>'+sourcestr+'</ul>';
            for(i=0;i<this.sourceList.childNodes[0].childNodes.length;i++){
                dojo.connect(this.sourceList.childNodes[0].childNodes[i],"mouseenter",this,this.sourceliover);
                dojo.connect(this.sourceList.childNodes[0].childNodes[i],"mouseleave",this,this.sourceliout);
            }

        }
        
    },
    setImgData:function(){

            var self = this;
            
            if(self.imgHeng.length!==0){
                for(i=0;i<self.imgHeng.length;i++){
                    var imgtempHeng = document.createElement('img');
                    imgtempHeng.src = imgtempHeng.original = self.imgHeng[i];
                    imgtempHeng.className = "heng";
                    self.imgList.appendChild(imgtempHeng);
                }
            }
            
            if(self.imgShu.length!==0){
              
                for(i=0;i<self.imgShu.length;i++){
                    var imgtempShu = document.createElement('img');
                    imgtempShu.onreadystatechange = function(){
                        
                        if(imgtempShu.readyState=="complete"){
                            
                            if(imgtempShu.width<240){
                                imgtempShu.style.width=240+"px";
                                imgtempShu.style.height = (240*imgtempShu.height)/imgtempShu.width;
                            }
                        }
                        
                    }
                    imgtempShu.src = imgtempShu.original = self.imgShu[i];

                    imgtempShu.className = "shu";

                    
                    self.imgList.appendChild(imgtempShu);
                  // setTimeout(function(){},0);
                    /*if(imgtempShu.width<240){
                        imgtempShu.style.width=240+"px";
                        imgtempShu.style.height = (240*imgtempShu.height)/imgtempShu.width;
                    }*/
                   
                }
            }
    },
    getProportion:function(imgurl){
        
        var self = this;
        var imgurl = window.decodeURIComponent(imgurl);
        
        var img = new Image();
        
        img.onreadystatechange = function(){
         
                
                if(img.readyState=="complete"){
                    
                    var width = img.width;
                    var height = img.height;
                   
                    if(width >=height){
                        
                        self.imgHeng.push(imgurl);
                        
                    }
                    if(width < height){
                        
                        self.imgShu.push(imgurl);

                    }
                    if(self.imgHeng.length+self.imgShu.length==self.imgArr.length){

                        self.setImgData();
                    }  
                      
                }
                
            
        };
        
        img.src = imgurl;
        
        
    },
    setImage:function(data){
            
            var self =this;
            self.imgArr = data.final.detail.image;

            for(i=0;i<self.imgArr.length;i++){
                this.getProportion(self.imgArr[i].url_m);
            }

            
    },

    setdownloadData:function(data){

            var downdata = data.downloadRank.list;
            var hotdata = data.hotRank.list;
            var adsdata = data.ads.html;
            this.downloadRank = new website.Final.Rank({
                parent: this,
                container: dojo.byId('downloadRank'),
                tmplId: 'rank_tmpl',
                type: this.categoryType,
                showdate: false
            });
           
            this.hotRank = new website.Final.Panel({
                parent: this,
                container: dojo.byId('recPanel'),
                tmplId: 'panel_tmpl',
                type: this.categoryType,
                showdate: false
            });
            this.downloadRank.setData(downdata);
            this.hotRank.setData(hotdata);
            //this.downloadRank.innerHTML = this.template.render({data:downdata});
            //this.hotRank.innerHTML = this.hotTemplate.render({data:hotdata});
            this.adslist.innerHTML = window.decodeURIComponent(adsdata);
            this.createImgLoader();
            dojo.byId('footer').style.visibility="visible";
    },
    getAppId:function(){
        var queryString = location.search;

        var start = queryString.indexOf('=');
        this.appId = queryString.substring(start+1,queryString.length+1);
        if(queryString.indexOf('packagename')!==-1){
           this.haoma = true;

        }
      

    },
   
    init:function(){
        var self = this;

        self.postData = {"data":{
                                "final":{
                                        "module": "appdetail",
                                        "appid" :  self.appId
                                        }
                                
                                
                                

                                }
                        };
        self.postRankData = {"data":{
                                "downloadRank":{
                                        "module":"applist",
                                        "type":"normal",
                                        "sort":"download",
                                        "order":"down",
                                        "start":"0",
                                        "limit":"10",
                                        "timeline":"0",
                                        "category_group":''
                                        },
                               
                                
                                "hotRank":{
                                        "module":"applist",
                                        "type":"normal",
                                        "sort":"hot",
                                        "order":"down",
                                        "start":"0",
                                        "limit":"12",
                                        "timeline":"0",
                                        "category_group":''

                                        },
                                "ads": { "module": "fragment",
                                        "frag_id" :  "1012"


                                    }
                                }
                            };

        if(self.haoma == true){
            delete self.postData.data['final'].appid;
            self.postData.data['final'].packagename="haoma"; 
        }
        
        window.callbackFinal = function(data){

            var data = dojo.fromJson(data);
            
            if(data.downloadRank==undefined){
                self.finalData = data;
                self.setData(self.finalData);
                self.setImage(self.finalData);

                if(self.categoryType == 'app'){
                     self.postRankData.data.downloadRank.category_group="1002";
                     self.postRankData.data.hotRank.category_group="1002";
                }else{
                   
                    self.postRankData.data.downloadRank.category_group="1014";
                   
                    self.postRankData.data.hotRank.category_group="1014";
                }
                
                self.bindListener();
                self.sendRequest(self.postRankData);
            }else{
                
                self.rankData = data;
               self.setdownloadData(self.rankData); 
            }
            
            
            
            
        };
       window.UpdateDownloadProgress = function (appid, json) {

        var state = JSON.parse(json).state;
        
        var hotPanel = dojo.byId('hotPanel');
        
        switch (state) {
            case 'connecting':
                
                if(module.freeinstallbtn.appid == appid||module.freeinstallbtn.appid=='haoma'){
                    
                   

                    module.freeinstallbtn.innerHTML = '安 装 中';
                    module.freeinstallbtn.setAttribute('state', 'disabled');
                }else{

                    dojo.query('li[appid=' + appid + ']').forEach(function(node, index, list){
                    var btn = dojo.query('span.installbtn', node)[0];

                    dojo.addClass(btn, 'installbtndisable');
                    btn.innerHTML = '安装中';
                    btn.setAttribute('state', 'disable');
                });
                }
                break; 
            case 'download_failed':
            case 'install_failed':
            case 'install_finished':
            case 'download_deleted':
                  
                if(module.freeinstallbtn.appid == appid||module.freeinstallbtn.appid=='haoma'){
                    
                    
                    module.freeinstallbtn.innerHTML = "免费安装";
                    module.freeinstallbtn.setAttribute('state', '');
                }else{
                    
                    dojo.query('li[appid=' + appid + ']').forEach(function(node, index, list){
                    var btn = dojo.query('span.installbtn', node)[0];
                    
                    dojo.removeClass(btn, 'installbtndisable');
                    dojo.removeClass(btn, 'installbtnhover');
                    btn.innerHTML = '安装';
                    btn.setAttribute('state', '');
                });
                }
                
                break;
        }
    };
       
    },
    sendRequest:function(data){
        
        var data = dojo.toJson(data);

       window.external.GetWebsiteAPPInfo_Async(data, "callbackFinal", document);
    }
});

//@PingBack
$PingBack('msite_final_bv');

var module;

dojo.ready(function () {
    module = new website.Final.Module(this);
    module.getAppId();
    module.init();

    module.sendRequest(module.postData);
    
});