/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportHuaningOweFeeDetailInfo: {
                fees: [],
                listColumns: [],
                roomId: '',
                roomName: '',
                conditions: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1
                },
                dateStr: vc.dateFormat(new Date().getTime())
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('reportHuaningOweFeeDetail', 'switch', function (_param) {
                $that.clearReportHuaningOweFeeDetailInfo();
                $that.reportHuaningOweFeeDetailInfo.conditions = _param;
                $that._listReportHuaningOweFeeDetail(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningOweFeeDetail', 'notify', function () {
                $that._listReportHuaningOweFeeDetail(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningOweFeeDetail', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listReportHuaningOweFeeDetail(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listReportHuaningOweFeeDetail: function (_page, _row) {
                $that.reportHuaningOweFeeDetailInfo.conditions.page = _page;
                $that.reportHuaningOweFeeDetailInfo.conditions.row = _row;
                $that.reportHuaningOweFeeDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportHuaningOweFeeDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryHuaningOweFeeDetail',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportHuaningOweFeeDetailInfo.total = _feeConfigInfo.total;
                        vc.component.reportHuaningOweFeeDetailInfo.records = _feeConfigInfo.records;
                        vc.component.reportHuaningOweFeeDetailInfo.fees = _feeConfigInfo.data;
                        vc.emit('reportHuaningOweFeeDetail', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            clearReportHuaningOweFeeDetailInfo: function () {
                $that.reportHuaningOweFeeDetailInfo = {
                    fees: [],
                    roomId: '',
                    roomName: '',
                    name: '',
                    conditions: {
                        year: new Date().getFullYear(),
                        month: new Date().getMonth() + 1
                    },
                    dateStr: vc.dateFormat(new Date().getTime())
                }
            },
            _getMonthFee: function (_fee) {
                return (_fee.builtUpArea * _fee.squarePrice).toFixed(2);
            }
        }
    });
})(window.vc);
