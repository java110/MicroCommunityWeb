/**
 导航栏
 **/
(function(vc) {
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    var vm = new Vue({
        el: '#nav',
        data: {
            nav: {
                moreNoticeUrl: '/admin.html#/pages/common/noticeManage',
                notices: [],
                total: 0,
                _currentCommunity: '',
                communityInfos: [],
                storeTypeCd: '',
                catalogs: [],
            },
            logo: '',
            userName: ""
        },
        mounted: function() {
            this._initSysInfo();
            this.getNavCommunity(1, 3);
            this.getNavData();
            this._getMenuCatalog();
            // 定义事件名为'build'.
        },
        methods: {
            _initSysInfo: function() {
                var sysInfo = vc.getData("_sysInfo");
                if (sysInfo == null) {
                    this.logo = "HC";
                    return;
                }
                this.logo = sysInfo.logo;
            },
            getNavData: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 3,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('nav',
                    'getNavData',
                    param,
                    function(json) {
                        var _noticeObj = JSON.parse(json);
                        vm.nav.notices = _noticeObj.msgs;
                        vm.nav.total = _noticeObj.total;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            logout: function() {
                var param = {
                    msg: 123
                };
                //发送get请求
                vc.http.post('nav',
                    'logout',
                    JSON.stringify(param), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        if (res.status == 200) {
                            vc.jumpToPage("/user.html#/pages/frame/login");
                            return;
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            getUserInfo: function() {
                //获取用户名
                let param = {
                    msg: '123',
                };
                //发送get请求
                vc.http.get('nav',
                    'getUserInfo',
                    param,
                    function(json, res) {
                        if (res.status == 200) {
                            var tmpUserInfo = JSON.parse(json);
                            vm.userName = tmpUserInfo.name;
                            vm.nav.storeTypeCd = tmpUserInfo.storeTypeCd;
                            //加个水印
                            if (tmpUserInfo.watermark == 'true') {
                                vc.watermark({ watermark_txt: vc.i18n('systemName') + ":" + tmpUserInfo.name });
                            }
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            getNavCommunity: function(_page, _row) {
                var _tmpCurrentCommunity = vc.getCurrentCommunity();
                //浏览器缓存中能获取到
                if (_tmpCurrentCommunity != null && _tmpCurrentCommunity != undefined) {
                    this.nav._currentCommunity = _tmpCurrentCommunity;
                    this.nav.communityInfos = vc.getCommunitys();
                    return;
                }
                //说明缓存中没有数据
                //发送get请求
                /**
                 [{community:"123123",name:"测试1小区"},{community:"223123",name:"测试2小区"}]
                 **/
                var param = {
                    params: {
                        _uid: '123mlkdinkldldijdhuudjdjkkd',
                        page: _page,
                        row: _row
                    }
                };
                vc.http.get('nav',
                    'getCommunitys',
                    param,
                    function(json, res) {
                        if (res.status == 200) {
                            vm.nav.communityInfos = JSON.parse(json).communitys;
                            if (vm.nav.communityInfos == null || vm.nav.communityInfos.length == 0) {
                                vm.nav._currentCommunity = {
                                    name: "还没有入驻小区"
                                };
                                return;
                            }
                            vm.nav._currentCommunity = vm.nav.communityInfos[0];
                            vc.setCurrentCommunity(vm.nav._currentCommunity);
                            vc.setCommunitys(vm.nav.communityInfos);
                            //对首页做特殊处理，因为首页在加载数据时还没有小区信息 会报错
                            if (vm.nav.communityInfos != null && vm.nav.communityInfos.length > 0) {
                                vc.emit("indexContext", "_queryIndexContextData", {});
                                vc.emit("indexArrears", "_listArrearsData", {});
                            }
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            changeCommunity: function(_community) {
                vc.setCurrentCommunity(_community);
                vm.nav._currentCommunity = _community;
                //中心加载当前页
                location.reload();
            },
            _noticeDetail: function(_msg) {
                //console.log(_notice.noticeId);
                //vc.jumpToPage("/admin.html#/noticeDetail?noticeId="+_notice.noticeId);
                //标记为消息已读
                vc.http.post('nav',
                    'readMsg',
                    JSON.stringify(_msg),
                    function(json, res) {
                        if (res.status == 200) {
                            vc.jumpToPage(_msg.url);
                        }
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },

            _getMenuCatalog: function() {
                let _param = {
                    params: {
                        page: 1,
                        row: 10,
                        isShow: 'Y',
                    }
                }
                vc.http.apiGet('/menu.listCatalog',
                    _param,
                    function(json, res) {
                        let _listCatalogs = JSON.parse(json);
                        if (_listCatalogs.code != 0) {
                            return;
                        }
                        vm.nav.catalogs = _listCatalogs.data;
                        vm._emitMsg(_listCatalogs.data[0])
                    },
                    function(e) {
                        console.log('请求失败处理', e);
                    }
                );
            },
            _emitMsg: function(_param) {
                vm._settingActiveCatalog(_param);
                let event = new CustomEvent('loadMenu', {
                    "detail": _param
                });
                document.body.dispatchEvent(event);
            },
            _doMenu: function() {
                let body = document.getElementsByTagName("body")[0];
                let className = body.className;
                if (className.indexOf("mini-navbar") != -1) {
                    body.className = className.replace(/mini-navbar/g, "");
                    return;
                }
                body.className = className + " mini-navbar";
            },
            _chooseMoreCommunity: function() {
                vc.emit('chooseEnterCommunity', 'openChooseEnterCommunityModel', {});
            },
            _viewDocument: function() {
                vc.emit('document', 'openDocument', {});
            },
            _settingActiveCatalog: function(_catalog) {
                let _catalogs = this.nav.catalogs;
                _catalogs.forEach(item => {
                    item.active = '0'
                    if (item.caId == _catalog.caId) {
                        item.active = '1';
                    }
                });
                //this.nav.catalogs = _catalogs;
                this.$forceUpdate();
            },
            _changeMenuCatalog: function(_catalog) {
                if (_catalog.url != '#') {
                    vm._settingActiveCatalog(_catalog);
                    vc.jumpToPage(_catalog.url);
                    return;
                }
                vm._emitMsg(_catalog);
            },
        }
    });
    vm.getUserInfo();

    function newWebSocket() {
        let clientId = vc.uuid();
        let heartCheck = {
                timeout: 30000, // 9分钟发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
                serverTimeoutObj: null,
                pingTime: new Date().getTime(),
                reset: function() {
                    clearTimeout(this.serverTimeoutObj);
                    return this;
                },
                start: function() {
                    let self = this;
                    this.serverTimeoutObj = setInterval(function() {
                        if (websocket.readyState == 1) {
                            console.log("连接状态，发送消息保持连接");
                            let _pingTime = new Date().getTime();
                            //保护，以防 异常
                            if (_pingTime - self.pingTime < 15 * 1000) {
                                return;
                            }
                            websocket.send("{'cmd':'ping'}");
                            self.pingTime = _pingTime;

                            heartCheck.reset().start(); // 如果获取到消息，说明连接是正常的，重置心跳检测
                        } else {
                            console.log("断开状态，尝试重连");
                            newWebSocket();
                        }
                    }, this.timeout)
                }
            }
            //建立websocket 消息连接
        let user = vc.getData('/nav/getUserInfo');
        if (!user) {
            return;
        }
        let _userId = user.userId;
        let _protocol = window.location.protocol;
        let url = '';
        if (_protocol.startsWith('https')) {
            url =
                "wss://" + window.location.host + "/ws/message/" +
                _userId + "/" + clientId;
        } else {
            url =
                "ws://" + window.location.host + "/ws/message/" +
                _userId + "/" + clientId;
            // url =
            //     "ws://demo.homecommunity.cn/ws/message/" +
            //     _userId;
        }
        if ("WebSocket" in window) {
            websocket = new WebSocket(url);
        } else if ("MozWebSocket" in window) {
            websocket = new MozWebSocket(url);
        } else {
            websocket = new SockJS(url);
        }
        //连接发生错误的回调方法
        websocket.onerror = function(_err) {
            console.log("初始化失败", _err);
            // this.$notify.error({
            //     title: "错误",
            //     message: "连接失败，请检查网络"
            // });
        };
        //连接成功建立的回调方法
        websocket.onopen = function() {
            heartCheck.reset().start();
            console.log("ws初始化成功");
        };
        //接收到消息的回调方法
        websocket.onmessage = function(event) {
            heartCheck.reset().start();
            console.log("event", event);
            let _data = event.data;
            try {
                _data = JSON.parse(_data);
            } catch (err) {
                return;
            }
            if (_data.code == 200) {
                toastr.info(_data.msg);
            } else {
                toastr.error(_data.msg);
            }
        };
        //连接关闭的回调方法
        websocket.onclose = function() {
            console.log("初始化失败");
            //newWebSocket();
            // this.$notify.error({
            //     title: "错误",
            //     message: "连接关闭，请刷新浏览器"
            // });
        };
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            websocket.close();
        };
    }

    newWebSocket();
})(window.vc);