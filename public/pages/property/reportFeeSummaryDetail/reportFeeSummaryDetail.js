/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            reportFeeSummaryDetailInfo: {
                fees: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    feeYear: '',
                    feeMonth: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    configIds: ''
                }
            }
        },
        _initMethod: function() {
            $that.reportFeeSummaryDetailInfo.conditions.floorId = vc.getParam('floorId');
            $that.reportFeeSummaryDetailInfo.conditions.floorName = vc.getParam('floorName');
            $that.reportFeeSummaryDetailInfo.conditions.roomNum = vc.getParam('roomNum');
            $that.reportFeeSummaryDetailInfo.conditions.unitId = vc.getParam('unitId');
            $that.reportFeeSummaryDetailInfo.conditions.startTime = vc.getParam('startTime');
            $that.reportFeeSummaryDetailInfo.conditions.endTime = vc.getParam('endTime');
            $that.reportFeeSummaryDetailInfo.conditions.feeYear = vc.getParam('feeYear');
            $that.reportFeeSummaryDetailInfo.conditions.feeMonth = vc.getParam('feeMonth');
            $that.reportFeeSummaryDetailInfo.conditions.configIds = vc.getParam('configIds');
            $that._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listFees: function(_page, _rows) {
                $that.reportFeeSummaryDetailInfo.conditions.page = _page;
                $that.reportFeeSummaryDetailInfo.conditions.row = _rows;
                $that.reportFeeSummaryDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.reportFeeSummaryDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFeeSummaryDetail',
                    param,
                    function(json, res) {
                        var _reportFeeSummaryDetailInfo = JSON.parse(json);
                        $that.reportFeeSummaryDetailInfo.total = _reportFeeSummaryDetailInfo.total;
                        $that.reportFeeSummaryDetailInfo.records = _reportFeeSummaryDetailInfo.records;
                        $that.reportFeeSummaryDetailInfo.fees = _reportFeeSummaryDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.reportFeeSummaryDetailInfo.records,
                            dataCount: $that.reportFeeSummaryDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeSummaryDetail&' + vc.objToGetParam($that.reportFeeSummaryDetailInfo.conditions));
            },
            _goBack: function() {
                vc.goBack();
            },
            _computeSum: function(a, b) {
                return (parseFloat(a) + parseFloat(b)).toFixed(2)
            },
            _computeOweFee: function(fee) {
                let _oweFee = (parseFloat(fee.hisOweAmount) + parseFloat(fee.curReceivableAmount) - parseFloat(fee.curReceivedAmount) - parseFloat(fee.hisOweReceivedAmount)).toFixed(2);
                if (_oweFee < 0) {
                    return 0;
                }
                return _oweFee;
            },
        }
    });
})(window.vc);