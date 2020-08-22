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
            }
        }
    })
})(window.vc);