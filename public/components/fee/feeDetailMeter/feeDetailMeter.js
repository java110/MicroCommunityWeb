/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailMeterInfo: {
                meterWaters: [],
                feeId: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailMeter', 'switch', function (_data) {
                $that.feeDetailMeterInfo.feeId = _data.feeId;
                $that._loadFeeDetailMeterData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailMeter', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailMeterData(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadFeeDetailMeterData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: $that.feeDetailMeterInfo.feeId,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/meterWater.listMeterWaters',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailMeterInfo.meterWaters = _roomInfo.data;
                        vc.emit('feeDetailMeter', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyFeeDetailMeter: function () {
                $that._loadFeeDetailMeterData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);