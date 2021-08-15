/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportHuaningPayFeeTwoInfo: {
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
            vc.on('reportHuaningPayFeeTwo', 'switch', function (_param) {
                $that.clearReportHuaningPayFeeTwoInfo();
                $that.reportHuaningPayFeeTwoInfo.conditions = _param;
                $that._listReportHuaningPayFeeTwo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningPayFeeTwo', 'notify', function () {
                $that._listReportHuaningPayFeeTwo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningPayFeeTwo', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listReportHuaningPayFeeTwo(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listReportHuaningPayFeeTwo: function (_page, _row) {
                $that.reportHuaningPayFeeTwoInfo.conditions.page = _page;
                $that.reportHuaningPayFeeTwoInfo.conditions.row = _row;
                $that.reportHuaningPayFeeTwoInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportHuaningPayFeeTwoInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryHuaningPayFeeTwo',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportHuaningPayFeeTwoInfo.total = _feeConfigInfo.total;
                        vc.component.reportHuaningPayFeeTwoInfo.records = _feeConfigInfo.records;
                        vc.component.reportHuaningPayFeeTwoInfo.fees = _feeConfigInfo.data;
                        vc.emit('reportHuaningPayFeeTwo', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            clearReportHuaningPayFeeTwoInfo: function () {
                $that.reportHuaningPayFeeTwoInfo = {
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
            _getOweFeeTwo:function(_fee){
               return  _fee.receivedAmount2 + _fee.receivableAmount - _fee.receivedAmount - _fee.receivedAmount1;
            }
        }
    });
})(window.vc);
