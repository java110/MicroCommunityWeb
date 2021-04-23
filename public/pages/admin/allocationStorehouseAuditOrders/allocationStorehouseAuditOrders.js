/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseAuditOrdersInfo: {
                auditOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    AuditOrdersId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: '',
                procure: false
            }
        },
        _initMethod: function () {
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('allocationStorehouseAuditOrders', 'listAuditOrders', function (_param) {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('allocationStorehouseAuditOrders', 'notifyAudit', function (_auditInfo) {
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function (_page, _rows) {

                vc.component.allocationStorehouseAuditOrdersInfo.conditions.page = _page;
                vc.component.allocationStorehouseAuditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.allocationStorehouseAuditOrdersInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStoreAuditOrders',
                    param,
                    function (json, res) {
                        var _allocationStorehouseAuditOrdersInfo = JSON.parse(json);
                        vc.component.allocationStorehouseAuditOrdersInfo.total = _allocationStorehouseAuditOrdersInfo.total;
                        vc.component.allocationStorehouseAuditOrdersInfo.records = _allocationStorehouseAuditOrdersInfo.records;
                        vc.component.allocationStorehouseAuditOrdersInfo.auditOrders = _allocationStorehouseAuditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.allocationStorehouseAuditOrdersInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function (_auditOrder) {
                vc.component.allocationStorehouseAuditOrdersInfo.orderInfo = _auditOrder;
                vc.emit('audit', 'openAuditModal', {});
            },
            _queryAuditOrdersMethod: function () {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //提交审核信息
            _auditOrderInfo: function (_auditInfo) {
                console.log("提交得参数：" + _auditInfo);
                _auditInfo.taskId = vc.component.allocationStorehouseAuditOrdersInfo.orderInfo.taskId;
                _auditInfo.asId = vc.component.allocationStorehouseAuditOrdersInfo.orderInfo.asId;
                //发送get请求
                vc.http.apiPost('resourceStore.auditAllocationStoreOrder',
                    JSON.stringify(_auditInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        vc.toast("处理成功");
                        vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _finishAuditOrder: function (_auditOrder) {
                let _auditInfo = {
                    taskId: _auditOrder.taskId,
                    asId: _auditOrder.asId,
                    state: '1200',
                    remark: '处理结束'
                };
                //发送get请求
                vc.http.apiPost('resourceStore.auditAllocationStoreOrder',
                    JSON.stringify(_auditInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        vc.toast("处理成功");
                        vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _toDetail: function (_item) {
                vc.jumpToPage("/admin.html#/pages/common/allocationStorehouseDetail?asId=" + _item.asId);
            }
        }
    });
})(window.vc);
