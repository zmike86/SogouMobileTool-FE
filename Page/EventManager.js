(function (global) {

    if (!website)
        website = {};
    if (!website.EventManager)
        website.EventManager = {};

    var url = "http://zhushou.sogou.com/data/download.html?Os_type=Android&appid=@";

    function taskId () {
        return Math.floor(Math.random()*100000 - Math.random()*100);
    }

    function getAttr(name, dom, depth) {
        var parent = depth === 1 ? dom.parentNode : (depth === 2 ? dom.parentNode.parentNode : dom);
        return parent.getAttribute(name) || null;
    }

    dojo.mixin(website.EventManager, {
        on: function (evt) {
            dojo.stopEvent(evt);
            var target = evt.target;

            if (target.getAttribute('state') === 'disable')
                return;

            var taskid = taskId(),
                appid = getAttr('appid', target, 1),
                appname = getAttr('appname', target, 1),
                appicon = getAttr('appicon', target, 1);

            target.setAttribute('taskid', taskid);
            window.external.InstallApp(taskid, parseInt(appid), appname, url.replace(/@/g, appid),
                appicon, evt.clientX, evt.clientY, document);

            //@PingBack
            $PingBack('msite_' + this.parentControl.PAGE_ID + '_bs', appid);
        },

        onRank: function (evt) {
            dojo.stopEvent(evt);
            var target = evt.target;

            if (target.getAttribute('state') === 'disable')
                return;

            var taskid = taskId(),
                appid = getAttr('appid', target, 2),
                appname = getAttr('appname', target, 2),
                appicon = getAttr('appicon', target, 2);

            target.setAttribute('taskid', taskid);
            window.external.InstallApp(taskid, parseInt(appid), appname, url.replace(/@/g, appid),
                appicon, evt.clientX, evt.clientY, document);

            //@PingBack
            $PingBack('msite_' + this.parentControl.PAGE_ID + '_bs', appid);
        },

        off: function (node) {

        }
    });

    global.UpdateDownloadProgress = function (appid, json) {
        var state = JSON.parse(json).state;
        switch (state) {
            case 'connecting':
                dojo.query('li[appid=' + appid + ']').forEach(function(node, index, list){
                    var btn = dojo.query('span.installbtn', node)[0];
                    dojo.removeClass(btn, 'installbtnhover installbtnpress');
                    dojo.addClass(btn, 'installbtndisable');
                    btn.innerHTML = '安装中';
                    btn.setAttribute('state', 'disable');
                });
                break;
            case 'download_failed':
            case 'install_failed':
            case 'install_finished':
            case 'download_deleted':
                dojo.query('li[appid=' + appid + ']').forEach(function(node, index, list){
                    var btn = dojo.query('span.installbtn', node)[0];
                    dojo.removeClass(btn, 'installbtndisable');
                    btn.innerHTML = '安装';
                    btn.setAttribute('state', '');
                });
                break;
        }
    };
})(this);
