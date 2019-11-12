(function (window) {

    var jsVersion = 1;

    var STATE = {
        //初始状态
        IDLE: 1,
        //此状态表示与native层之间的交互完成
        //init超时，认为native层是不支持js sdk的，进入兼容模式
        READY: 2,
        //error状态，可能是页面调用config验证失败, js sdk处于此状态时只有针对页面的所有接口都不可调用
        ERROR: 3
    };

    //sdk错误列表
    var ERROR = {
        //接口未找到
        METHOD_NOT_FOUND: 1,
        //接口未授权
        PERMISSION_DENY: 2,
        //返回数据格式错误
        RSPDATA_FORMAT_ERR: 3,
        //调用超时
        CALL_NATIVE_TIMEOUT: 4,

        REQ_PARAM_INVALID: 5,

        NATIVE_CODE_EXCEPTION: 100,

        USER_NOT_LOGIN: 101,

        USER_LOGIN: 102
    };

    //调用超时，由于与native端的交互是异步的，所有的调用都加上一个5s超时, 用于init接口
    var TIMEOUT = 3000;

    //缓存调用事件， eventid --> callback
    var eventCacheMap = {};

    //native端代码版本
    var nativeVersion;

    //原生层是否支持js sdk，如果不支持，sdk以兼容模式运行
    var isNativeSupportJsSdk = false;

    //js sdk 状态
    var state = STATE.IDLE;

    //平台
    var platform = getPlatform(navigator.userAgent);

    function getPlatform(uagent) {
        if (uagent.match(/iPhone/i)) return 'iph';
        if (uagent.match(/iPod/i)) return 'iph';
        if (uagent.match(/iPad/i)) return 'ipd';
        return 'aph';
    }

    /**
	 * [onPreCallFunc 调用native方法之前执行此方法]
	 * @param  {[type]} funcName [description]
	 * @param  {[type]} paramObj [description]
	 * @return {[type]}          [description]
	 */
    function onPreCallFunc(funcName, paramObj) {
        if (!paramObj) {
            return;
        }
        if (funcName == 'openNativePage') {
            if (paramObj.pageUrl) {
                paramObj.pageUrl = convertJumpLink(paramObj.pageUrl);
            }
        }
    }

    /**
	 * [callNativeFunc 调用原生业务函数入口]
	 * @param  {[String]} funcName [方法名]
	 * @param  {[Object]} paramObj [参数]
	 * @return {[void]}          [void]
	 */
    function callNativeFunc(funcName, paramObj) {
        if ((window.ppexternal && ppexternal.callFunc && platform == 'aph') || platform == 'ipd' || platform == 'iph') {
            var eventId = UUID();
            if (!paramObj) {
                paramObj = {};
            }
            var cb = {
                success: paramObj.success,
                error: paramObj.error,
                cancel: paramObj.cancel,
                instance: paramObj
            };
            //处理调用参数，删除其中的函数属性，方便序列化向native传递
            for (var i in paramObj) {
                if (paramObj[i] instanceof Function) {
                    delete paramObj[i];
                }
            }
            //把调用的信息存的eventId索引的map中
            eventCacheMap[eventId] = cb;
            //如果接口设置了超时参数
            if (paramObj.timeout && paramObj.timeout instanceof Number) {
                //设置调用超时，并回调error事件
                setTimeout(function () {
                    var cbContext = eventCacheMap[eventId];
                    if (!cbContext) {
                        return;
                    }
                    //清理map
                    delete eventCacheMap[eventId];
                    //调用错误超时
                    if (cbContext.error) {
                        cbContext.error.call(cbContext.instance, ERROR.CALL_NATIVE_TIMEOUT, "调用超时");
                    }
                }, paramObj.timeout);
            }
            if (platform == 'aph') {
                ppexternal.callFunc(eventId, funcName, JSON.stringify(paramObj));
            } else {
                sendUrl('http://jssdk_callFunc?eventId=' + eventId + '&funcName=' + encodeURIComponent(funcName) + '&params=' + encodeURIComponent(JSON.stringify(paramObj)));
            }
        }
    }
    /**
	 * [UUID 生成uuid]
	 * @return {String} [uuid]
	 */
    function UUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
        }
        return s4() + s4() + '_' + s4() + '_' + s4() + '_' +
			s4() + '_' + s4() + s4() + s4();
    }

    //js sdk 调用入口
    window.ppsdk = {

        __readyFunc: null,

        __errorFunc: null,

        /**
		 * [_init 原生代码调用初始化js sdk, 用于生成业务函数,并传入native相关配置]
		 * @param  {[Number]} nativeCodeVersion [native web组件代码版本]
		 * @param  {[String]} [plt] [平台名称 aph apd iph ipd]
		 * @param  {[Array]} funcArr           [需要注入的方法名数组]
		 * @return {[void]}                   [void]
		 */
        _init: function (nativeCodeVersion, plt, funcArr) {
            if (state == STATE.IDLE) {
                platform = plt;
                try {
                    var array = JSON.parse(funcArr);
                } catch (e) {
                    state = STATE.READY;
                    isNativeSupportJsSdk = false;
                    injectCompatibilityFunc();
                    if (ppsdk.__readyFunc) {
                        ppsdk.__readyFunc();
                    }
                    return;
                }
                for (var i = 0; i < array.length; i++) {
                    var funcName = array[i];
                    ppsdk[funcName] = (function (name) {
                        return (function (paramObj) {
                            if (state == STATE.READY) {
                                //做一些平台相关的处理，包括针对平台
                                onPreCallFunc(name, paramObj);
                                callNativeFunc(name, paramObj);
                            } else {
                                paramObj.error(ERROR.PERMISSION_DENY, "接口未授权");
                            }
                        });
                    })(funcName);
                }
                state = STATE.READY;
                isNativeSupportJsSdk = true;
                if (ppsdk.__readyFunc) {
                    ppsdk.__readyFunc();
                }
            }
        },

        /**
		 * [_emit 原生代码回调结果]
		 * @param  {[String]} cbType  [回调类型，success error cancel]
		 * @param  {[String]} eventId [调用事件id, 唯一对应了一次调用]
		 * @param  {[Object]} rspData [回调结果]
		 * @return {[void]}         [void]
		 */
        _emit: function (cbType, eventId, rspData) {
            var cb = eventCacheMap[eventId];
            if (cb != null) {
                delete eventCacheMap[eventId];
                if (cb[cbType]) {
                    try {
                        var rsp = JSON.parse(rspData);
                    } catch (e) {
                        if (cb.error && cbType == 'success') {
                            cb.error.call(cb.instance, ERROR.RSPDATA_FORMAT_ERR, "返回数据格式错误");
                            return;
                        }
                        rsp = {};
                    }
                    if (cbType == "error") {
                        cb.error.call(cb.instance, rsp.errorCode, rsp.errorMsg);
                    } else {
                        cb[cbType].call(cb.instance, rsp);
                    }
                }
            }
        },

        /**
		 * [ready 监听js sdk ready]
		 * @param  {Function} cb [回调]
		 * @return {[void]}      [void]
		 */
        ready: function (cb) {
            ppsdk.__readyFunc = cb;
            if (state == STATE.READY) {
                cb();
            }
        },

        error: function (cb) {
            ppsdk.__errorFunc = cb;
        },

        /**
		 * [config 用于页面调用来配置和初始化js sdk]
		 * @param  {[Object]} paramObj [初始化参数]
		 * @return {[void]}          [void]
		 */
        config: function (paramObj) {
            //config调用的时候表示js sdk已经加载完成，首先通知native 注入网络模块代码
            if ((window.ppexternal && ppexternal.onJsSdkLoaded && platform == 'aph') || platform == 'ipd' || platform == 'iph') {
                if (platform == 'aph') {
                    ppexternal.onJsSdkLoaded(jsVersion);
                } else {
                    sendUrl('http://jssdk_onJsSdkLoaded?jsVersion=' + jsVersion);
                }
                setTimeout(function () {
                    if (state == STATE.IDLE) {
                        state = STATE.READY;
                        isNativeSupportJsSdk = false;
                        injectCompatibilityFunc();
                        //config的超时或者native代码不支持依旧返回ready
                        //在这种情况下js sdk代码会以一种兼容模式运行
                        if (ppsdk.__readyFunc) {
                            ppsdk.__readyFunc();
                        }
                    }
                }, TIMEOUT);
            } else {
                state = STATE.READY;
                isNativeSupportJsSdk = false;
                injectCompatibilityFunc();
                if (ppsdk.__readyFunc) {
                    ppsdk.__readyFunc();
                }
            }
        },
    };

    function parseUri(url) {
        //url的正则，黑科技勿动
        var urlreg = /^([^:]+):\/\/([0-9a-zA-Z_\.]+)(?::(\d+))?(\/[0-9a-zA-Z_\/]*)?(?:\?((?:[^=&#\?]+=[^&#\?]*)?(?:(?:&[^=&#\?]+=[^&#\?]*)*)))?(?:#((?:[^=&#\?]+=[^&#\?]*)?(?:(?:&[^=&#\?]+=[^&#\?]*)*)))?$/;
        var parser = urlreg.exec(url);
        if (parser == null) {
            parser = [];
        }
        var paramMap = {};
        if (parser[5]) {
            var query = parser[5];
            var reg = /([^=&]+)=([^&]*)/g;
            var rs;
            while ((rs = reg.exec(query)) !== null) {
                if (rs && rs.length == 3 && rs[1]) {
                    paramMap[rs[1]] = decodeURIComponent(rs[2] ? rs[2] : "");
                }
            }
        }
        console.info(parser);
        return {
            url: url,
            getSchema: function () {
                return parser[1] || "";
            },

            getHost: function () {
                return parser[2] || "";
            },

            getPort: function () {
                return parser[3] || 80;
            },

            getPath: function () {
                return parser[4] || "";
            },

            getQueryStr: function () {
                return parser[5] || "";
            },

            getQueryParameter: function (key) {
                return paramMap[key];
            }
        };
    }

    function injectCompatibilityFunc() {
        for (var funcName in compatibilityHandler) {
            ppsdk[funcName] = compatibilityHandler[funcName];
        }
        if (!platform) {
            platform = getPlatform(navigator.userAgent);
        }
    }

    function sendUrl(url) {
        var iframe = document.createElement("IFRAME");
        iframe.setAttribute("src", url);
        document.documentElement.appendChild(iframe);
        iframe.parentNode.removeChild(iframe);
        iframe = null;
    }

    //将新的播放链接转换为老的播放链接，以兼容老的客户端
    function convert2OldPlaylink(newplaylink) {
        var uri = parseUri(newplaylink);
        if (uri.getSchema() == 'pptv') {
            var newurl = "";
            var type = uri.getQueryParameter('type');
            var sid = uri.getQueryParameter('sid');
            var vid = uri.getQueryParameter('vid');
            if (type == 'ppvod') {
                newurl += "vod://";
                var channelId = (sid ? sid : vid);
                if (channelId) {
                    newurl += channelId;
                    if (vid) {
                        newurl += "?apppid=" + vid;
                    }
                    return newurl;
                }
            } else if (type == 'pplive2') {
                newurl += "live://";
                var channelId = (sid ? sid : vid);
                if (channelId) {
                    newurl += channelId;
                    return newurl;
                }
            }
            return newurl;
        }
    }

    function convertJumpLink(link) {
        var uri = parseUri(link);
        var newUrl = uri.getSchema() + "://" + platform + ".pptv.com" + uri.getPath();
        if (uri.getQueryStr()) {
            newUrl += "?" + uri.getQueryStr();
        }
        return newUrl;
    }

    function convertUserInfo(userInfo) {
        var userInfo = userInfo.content;
        if (Object.keys(userInfo).length == 0) {
            return userInfo;
        }
        //做字段兼容，使得新版客户端，老版客户端，安卓 iphone返回的字段一致
        if (userInfo.userprofile) {//非第三方登录 或者是android的第三方登录
            userInfo.isLogin = true;
            userInfo.userName = userInfo.userprofile.username;
            userInfo.nickname = userInfo.userprofile.nickname;
        } else {//ios第三方登录
            var newuserInfo = {};
            newuserInfo.isLogin = true;
            newuserInfo.userName = decodeURIComponent(userInfo.username);
            newuserInfo.nickname = decodeURIComponent(userInfo.nickname);
            newuserInfo.PPKey = userInfo.PPKey;
            newuserInfo.PPName = userInfo.PPName;
            newuserInfo.UDI = userInfo.UDI;
            newuserInfo.blogbound = [];
            newuserInfo.token = userInfo.token;
            var newuserprofile = {};
            newuserprofile.city = decodeURIComponent(userInfo.city);
            newuserprofile.createtime = decodeURIComponent(userInfo.createTime);
            newuserprofile.facepic = decodeURIComponent(userInfo.facePic);
            newuserprofile.birthday = decodeURIComponent(userInfo.birthday.replace(/\+/g, '%20'));
            newuserprofile.username = decodeURIComponent(userInfo.username);
            newuserprofile.level = userInfo.level;
            newuserprofile.status = userInfo.status;
            newuserprofile.nickname = decodeURIComponent(userInfo.nickname);
            newuserprofile.province = decodeURIComponent(userInfo.province);
            newuserprofile.gender = userInfo.gender;
            newuserprofile.experience = userInfo.experience;
            newuserprofile.credit = userInfo.credit;
            newuserprofile.gradename = decodeURIComponent(userInfo.gradeName);
            newuserInfo.userprofile = newuserprofile;
            userInfo = newuserInfo;
        }
        return userInfo;
    }

    //兼容类,针对不支持js sdk的老版客户端进行兼容，保证基于js sdk实现的专题通过
    //引用此js文件可以在老版客户端上实现兼容功能
    var compatibilityHandler = {

        getDeviceInfo: function (paramObj) {
            if (!paramObj || !paramObj.success) {
                return;
            }
            if (window.external && external.currentDeviceInfo) {
                var cbName = 'ppsdk_cb_' + UUID();
                window[cbName] = function (deviceInfostr) {
                    try {
                        var deviceInfo = JSON.parse(deviceInfostr);
                        if (deviceInfo.content) {
                            var code = deviceInfo.code || parseInt(deviceInfo.content.code);
                            var message = deviceInfo.message || deviceInfo.content.message;
                        } else {
                            var code = deviceInfo.code || -1;
                            var message = deviceInfo.message || "";
                        }
                        if (code === 1) {
                            deviceInfo = deviceInfo.content;
                            if (deviceInfo) {
                                deviceInfo.uuid = deviceInfo.udid || "";
                                deviceInfo.osver = deviceInfo.osv || "";
                                delete deviceInfo.osv;
                                deviceInfo.o = deviceInfo.tunnel || "";
                                delete deviceInfo.tunnel;
                                deviceInfo.appver = deviceInfo.appv || "";
                                delete deviceInfo.appv;
                                deviceInfo.appplt = deviceInfo.ostype || "";
                                delete deviceInfo.appplt;
                                delete deviceInfo.code;
                                delete deviceInfo.message;
                                paramObj.success(deviceInfo);
                            } else {
                                paramObj.success({});
                            }
                        } else {
                            paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, message);
                        }
                    } catch (e) {
                        if (paramObj.error) {
                            paramObj.error(ERROR.RSPDATA_FORMAT_ERR, 'json格式错误');
                        }
                    }
                    //防止内存泄露
                    delete window[cbName];
                }
                external.currentDeviceInfo(cbName);
            } else {
                paramObj.error && paramObj.error(ERROR.METHOD_NOT_FOUND, "方法不存在");
            }
        },

        getUserInfo: function (paramObj) {
            if (!paramObj || !paramObj.success) {
                return;
            }
            if (window.external && external.currentUserInfo) {
                var cbName = 'ppsdk_cb_' + UUID();
                window[cbName] = function (userInfostr) {
                    try {
                        var userInfo = JSON.parse(userInfostr);
                        var code = parseInt(userInfo.code);
                        if (code === 1) {
                            userInfo = convertUserInfo(userInfo);
                            if (userInfo) {
                                paramObj.success(userInfo);
                            } else {
                                paramObj.success({});
                            }
                        } else {
                            paramObj.error && paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, userInfo.message);
                        }
                    } catch (e) {
                        if (paramObj.error) {
                            paramObj.error(ERROR.RSPDATA_FORMAT_ERR, 'json格式错误');
                        }
                    }
                    //防止内存泄露
                    delete window[cbName];
                }
                external.currentUserInfo(cbName);
            } else {
                paramObj.error && paramObj.error(ERROR.METHOD_NOT_FOUND, "方法不存在");
            }
        },

        login: function (paramObj) {
            if (!paramObj || !paramObj.success) {
                return;
            }
            var autologin = paramObj.autologin || false;
            if (window.external && (!autologin && external.userLogin) || (autologin && external.userBackLogin)) {
                var cbName = 'ppsdk_cb_' + UUID();
                window[cbName] = function (userInfostr) {
                    if (autologin && platform == 'iph') {
                        if (userInfostr == '1') {
                            paramObj.success({});
                        } else {
                            paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, "自动登录失败");
                        }
                        return;
                    }
                    try {
                        var userInfo = JSON.parse(userInfostr);
                        var code = parseInt(userInfo.code);
                        if (code === 1) {
                            userInfo = convertUserInfo(userInfo);
                            if (userInfo) {
                                paramObj.success(userInfo);
                            } else {
                                paramObj.success({});
                            }
                        } else {
                            paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, userInfo.message);
                        }
                    } catch (e) {
                        if (paramObj.error) {
                            paramObj.error(ERROR.RSPDATA_FORMAT_ERR, 'json格式错误');
                        }
                    }
                    //防止内存泄露
                    delete window[cbName];
                }
                if (autologin) {
                    external.userBackLogin(cbName);
                } else {
                    external.userLogin(cbName);
                }
            } else {
                paramObj.error && paramObj.error(ERROR.METHOD_NOT_FOUND, "方法不存在");
            }
        },

        playVideo: function (paramObj) {
            if (!paramObj) {
                return;
            }
            var playlink = paramObj.playlink;
            if (/^(vod|live):\/\//.test(playlink)) {
                sendUrl(playlink);
                paramObj.success && paramObj.success({});
                return;
            } else if (/^pptv:\/\//.test(playlink)) {
                var url = convert2OldPlaylink(playlink);
                alert(url + 'sdf' + playlink);
                if (url) {
                    sendUrl(url);
                    paramObj.success && paramObj.success({});
                    return;
                }
            }
            paramObj.error && paramObj.error(ERROR.REQ_PARAM_INVALID, "请求参数错误");
        },

        share: function (paramObj) {
            if (!paramObj) {
                paramObj = {};
            }
            if (window.external && external.socialShare) {
                var cbName = 'ppsdk_cb_' + UUID();
                window[cbName] = function (rspstr) {
                    try {
                        var data = JSON.parse(rspstr);
                        code = parseInt(data.code);
                        if (code === 1) {
                            data = data.content;
                            if (data) {
                                paramObj.success && paramObj.success(data);
                            } else {
                                paramObj.success && paramObj.success({});
                            }
                        } else {
                            paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, data.message);
                        }
                    } catch (e) {
                        if (paramObj.error) {
                            paramObj.error(ERROR.RSPDATA_FORMAT_ERR, 'json格式错误');
                        }
                    }
                    //防止内存泄露
                    delete window[cbName];
                }
                external.socialShare(JSON.stringify({
                    shareText: paramObj.shareText,
                    shareURL: paramObj.shareURL,
                    shareImageURL: paramObj.shareImageURL
                }), cbName);
            } else {
                paramObj.error && paramObj.error(ERROR.METHOD_NOT_FOUND, "方法不存在");
            }
        },

        sendSMS: function (paramObj) {
            if (!paramObj) {
                paramObj = {};
            }
            if (window.external && external.sendSMS) {
                var cbName = 'ppsdk_cb_' + UUID();
                window[cbName] = function (rspstr) {
                    if (rspstr == 1) {
                        paramObj.success && paramObj.success({});
                        return;
                    } else if (rspstr == 0) {
                        paramObj.error && paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, "发送失败");
                        return;
                    }
                    try {
                        var data = JSON.parse(rspstr);
                        var code = parseInt(data.code);
                        if (code === 1) {
                            data = data.content;
                            if (data) {
                                paramObj.success && paramObj.success(data);
                            } else {
                                paramObj.success && paramObj.success({});
                            }
                        } else {
                            paramObj.error && paramObj.error(ERROR.NATIVE_CODE_EXCEPTION, data.message);
                        }
                    } catch (e) {
                        paramObj.error && paramObj.error(ERROR.RSPDATA_FORMAT_ERR, 'json格式错误');
                    }
                    //防止内存泄露
                    delete window[cbName];
                }
                external.sendSMS(paramObj.to || "", paramObj.content || "", cbName);
            } else {
                paramObj.error && paramObj.error(ERROR.METHOD_NOT_FOUND, "方法不存在");
            }
        },

        openNativePage: function (paramObj) {
            if (!paramObj) {
                paramObj = {};
            }
            if (window.external && external.openAppPage && paramObj.pageUrl) {
                var cbName = 'ppsdk_cb_' + UUID();
                window[cbName] = function (rspstr) {
                    paramObj.success && paramObj.success({});
                    //防止内存泄露
                    delete window[cbName];
                }
                var pageurl = convertJumpLink(paramObj.pageUrl);
                external.openAppPage(pageurl, cbName);
            } else {
                paramObj.error && paramObj.error(ERROR.METHOD_NOT_FOUND, "方法不存在");
            }
        }

    };

})(window);