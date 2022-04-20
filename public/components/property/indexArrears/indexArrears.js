(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            indexArrearsInfo: {
                complaintCount: 0,
                complaintHisCount: 0,
                repairCount: 0,
                repairHisCount: 0,
                purchaseCount: 0,
                purchaseHisCount: 0,
                collectionCount: 0,
                collectionHisCount: 0
            }
        },
        _initMethod: function() {
            vc.component._listCompaintOrders();
        },
        _initEvent: function() {

        },
        methods: {
            _listCompaintOrders: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('index.queryIndexTodoTask',
                    param,
                    function(json, res) {
                        var _myAuditComplaintsInfo = JSON.parse(json);
                        vc.copyObject(_myAuditComplaintsInfo.data, $that.indexArrearsInfo);

                        $that._initMyEcharts();
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        $that._initMyEcharts();
                    }
                );
            },
            _initMyEcharts: function() {
                let dom = document.getElementById("myToDo");
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    legend: {},
                    tooltip: {},
                    color: ['#FFDAB9', '#66CDAA'],
                    dataset: {
                        source: [
                            ['product', vc.i18n('待办', 'indexArrears'), vc.i18n('已办', 'indexArrears')],
                            [vc.i18n('投诉', 'indexArrears'), $that.indexArrearsInfo.complaintCount, $that.indexArrearsInfo.complaintHisCount],
                            [vc.i18n('报修', 'indexArrears'), $that.indexArrearsInfo.repairCount, $that.indexArrearsInfo.repairHisCount],
                            [vc.i18n('采购', 'indexArrears'), $that.indexArrearsInfo.purchaseCount, $that.indexArrearsInfo.purchaseHisCount],
                            [vc.i18n('领用', 'indexArrears'), $that.indexArrearsInfo.collectionCount, $that.indexArrearsInfo.collectionHisCount]
                        ]
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
    })
})(window.vc);