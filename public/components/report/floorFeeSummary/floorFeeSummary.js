/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            floorFeeSummaryInfo: {
                conditions: {}
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('floorFeeSummary', 'notify', function(_data) {
                $that.floorFeeSummaryInfo.conditions = _data;
                $that._loadFloorFeeSummaryRate(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadFloorFeeSummaryRate: function(_page, _row) {
                let param = {
                    params: $that.floorFeeSummaryInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/reportFeeMonthStatistics.queryReportFloorFeeSummary',
                    param,
                    function(json) {
                        let _roomInfo = JSON.parse(json);
                        $that._initFloorFeeSummaryChart(_roomInfo.data);

                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _initFloorFeeSummaryChart: function(_data) {
                let dom = document.getElementById("floorFeeSummary");
                let _source = [
                    ['product', '户收费率', '收费率'],
                ];

                _data.forEach(item => {
                    _source.push([
                        item.floorName,
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
                        text: '楼栋收费率统计'
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