/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlCarInoutsInfo: {
                carIns: [],
                boxId: '',
                paId: '',
                state: '',
                carNum: '',
                startTime: '',
                endTime: '',
                carType: '',
                machineId: ''
            }
        },
        _initMethod: function () {
            vc.component._initParkingAreaControlCarInoutDateInfo();
            /*vc.initDate('carInoutsStartTime', function (_value) {
                $that.parkingAreaControlCarInoutsInfo.startTime = _value;
            });
            vc.initDate('carInoutsEndTime', function (_value) {
                $that.parkingAreaControlCarInoutsInfo.endTime = _value;
            })*/
        },
        _initEvent: function () {
            vc.on('parkingAreaControlCarInouts', 'switch', function (_data) {
                $that.parkingAreaControlCarInoutsInfo.boxId = _data.boxId;
                $that.parkingAreaControlCarInoutsInfo.paId = _data.paId;
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlCarInouts', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadParkingAreaControlCarInouts(_currentPage, DEFAULT_ROWS);
                });
            vc.on('parkingAreaControlCarInouts', 'changeMachine', function (_data) {
                $that.parkingAreaControlCarInoutsInfo.machineId = _data.machineId;
            })
        },
        methods: {
            _initParkingAreaControlCarInoutDateInfo: function () {
                $('.carInoutsStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.carInoutsStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".carInoutsStartTime").val();
                        var start = Date.parse(new Date(value));
                        var end = Date.parse(new Date(vc.component.parkingAreaControlCarInoutsInfo.endTime));
                        if (start - end >= 0) {
                            vc.toast("开始时间必须小于结束时间");
                            $(".carInoutsStartTime").val('');
                            vc.component.parkingAreaControlCarInoutsInfo.startTime = "";
                        } else {
                            vc.component.parkingAreaControlCarInoutsInfo.startTime = value;
                        }
                    });
                $('.carInoutsEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    minView: "month",
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.carInoutsEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".carInoutsEndTime").val();
                        var start = Date.parse(new Date(vc.component.parkingAreaControlCarInoutsInfo.startTime));
                        var end = Date.parse(new Date(value));
                        if (start - end >= 0) {
                            vc.toast("计费终止时间必须大于计费起始时间");
                            $(".carInoutsEndTime").val('');
                            vc.component.parkingAreaControlCarInoutsInfo.endTime = "";
                        } else {
                            vc.component.parkingAreaControlCarInoutsInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control carInoutsStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control carInoutsEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            _loadParkingAreaControlCarInouts: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlCarInoutsInfo.boxId,
                        state: $that.parkingAreaControlCarInoutsInfo.state,
                        carNum: $that.parkingAreaControlCarInoutsInfo.carNum,
                        startTime: $that.parkingAreaControlCarInoutsInfo.startTime,
                        endTime: $that.parkingAreaControlCarInoutsInfo.endTime,
                        carType: $that.parkingAreaControlCarInoutsInfo.carType,
                        paId: $that.parkingAreaControlCarInoutsInfo.paId
                    }
                };
                param.params.carNum = param.params.carNum.trim();
                //发送get请求
                vc.http.apiGet('/carInoutDetail.listCarInoutDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlCarInoutsInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlCarInoutsInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlCarInoutsInfo.carIns = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlCarInouts', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyParkingAreaControlCarInouts: function () {
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetParkingAreaControlCarInouts: function () {
                vc.component.parkingAreaControlCarInoutsInfo.carNum = "";
                vc.component.parkingAreaControlCarInoutsInfo.state = "";
                vc.component.parkingAreaControlCarInoutsInfo.carType = "";
                vc.component.parkingAreaControlCarInoutsInfo.startTime = "";
                vc.component.parkingAreaControlCarInoutsInfo.endTime = "";
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewTempFeeConfigInOutCar: function (_feeConfigId) {
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
                    function (json, res) {
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
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _carInoutTempCarPayFee: function (carIn) {
                vc.emit('parkingAreaControlCustomCarInout', 'open', {
                    type: "1102", //1101 手动入场 1102 手动出场
                    carNum: carIn.carNum,
                    amount: carIn.payCharge,
                    payCharge: carIn.payCharge,
                    machineId: $that.parkingAreaControlCarInoutsInfo.machineId,
                    boxId: $that.parkingAreaControlCarInoutsInfo.boxId,
                    paId: $that.parkingAreaControlCarInoutsInfo.paId,
                })
            },
            _carInoutOpenFile: function (_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            }
        }
    });
})(window.vc);