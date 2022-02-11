/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractChangeAuditOrdersInfo: {
                contractChangeAuditOrders: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    planId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo: '',
                procure: false
            }
        },
        _initMethod: function() {
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('contractChangeAuditOrders', 'listAuditOrders', function(_param) {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('contractChangeAuditOrders', 'notifyAudit', function(_auditInfo) {
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {

                vc.component.contractChangeAuditOrdersInfo.conditions.page = _page;
                vc.component.contractChangeAuditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractChangeAuditOrdersInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractChangeTask',
                    param,
                    function(json, res) {
                        var _contractChangeAuditOrdersInfo = JSON.parse(json);
                        vc.component.contractChangeAuditOrdersInfo.total = _contractChangeAuditOrdersInfo.total;
                        vc.component.contractChangeAuditOrdersInfo.records = _contractChangeAuditOrdersInfo.records;
                        vc.component.contractChangeAuditOrdersInfo.contractChangeAuditOrders = _contractChangeAuditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractChangeAuditOrdersInfo.records,
                            dataCount: vc.component.contractChangeAuditOrdersInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function(_auditOrder) {
                vc.component.contractChangeAuditOrdersInfo.orderInfo = _auditOrder;
                vc.emit('audit', 'openAuditModal', {});
            },
            _queryAuditOrdersMethod: function() {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/admin.html#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            },
            //提交审核信息
            _auditOrderInfo: function(_auditInfo) {
                console.log("提交得参数：" + _auditInfo);
                _auditInfo.taskId = vc.component.contractChangeAuditOrdersInfo.orderInfo.taskId;
                _auditInfo.planId = vc.component.contractChangeAuditOrdersInfo.orderInfo.planId;
                _auditInfo.contractId = vc.component.contractChangeAuditOrdersInfo.orderInfo.contractId;
                //发送get请求
                vc.http.apiPost('/contract/needAuditContractPlan',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        vc.toast("处理成功");
                        vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _finishAuditOrder: function(_auditOrder) {
                let _auditInfo = {
                    taskId: _auditOrder.taskId,
                    planId: _auditOrder.planId,
                    state: '1200',
                    remark: '处理结束'
                };
                //发送get请求
                vc.http.apiPost('/contract/needAuditContractPlan',
                    JSON.stringify(_auditInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        vc.toast("处理成功");
                        vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast("处理失败：" + errInfo);
                    }
                );
            },
            _viewChangeDetail: function(_plan) {
                vc.jumpToPage("/admin.html#/pages/admin/contractChangeDetails?planId=" + _plan.planId);
            }


        }
    });
})(window.vc);