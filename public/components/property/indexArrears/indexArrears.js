(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            indexArrearsInfo: {
                complaintCount: 0,
                repairCount: 0,
                purchaseCount: 0,
                collectionCount: 0
            }
        },
        _initMethod: function () {
            vc.component._listCompaintOrders();
            $that._listRepairCount();
            $that._listPurchaseCount();
            $that._listCollectionCount();
            $that._initMyEcharts();
        },
        _initEvent: function () {

        },
        methods: {
            _listCompaintOrders: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.get('myAuditComplaints',
                    'list',
                    param,
                    function (json, res) {
                        var _myAuditComplaintsInfo = JSON.parse(json);
                        vc.component.indexArrearsInfo.complaintCount = _myAuditComplaintsInfo.total;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listRepairCount: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('ownerRepair.listStaffRepairs',
                    param,
                    function (json, res) {
                        var _repairDispatchManageInfo = JSON.parse(json);
                        vc.component.indexArrearsInfo.repairCount = _repairDispatchManageInfo.total;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listPurchaseCount: function () {

                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.get('myAuditOrders',
                    'list',
                    param,
                    function (json, res) {
                        var _auditOrdersInfo = JSON.parse(json);
                        vc.component.indexArrearsInfo.purchaseCount = _auditOrdersInfo.total;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listCollectionCount: function (_page, _rows) {

                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/collection/getCollectionAuditOrder',
                    param,
                    function (json, res) {
                        let _auditOrdersInfo = JSON.parse(json);
                        vc.component.indexArrearsInfo.collectionCount = _auditOrdersInfo.total;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _initMyEcharts: function () {
                let dom = document.getElementById("myToDo");
                let myChart = echarts.init(dom);
                let option = null;
                option = {
                    legend: {},
                    tooltip: {},
                    color: ['#FFDAB9','#66CDAA'],
                    dataset: {
                        source: [
                            ['product', '待办', '已办'],
                            ['投诉', 43.3, 85.8],
                            ['报修', 83.1, 73.4],
                            ['采购', 86.4, 65.2],
                            ['领用', 72.4, 53.9]
                        ]
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    series: [
                        {type: 'bar'},
                        {type: 'bar'}
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

            },
        }
    })
})(window.vc);