/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlCarInoutsInfo: {
                carIns: [],
                boxId: '',
                state: '',
                carNum: '',
                startTime: '',
                endTime: '',
            }
        },
        _initMethod: function() {
            vc.initDate('carInoutsStartTime', function(_value) {
                $that.parkingAreaControlCarInoutsInfo.startTime = _value;
            });
            vc.initDate('carInoutsEndTime', function(_value) {
                $that.parkingAreaControlCarInoutsInfo.endTime = _value;
            })
        },
        _initEvent: function() {
            vc.on('parkingAreaControlCarInouts', 'switch', function(_data) {
                $that.parkingAreaControlCarInoutsInfo.boxId = _data.boxId;
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('parkingAreaControlCarInouts', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._loadParkingAreaControlCarInouts(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {

            _loadParkingAreaControlCarInouts: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlCarInoutsInfo.boxId,
                        state: $that.parkingAreaControlCarInoutsInfo.state,
                        carNum: $that.parkingAreaControlCarInoutsInfo.carNum,
                        startTime: $that.parkingAreaControlCarInoutsInfo.startTime,
                        endTime: $that.parkingAreaControlCarInoutsInfo.endTime
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInoutDetail.listCarInoutDetail',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.parkingAreaControlCarInoutsInfo.total = _feeConfigInfo.total;
                        vc.component.parkingAreaControlCarInoutsInfo.records = _feeConfigInfo.records;
                        vc.component.parkingAreaControlCarInoutsInfo.carIns = _feeConfigInfo.data;
                        vc.emit('parkingAreaControlCarInouts', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlCarInouts: function() {
                $that._loadParkingAreaControlCarInouts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _viewTempFeeConfigInOutCar: function(_feeConfigId) {
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