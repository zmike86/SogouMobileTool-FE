//====================================
//  功能：配置一些全局参数
//  开发：张屾
//  最后修改日期：2012.6.5
//====================================
(function () {
    
    // 是否处理脚本错误
    var handleError = false;
    // 是否禁止F5刷新页面
    var F5 = true;
    // 保存由查询字符串传递来的数据
    var qsObj = {};
    
    window.onerror = function (event) {
        var evt = window.event || event;
        evt.returnValue = handleError;
    };

    document.oncontextmenu = function () {
        return false;
    };

    document.onselectstart = function (evt) {
        var evt = window.event || evt;
        var target = evt.srcElement || evt.target;
        if (target.nodeName === 'INPUT') {
            return true;
        }
        return false;
    };
    
    if (F5) {
        dojo.connect(document.body, 'onkeydown', function (evt) {
	        if (evt.keyCode === dojo.keys.F5 || evt.keyCode === dojo.keys.BACKSPACE) {
                if (evt.target.nodeName === 'INPUT') {
                    return;
                }
	            evt.keyCode = 0;
	            evt.preventDefault();
	        }
        }); 
    }

    function resolveQueryString () {
        var search = decodeURIComponent(top.location.search);
        if (search.indexOf('?') === 0)
            search = search.substring(1).replace(/#(.*)/g, '');
        else
            search = search.replace(/#(.*)/g, '');
        return search.split('&');
    }

    function getSnText () {
        var qss = resolveQueryString();
        var qs, k, v;
        var reg = '';
        for (var i = 0; i < qss.length; i++) {
            qs = qss[i].split('=');
            k = qs[0];
            v = qs[1];
            if (k === 'p') {
                reg = v;
                break;
            }
            qsObj[k] = v;
        } 
        return reg;
    }

    //为所有模块获取PDAInfo开通绿色通道
    window.registerPDAInfo = function (module, fn) {
	    var sntext = getSnText();
        if (!!sntext) {
            window.external.GetPDAInfoBySN(sntext, module.PDAInfor);
        }
        if (module.PDAInfor && module.PDAInfor.PDAInfo) {
            var webobj = window.external.GetSiblingDispatch('laybox').child(module.PDAInfor.PDAInfo);
            if (!!webobj) {
                fn.apply(module, [webobj, qsObj]);
            }
        }
    };

    // 发送pingback的接口
    window.$PingBack = function (url, appid) {
        var suffix = '.gif';
        try {
            window.external.SendPingBack(url + suffix, appid || '');
        } catch (ex) {}

    };
    
})();