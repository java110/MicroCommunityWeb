/**
 审核订单
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractApplyAuditOrdersInfo: {
                contractApplyAuditOrders: [],
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
                orderInfo:{},
                procure:false
            }
        },
        _initMethod: function () {
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadStepStaff();
        },
        _initEvent: function () {

            vc.on('contractApplyAuditOrders', 'listAuditOrders', function (_param) {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });

            vc.on('contractApplyAuditOrders','notifyAudit',function(_auditInfo){
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function (_page, _rows) {

                vc.component.contractApplyAuditOrdersInfo.conditions.page = _page;
                vc.component.contractApplyAuditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.contractApplyAuditOrdersInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/contract/queryContractTask',
                    param,
                    function (json, res) {
                        var _contractApplyAuditOrdersInfo = JSON.parse(json);
                        vc.component.contractApplyAuditOrdersInfo.total = _contractApplyAuditOrdersInfo.total;
                        vc.component.contractApplyAuditOrdersInfo.records = _contractApplyAuditOrdersInfo.records;
                        vc.component.contractApplyAuditOrdersInfo.contractApplyAuditOrders = _contractApplyAuditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.contractApplyAuditOrdersInfo.records,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function (_auditOrder) {
                vc.component.contractApplyAuditOrdersInfo.orderInfo = _auditOrder;
                vc.emit('audit','openAuditModal',{});
            },
            _queryAuditOrdersMethod: function () {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailContractApplyModel:function(_auditOrder){
                vc.jumpToPage("/admin.html#/pages/common/contractApplyDetail?contractId="+_auditOrder.contractId);
            },
            //提交审核信息
            _auditOrderInfo: function (_auditInfo) {
                console.log("提交得参数："+_auditInfo);
                _auditInfo.taskId = vc.component.contractApplyAuditOrdersInfo.orderInfo.taskId;
                _auditInfo.contractId = vc.component.contractApplyAuditOrdersInfo.orderInfo.contractId;
                //发送get请求
                vc.http.apiPost('/contract/needAuditContract',
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
                    contractId: _auditOrder.contractId,
                    state:'1200',
                    remark:'处理结束'
                };
                //发送get请求
                vc.http.apiPost('/contract/needAuditContract',
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
            _loadStepStaff: function () {

                var param = {
                    params: {
                        page:1,
                        row:1,
                        staffId: $that.contractApplyAuditOrdersInfo.currentUserId,
                        staffRole: '2002'
                    }
                };

                //发送get请求
                vc.http.apiGet('workflow.listWorkflowStepStaffs',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        if(_json.data.length > 0){
                            $that.contractApplyAuditOrdersInfo.procure = true;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

            _procureEnterOrder:function(_purchaseApply){
                vc.jumpToPage("/admin.html#/pages/common/resourceEnterManage?applyOrderId="+_purchaseApply.applyOrderId+"&resOrderType="+_purchaseApply.resOrderType+"&taskId="+_purchaseApply.taskId);
            }


        }
    });
})(window.vc);
