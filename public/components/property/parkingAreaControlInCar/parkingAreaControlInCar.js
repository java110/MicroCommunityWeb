/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlInCarInfo: {
                carIns: [],
                boxId: '',
                paId: '',
                state: '',
                carNum: '',
                startTime: '',
                endTime: '',
                updateCarNum: '',
                updateInoutId: '',
                carType: '',
                machineId: ''
            }
        },
        _initMethod: function() {
            vc.component._initParkingAreaControlInCarDateInfo();
        },
        _initEvent: function() {
            vc.on('parkingAreaControlInCar', 'switch', function(_data) {
                $that.parkingAreaControlInCarInfo.boxId = _data.boxId;
                $that.parkingAreaControlInCarInfo.paId = _data.paId;
                $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlInCar', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlInCarData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('parkingAreaControlInCar', 'changeMachine', function(_data) {
                $that.parkingAreaControlInCarInfo.machineId = _data.machineId;
            })
        },
        methods: {
            _initParkingAreaControlInCarDateInfo: function() {
                $('.inCarStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.inCarStartTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".inCarStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.parkingAreaControlInCarInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".inCarStartTime").val('');
                            vc.component.parkingAreaControlInCarInfo.startTime = "";
                        } else {
                            vc.component.parkingAreaControlInCarInfo.startTime = value;
                        }
                    });
                $('.inCarEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.inCarEndTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".inCarEndTime").val();
                        var start = Date.parse(new Date(vc.component.parkingAreaControlInCarInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".inCarEndTime").val('');
                            vc.component.parkingAreaControlInCarInfo.endTime = "";
                        } else {
                            vc.component.parkingAreaControlInCarInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control inCarStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control inCarEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _loadParkingAreaControlInCarData: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlInCarInfo.boxId,
                        carNum: $that.parkingAreaControlInCarInfo.carNum,
                        state: $that.parkingAreaControlInCarInfo.state,
                        startTime: $that.parkingAreaControlInCarInfo.startTime,
                        endTime: $that.parkingAreaControlInCarInfo.endTime,
                        carType: $that.parkingAreaControlInCarInfo.carType,
                        paId: $that.parkingAreaControlInCarInfo.paId,
                    }
                };
                param.params.carNum = param.params.carNum.trim();
                //发送get请求
                vc.http.apiGet('/carInout.listCarInParkingAreaCmd',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlInCarInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlInCarInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlInCarInfo.carIns = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlInCar', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyParkingAreaControlInCar: function() {
                $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetParkingAreaControlInCar: function() {
                vc.component.parkingAreaControlInCarInfo.carNum = "";
                vc.component.parkingAreaControlInCarInfo.state = "";
                vc.component.parkingAreaControlInCarInfo.carType = "";
                vc.component.parkingAreaControlInCarInfo.startTime = "";
                vc.component.parkingAreaControlInCarInfo.endTime = "";
                $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewTempFeeConfigInCar: function(_feeConfigId) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        configId: _feeConfigId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listTempCarFeeConfigs', param,
                    function(json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfig = _feeConfigManageInfo.data[0];
                        let _data = {
                            "收费规则": _feeConfig.ruleName,
                            "车辆类型": _feeConfig.carTypeName,
                            "开始时间": _feeConfig.startTime,
                            "结束时间": _feeConfig.endTime,
                        };
                        _feeConfig.tempCarFeeConfigAttrs.forEach(_item => {
                            _data[_item.specName] = _item.value
                        })
                        vc.emit('viewData', 'openViewDataModal', {
                            title: _feeConfig.feeName + " 费用项",
                            data: _data
                        })
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            editCarInfoCarNum: function(_inout) {
                $that.parkingAreaControlInCarInfo.updateCarNum = _inout.carNum;
                $that.parkingAreaControlInCarInfo.updateInoutId = _inout.inoutId;
                $('#editCarInfoCarNumModel').modal('show');
            },
            _doUpdateCarInfoCarNum: function() {
                if (!$that.parkingAreaControlInCarInfo.updateCarNum) {
                    vc.toast('未包含车牌号');
                    return;
                }
                let _data = {
                    carNum: $that.parkingAreaControlInCarInfo.updateCarNum,
                    inoutId: $that.parkingAreaControlInCarInfo.updateInoutId,
                    communityId: vc.getCurrentCommunity().communityId
                }
                vc.http.apiPost(
                    '/carInout.updateCarInoutNum',
                    JSON.stringify(_data), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            $('#editCarInfoCarNumModel').modal('hide');
                            vc.toast(_data.msg);
                            $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _carInTempCarPayFee: function(carIn) {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: carIn.carNum,
                    amount: carIn.payCharge,
                    payCharge: carIn.payCharge,
                    machineId: $that.parkingAreaControlInCarInfo.machineId,
                    boxId: $that.parkingAreaControlInCarInfo.boxId,
                })
            }
        }
    });
})(window.vc);