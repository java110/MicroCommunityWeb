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
                carNum: ''
            }
        },
        _initMethod: function() {

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
                        state: $that.parkingAreaControlInCarInfo.carNum
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
            }
        }
    });
})(window.vc);