/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            parkingAreaControlPaymentSummaryInfo: {
                payments: [],
                boxId: '',
                paId: '',
                startTime: '',
                endTime: '',
            }
        },
        _initMethod: function() {
            vc.initDate('paymentSummaryStartTime', function(_value) {
                $that.parkingAreaControlPaymentSummaryInfo.startTime = _value;
            });
            vc.initDate('paymentSummaryEndTime', function(_value) {
                $that.parkingAreaControlPaymentSummaryInfo.endTime = _value;
            })
        },
        _initEvent: function() {
            vc.on('parkingAreaControlPaymentSummary', 'switch', function(_data) {
                $that.parkingAreaControlPaymentSummaryInfo.boxId = _data.boxId;
                $that.parkingAreaControlPaymentSummaryInfo.paId = _data.paId;
                $that._loadParkingAreaControlPaymentSummary(DEFAULT_PAGE, DEFAULT_ROWS);
            });

        },
        methods: {

            _loadParkingAreaControlPaymentSummary: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        boxId: $that.parkingAreaControlPaymentSummaryInfo.boxId,
                        paId: $that.parkingAreaControlPaymentSummaryInfo.paId,
                        startTime: $that.parkingAreaControlPaymentSummaryInfo.startTime,
                        endTime: $that.parkingAreaControlPaymentSummaryInfo.endTime
                    }
                };
                //发送get请求
                vc.http.apiGet('/carInoutPayment.listCarInoutPaymentSummary',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);

                        $that._initPaymentSummaryChart(_feeConfigInfo.data)
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _qureyParkingAreaControlPaymentSummary: function() {
                $that._loadParkingAreaControlPaymentSummary(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _initPaymentSummaryChart: function(_data) {
                let dom = document.getElementById("paymentSummary");
                let myChart = echarts.init(dom);
                let _createTime = [];
                let _realChargeTotals = [];
                _data.forEach(item => {
                    _createTime.push(item.createTime);
                    _realChargeTotals.push(item.realChargeTotal);
                });
                var app = {};
                option = null;
                option = {
                    title: {
                        text: '每日收费统计'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: _createTime
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: _createTime
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: '收入金额',
                        type: 'line',
                        stack: 'Total',
                        data: _realChargeTotals
                    }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }

        }
    });
})(window.vc);