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
                state: '',
                carNum: '',
                startTime: '',
                endTime: '',
                updateCarNum: '',
                updateInoutId: '',
            }
        },
        _initMethod: function() {
            vc.initDate('inCarStartTime', function(_value) {
                $that.parkingAreaControlInCarInfo.startTime = _value;
            });
            vc.initDate('inCarEndTime', function(_value) {
                $that.parkingAreaControlInCarInfo.endTime = _value;
            })
        },
        _initEvent: function() {
            vc.on('parkingAreaControlInCar', 'switch', function(_data) {
                $that.parkingAreaControlInCarInfo.boxId = _data.boxId;
                $that._loadParkingAreaControlInCarData(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('parkingAreaControlInCar', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlInCarData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
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
                        endTime: $that.parkingAreaControlInCarInfo.endTime
                    }
                };
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
            _qureyParkingAreaControlInCar: function() {
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
            }
        }
    });
})(window.vc);