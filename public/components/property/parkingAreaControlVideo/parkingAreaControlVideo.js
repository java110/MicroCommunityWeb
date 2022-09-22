/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            parkingAreaControlVideoInfo: {
                boxId: '',
                inMachineId: '',
                outMachineId: '',
                inMachines: [],
                outMachines: [],
                inMachineInfo:{
                    carNum:'',
                    inOutTime:'',
                    open:'',
                    openMsg:''
                },
                outMachineInfo:{
                    carNum:'',
                    inOutTime:'',
                    open:'',
                    openMsg:''
                }
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('parkingAreaControlVideo', 'notify', function(param) {
                if (param.hasOwnProperty('boxId')) {
                    $that.parkingAreaControlVideoInfo.boxId = param.boxId;
                    $that._listMachines();
                }
            });

            vc.on('parkingAreaControlVideo', 'carIn', function(param) {
                vc.copyObject(param,$that.parkingAreaControlVideoInfo.inMachineInfo);
            });

            vc.on('parkingAreaControlVideo', 'carOut', function(param) {
                vc.copyObject(param,$that.parkingAreaControlVideoInfo.outMachineInfo);
            });
        },
        methods: {
            _listMachines: function() {
                let param = {
                        params: {
                            locationObjId: $that.parkingAreaControlVideoInfo.boxId,
                            page: 1,
                            row: 100,
                            machineTypeCd: '9996',
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function(json, res) {
                        let _machineManageInfo = JSON.parse(json);
                        let _machines = _machineManageInfo.machines;
                        $that.parkingAreaControlVideoInfo.inMachines = [];
                        $that.parkingAreaControlVideoInfo.outMachines = [];
                        _machines.forEach(item => {
                            if (item.direction == '3306') {
                                $that.parkingAreaControlVideoInfo.inMachines.push(item);
                            } else {
                                $that.parkingAreaControlVideoInfo.outMachines.push(item);
                            }
                        });

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _swatchVedio: function() {
                //创建一个socket实例
                let wsUrl = "";
                let _enterMachineId = $that.parkingAreaControlVideoInfo.inMachineId;
                vc.emit('parkingAreaControl', 'notify', {
                    inMachineId: _enterMachineId
                });
                $that.parkingAreaControlVideoInfo.inMachines.forEach((item) => {
                    if (item.machineId == _enterMachineId) {
                        wsUrl = item.machineIp;
                        if (item.machineVersion.indexOf('300') > -1) {
                            wsUrl += "/ws.flv"
                        } else {
                            wsUrl += "/ws"
                        }
                    }
                });

                wsUrl = wsUrl.replace(':8131', ':9080');
                let _protocol = window.location.protocol;
                // if (_protocol.startsWith('https')) {
                //     wsUrl =
                //         "wss://" + wsUrl;
                // } else {
                wsUrl =
                    "ws://" + wsUrl;
                // }
                let image = document.getElementById("receiver1");
                if (wsUrl.endsWith(".flv")) {
                    image = document.getElementById("receiver1Div");
                    let jessibuca = new Jessibuca({
                        container: image,
                        videoBuffer: 0.2,
                        isResize: false,
                    });
                    jessibuca.onLoad = function() {
                        this.play(wsUrl);
                    };
                    return;
                }
                let receiver_socket = new WebSocket(wsUrl);
                // 监听消息
                receiver_socket.onmessage = function(data) {
                    let reader = new FileReader();
                    reader.onload = function(evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            let url = evt.target.result;
                            image.src = "data:image/png;" + url;
                        }
                    };
                    reader.readAsDataURL(data.data);
                };
            },
            _swatchOutVedio: function() {
                //创建一个socket实例
                let wsUrl = "";
                let _outMachineId = $that.parkingAreaControlVideoInfo.outMachineId;
                vc.emit('parkingAreaControl', 'notify', {
                    outMachineId: _outMachineId
                });
                vc.emit('parkingAreaControlFee', 'changeMachine', {
                    machineId: _outMachineId,
                    boxId: $that.parkingAreaControlVideoInfo.boxId
                });

                vc.emit('parkingAreaControlInCar', 'changeMachine', {
                    machineId: _outMachineId,
                    boxId: $that.parkingAreaControlVideoInfo.boxId
                });

                vc.emit('parkingAreaControlCarInouts', 'changeMachine', {
                    machineId: _outMachineId,
                    boxId: $that.parkingAreaControlVideoInfo.boxId
                });

                

                let paId = "";
                $that.parkingAreaControlVideoInfo.outMachines.forEach((item) => {
                    if (item.machineId == _outMachineId) {
                        wsUrl = item.machineIp;
                        paId = item.locationObjId;
                        if (item.machineVersion.indexOf('300') > -1) {
                            wsUrl += "/ws.flv"
                        } else {
                            wsUrl += "/ws"
                        }
                    }
                });
                wsUrl = wsUrl.replace(':8131', ':9080')
                let _protocol = window.location.protocol;
                if (_protocol.startsWith('https')) {
                    wsUrl =
                        "wss://" + wsUrl;
                } else {
                    wsUrl =
                        "ws://" + wsUrl;
                }

                let image = document.getElementById("receiver2");
                if (wsUrl.endsWith(".flv")) {
                    image = document.getElementById("receiver2Div");
                    let jessibuca = new Jessibuca({
                        container: image,
                        videoBuffer: 0.2,
                        isResize: false,
                    });
                    jessibuca.onLoad = function() {
                        this.play(wsUrl);
                    };
                    return;
                }
                let receiver_socket = new WebSocket(wsUrl);
                // 监听消息
                receiver_socket.onmessage = function(data) {
                    //image.src = 'data:image/png;' + data.data;
                    let reader = new FileReader();
                    reader.onload = function(evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            let url = evt.target.result;
                            image.src = "data:image/png;" + url;
                        }
                    };
                    reader.readAsDataURL(data.data);
                };
            },
            _openDoor: function(_inOut) {
                let _machines = [];
                let _machineId = "";
                if (_inOut == 'in') {
                    _machines = $that.parkingAreaControlVideoInfo.inMachines;
                    _machineId = $that.parkingAreaControlVideoInfo.inMachineId;
                } else {
                    _machines = $that.parkingAreaControlVideoInfo.outMachines;
                    _machineId = $that.parkingAreaControlVideoInfo.outMachineId;
                }

                if (_machines.length == 0) {
                    vc.toast('请先选择设备');
                    return;
                }
                let _machineCode = '';
                _machines.forEach(item => {
                    if (item.machineId == _machineId) {
                        _machineCode = item.machineCode;
                    }
                })
                let _data = {
                    "machineCode": _machineCode,
                    "stateName": "开门",
                    "state": "1500",
                    "url": "/machine/openDoor",
                    "userRole": "staff",
                    "communityId": vc.getCurrentCommunity().communityId
                };
                vc.http.apiPost('/machine/openDoor',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast('已请求设备');
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            _closeDoor: function(_inOut) {
                let _machines = [];
                let _machineId = "";
                if (_inOut == 'in') {
                    _machines = $that.parkingAreaControlVideoInfo.inMachines;
                    _machineId = $that.parkingAreaControlVideoInfo.inMachineId;
                } else {
                    _machines = $that.parkingAreaControlVideoInfo.outMachines;
                    _machineId = $that.parkingAreaControlVideoInfo.outMachineId;
                }

                if (_machines.length == 0) {
                    vc.toast('请先选择设备');
                    return;
                }
                let _machineCode = '';
                _machines.forEach(item => {
                    if (item.machineId == _machineId) {
                        _machineCode = item.machineCode;
                    }
                })
                let _data = {
                    "machineCode": _machineCode,
                    "stateName": "关门",
                    "state": "1500",
                    "url": "/machine/closeDoor",
                    "userRole": "staff",
                    "communityId": vc.getCurrentCommunity().communityId
                };
                vc.http.apiPost('/machine/closeDoor',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            vc.toast('已请求设备');
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(json);
                    });
            },
            customCarIn: function(_type) {
                let _machineId = $that.parkingAreaControlVideoInfo.inMachineId;
                if (_type != '1101') {
                    _machineId = $that.parkingAreaControlVideoInfo.outMachineId;
                }
                if (!_machineId) {
                    vc.toast('请选择摄像头');
                    return;
                }
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: _type,
                    machineId: _machineId,
                    boxId: $that.parkingAreaControlVideoInfo.boxId
                })
            },
            unlicensedCarIn: function(_type) {
                let _machineId = $that.parkingAreaControlVideoInfo.inMachineId;

                if (!_machineId) {
                    vc.toast('请选择入场摄像头');
                    return;
                }
                vc.emit('unlicensedCarMachineQrCode', 'open', {
                    type: '1101',
                    machineId: _machineId
                })
            },
            _outPayFeeQrCode: function() {
                let _machineId = $that.parkingAreaControlVideoInfo.outMachineId;

                if (!_machineId) {
                    vc.toast('请选择出场摄像头');
                    return;
                }

                vc.emit('barrierGateMachineQrCode', 'openQrCodeModal', {
                    machineId: _machineId,
                    locationObjId: $that.parkingAreaControlVideoInfo.boxId
                });
            }


        }
    });
})(window.vc);