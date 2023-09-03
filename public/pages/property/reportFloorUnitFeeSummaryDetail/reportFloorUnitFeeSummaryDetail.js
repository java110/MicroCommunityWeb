/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            reportFloorUnitFeeSummaryDetailInfo: {
                fees: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    floorNum: '',
                    unitNum: '',
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
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.floorId = vc.getParam('floorId');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.floorName = vc.getParam('floorName');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.roomNum = vc.getParam('roomNum');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.unitId = vc.getParam('unitId');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.startTime = vc.getParam('startTime');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.endTime = vc.getParam('endTime');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.feeYear = vc.getParam('feeYear');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.feeMonth = vc.getParam('feeMonth');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.configIds = vc.getParam('configIds');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.floorNum = vc.getParam('floorNum');
            $that.reportFloorUnitFeeSummaryDetailInfo.conditions.unitNum = vc.getParam('unitNum');
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
                $that.reportFloorUnitFeeSummaryDetailInfo.conditions.page = _page;
                $that.reportFloorUnitFeeSummaryDetailInfo.conditions.row = _rows;
                $that.reportFloorUnitFeeSummaryDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.reportFloorUnitFeeSummaryDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFloorUnitFeeSummaryDetail',
                    param,
                    function(json, res) {
                        var _reportFloorUnitFeeSummaryDetailInfo = JSON.parse(json);
                        $that.reportFloorUnitFeeSummaryDetailInfo.total = _reportFloorUnitFeeSummaryDetailInfo.total;
                        $that.reportFloorUnitFeeSummaryDetailInfo.records = _reportFloorUnitFeeSummaryDetailInfo.records;
                        $that.reportFloorUnitFeeSummaryDetailInfo.fees = _reportFloorUnitFeeSummaryDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.reportFloorUnitFeeSummaryDetailInfo.records,
                            dataCount: $that.reportFloorUnitFeeSummaryDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFloorUnitFeeSummaryDetail&' + vc.objToGetParam($that.reportFloorUnitFeeSummaryDetailInfo.conditions));
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