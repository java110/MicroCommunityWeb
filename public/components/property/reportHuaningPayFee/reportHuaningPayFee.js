/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportHuaningPayFeeInfo: {
                total: 0,
                records: 1,
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
            vc.on('reportHuaningPayFee', 'switch', function (_param) {
                $that.clearReportProficientRoomFeeInfo();
                $that.reportHuaningPayFeeInfo.conditions = _param;
                $that._listReportHuaningPayFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningPayFee', 'notify', function () {
                $that._listReportHuaningPayFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('reportHuaningPayFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listReportHuaningPayFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listReportHuaningPayFee: function (_page, _row) {
                $that.reportHuaningPayFeeInfo.conditions.page = _page;
                $that.reportHuaningPayFeeInfo.conditions.row = _row;
                $that.reportHuaningPayFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.reportHuaningPayFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryHuaningPayFee',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.reportHuaningPayFeeInfo.total = _feeConfigInfo.total;
                        vc.component.reportHuaningPayFeeInfo.records = _feeConfigInfo.records;
                        vc.component.reportHuaningPayFeeInfo.fees = _feeConfigInfo.data;
                        vc.emit('reportHuaningPayFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            dataCount: vc.component.reportHuaningPayFeeInfo.total,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            clearReportProficientRoomFeeInfo: function () {
                $that.reportHuaningPayFeeInfo = {
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
            _getNextMonth: function () {
                let _date = vc.addMonth(new Date(), 1);
                let date = new Date(_date);
                return date.getFullYear() + "年" + (date.getMonth() + 1) + "月"
            }
        }
    });
})(window.vc);
