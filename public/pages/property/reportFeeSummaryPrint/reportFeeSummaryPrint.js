/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportFeeSummaryPrintInfo: {
                fees: [],
                conditions: {
                    floorId: '',
                    floorName: '',
                    roomNum: '',
                    unitId: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {

            $that.reportFeeSummaryPrintInfo.conditions.floorId = vc.getParam('floorId');
            $that.reportFeeSummaryPrintInfo.conditions.floorName = vc.getParam('floorName');
            $that.reportFeeSummaryPrintInfo.conditions.roomNum = vc.getParam('roomNum');
            $that.reportFeeSummaryPrintInfo.conditions.unitId = vc.getParam('unitId');
            $that.reportFeeSummaryPrintInfo.conditions.startTime = vc.getParam('startTime');
            $that.reportFeeSummaryPrintInfo.conditions.endTime = vc.getParam('endTime');
            $that.reportFeeSummaryPrintInfo.conditions.communityId = vc.getParam('communityId');

            vc.component._listFees(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        methods: {
            //查询方法
            _listFees: function(_page, _rows) {
                vc.component.reportFeeSummaryPrintInfo.conditions.page = _page;
                vc.component.reportFeeSummaryPrintInfo.conditions.row = _rows;
                vc.component.reportFeeSummaryPrintInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportFeeSummaryPrintInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics/queryReportFeeSummary',
                    param,
                    function(json, res) {
                        var _reportFeeSummaryInfo = JSON.parse(json);
                        vc.component.reportFeeSummaryPrintInfo.fees = _reportFeeSummaryInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _getFeeReceivedAmountAmount: function(item, fee) {
                let _items = fee.feeConfigDtos;
                if (!_items) {
                    return 0;
                }
                let _value = 0;
                _items.forEach(tmp => {
                    if (tmp.configId == item.configId) {
                        _value = tmp.amount;
                        return;
                    }
                })
                return _value;
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
            _computeTotalOweAmount: function() {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeSummaryInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeSummaryInfo.fees.forEach(item => {
                    _amount += parseFloat($that._computeOweFee(item));
                })
                return _amount.toFixed(2);
            },
            _computeTotalHisOweReceivedAmount: function() {
                if (!window.$that) {
                    return 0;
                }
                if (!$that.reportFeeSummaryInfo) {
                    return 0;
                }
                let _amount = 0;
                $that.reportFeeSummaryInfo.fees.forEach(item => {
                    _amount += parseFloat(item.hisOweReceivedAmount);
                })
                return _amount.toFixed(2);
            },
            _printPurchaseApplyDiv: function() {

                $that.printFlag = '1';
                console.log('console.log($that.printFlag);', $that.printFlag);
                document.getElementById("print-btn").style.display = "none"; //隐藏

                window.print();
                //$that.printFlag = false;
                window.opener = null;
                window.close();
            },
            _closePage: function() {
                window.opener = null;
                window.close();
            },
        }
    });
})(window.vc);