/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditOpenShopInfo: {
                shops: [],
                total: 0,
                records: 1,
                moreCondition: false,
                userName: '',
                currentUserId:vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    AuditOrdersId: '',
                    userName: '',
                    auditLink: '',
                },
                orderInfo:'',
                procure:false
            }
        },
        _initMethod: function () {
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadStepStaff();
        },
        _initEvent: function () {

            vc.on('myAuditOrders', 'listAuditOrders', function (_param) {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('myAuditOrders','notifyAudit',function(_auditInfo){
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function (_page, _rows) {

                vc.component.auditOpenShopInfo.conditions.page = _page;
                vc.component.auditOpenShopInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.auditOpenShopInfo.conditions
                };

                //发送get请求
                vc.http.get('myAuditOrders',
                    'list',
                    param,
                    function (json, res) {
                        var _auditOpenShopInfo = JSON.parse(json);
                        vc.component.auditOpenShopInfo.total = _auditOpenShopInfo.total;
                        vc.component.auditOpenShopInfo.records = _auditOpenShopInfo.records;
                        vc.component.auditOpenShopInfo.shops = _auditOpenShopInfo.resourceOrders;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditOpenShopInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function (_auditOrder) {
                vc.component.auditOpenShopInfo.orderInfo = _auditOrder;
                vc.emit('audit','openAuditModal',{});
            },
            _queryAuditOrdersMethod: function () {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel:function(_purchaseApply){
                vc.jumpToPage("/admin.html#/pages/common/purchaseApplyDetail?applyOrderId="+_purchaseApply.applyOrderId+"&resOrderType="+_purchaseApply.resOrderType);
            },
            //提交审核信息
            _auditOrderInfo: function (_auditInfo) {
                console.log("提交得参数："+_auditInfo);
                _auditInfo.taskId = vc.component.auditOpenShopInfo.orderInfo.taskId;
                _auditInfo.applyOrderId = vc.component.auditOpenShopInfo.orderInfo.applyOrderId;
                //发送get请求
                vc.http.post('myAuditOrders',
                    'audit',
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
            _finishAuditOrder:function(_auditOrder){
                let _auditInfo = {
                    taskId: _auditOrder.taskId,
                    applyOrderId: _auditOrder.applyOrderId,
                    state:'1200',
                    remark:'处理结束'
                };
                //发送get请求
                vc.http.post('myAuditOrders',
                    'audit',
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
            }

        }
    });
})(window.vc);
