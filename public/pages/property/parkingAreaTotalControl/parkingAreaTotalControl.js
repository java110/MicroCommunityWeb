/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            parkingAreaTotalControlInfo: {
                _currentTab: 'parkingAreaTotalControlVideo',
                paId: '',
                inMachineId: '',
                outMachineId: ''
            }
        },
        _initMethod: function() {
            $that.parkingAreaTotalControlInfo.paId = vc.getParam('paId');
           
            $that._initParkingAreaWs();
            vc.emit('parkingAreaTotalControlVideo', 'notify', {
                paId: $that.parkingAreaTotalControlInfo.paId
            });
        },
        _initEvent: function() {
            vc.on('parkingAreaTotalControl', 'notify', function(_param) {
                vc.copyObject(_param, $that.parkingAreaTotalControlInfo);
            })
        },
        methods: {
            changeTab: function(_tab) {
                $that.parkingAreaTotalControlInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    paId: $that.parkingAreaTotalControlInfo.paId
                })
            },
            _initParkingAreaWs: function() {
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
                                $that._initParkingAreaWs();
                            }
                        }, this.timeout)
                    }
                }
                let _protocol = window.location.protocol;
                let url = '';
                if (_protocol.startsWith('https')) {
                    url =
                        "wss://" + window.location.host + "/ws/parkingArea/" +
                        $that.parkingAreaTotalControlInfo.paId + "/" + clientId;
                } else {
                    url =
                        "ws://" + window.location.host + "/ws/parkingArea/" +
                        $that.parkingAreaTotalControlInfo.paId + "/" + clientId;
                    // url =
                    //     "ws://demo.homecommunity.cn:8008/ws/parkingArea/" +
                    //     $that.parkingAreaTotalControlInfo.boxId + "/" + clientId;
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
                    this.$notify.error({
                        title: "错误",
                        message: "连接失败，请检查网络"
                    });
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
                    vc.emit('parkingAreaTotalControlCarInout', 'notify', {
                        data: _data,
                        parkingAreaTotalControl: $that.parkingAreaTotalControlInfo
                    });
                    vc.emit('parkingAreaTotalControlFee', 'notify', _data);
                };
                //连接关闭的回调方法
                websocket.onclose = function() {
                    console.log("初始化失败");
                    //$that._initParkingAreaWs();
                    this.$notify.error({
                        title: "错误",
                        message: "连接关闭，请刷新浏览器"
                    });
                };
                //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                window.onbeforeunload = function() {
                    websocket.close();
                };
            }
        }
    });
})(window.vc);