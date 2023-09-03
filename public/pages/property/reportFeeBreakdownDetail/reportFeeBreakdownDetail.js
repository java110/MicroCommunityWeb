/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 20;
    vc.extends({
        data: {
            reportFeeBreakdownDetailInfo: {
                fees: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    configId: '',
                    feeTypeCd: '',
                    startTime: '',
                    endTime: '',
                    yearMonth: '',
                    communityId: vc.getCurrentCommunity().communityId,
                }
            }
        },
        _initMethod: function() {
            $that.reportFeeBreakdownDetailInfo.conditions.floorId = vc.getParam('floorId');
            $that.reportFeeBreakdownDetailInfo.conditions.floorName = vc.getParam('floorName');
            $that.reportFeeBreakdownDetailInfo.conditions.roomNum = vc.getParam('roomNum');
            $that.reportFeeBreakdownDetailInfo.conditions.unitId = vc.getParam('unitId');
            $that.reportFeeBreakdownDetailInfo.conditions.startTime = vc.getParam('startTime');
            $that.reportFeeBreakdownDetailInfo.conditions.endTime = vc.getParam('endTime');
            $that.reportFeeBreakdownDetailInfo.conditions.feeYear = vc.getParam('feeTypeCd');
            $that.reportFeeBreakdownDetailInfo.conditions.feeMonth = vc.getParam('yearMonth');
            $that.reportFeeBreakdownDetailInfo.conditions.configId = vc.getParam('configId');
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
                $that.reportFeeBreakdownDetailInfo.conditions.page = _page;
                $that.reportFeeBreakdownDetailInfo.conditions.row = _rows;
                $that.reportFeeBreakdownDetailInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.reportFeeBreakdownDetailInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFeeBreakdownDetail',
                    param,
                    function(json, res) {
                        var _reportFeeBreakdownDetailInfo = JSON.parse(json);
                        $that.reportFeeBreakdownDetailInfo.total = _reportFeeBreakdownDetailInfo.total;
                        $that.reportFeeBreakdownDetailInfo.records = _reportFeeBreakdownDetailInfo.records;
                        $that.reportFeeBreakdownDetailInfo.fees = _reportFeeBreakdownDetailInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.reportFeeBreakdownDetailInfo.records,
                            dataCount: $that.reportFeeBreakdownDetailInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=reportFeeBreakdownDetail&' + vc.objToGetParam($that.reportFeeBreakdownDetailInfo.conditions));
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