/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            configFeeSummaryInfo: {
                conditions: {}
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('configFeeSummary', 'notify', function(_data) {
                $that.configFeeSummaryInfo.conditions = _data;
                $that._loadConfigFeeSummaryRate(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadConfigFeeSummaryRate: function(_page, _row) {
                let param = {
                    params: $that.configFeeSummaryInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportConfigFeeSummary',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        $that._initConfigFeeSummaryChart(_roomInfo.data);

                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _initConfigFeeSummaryChart: function(_data) {
                let dom = document.getElementById("configFeeSummary");
                let _source = [
                    ['product', '户收费率', '收费率'],
                ];

                _data.forEach(item => {
                    _source.push([
                        item.name,
                        item.feeRoomRate,
                        item.feeRate
                    ])
                });

                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    legend: {},
                    tooltip: {},
                    title: {
                        show: "true",
                        text: '费用项收费率统计'
                    },
                    color: ['#FFDAB9', '#66CDAA'],
                    dataset: {
                        source: _source
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    series: [
                        { type: 'bar' },
                        { type: 'bar' }
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            },



        }
    });
})(window.vc);