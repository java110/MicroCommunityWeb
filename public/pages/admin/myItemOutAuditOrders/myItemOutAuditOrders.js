/**
 审核订单
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            auditOrdersInfo: {
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
                procure: false,
                audit: '1'
            }
        },
        _initMethod: function() {
            vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._loadStepStaff();
        },
        _initEvent: function() {
            vc.on('myAuditOrders', 'list', function(_param) {
                $that.auditOrdersInfo.audit = '1';
            });
            vc.on('myAuditOrders', 'listAuditOrders', function(_param) {
                $that.auditOrdersInfo.audit = '1';
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listAuditOrders(_currentPage, DEFAULT_ROWS);
            });
            vc.on('myAuditOrders', 'notifyAudit', function(_auditInfo) {
                $that.auditOrdersInfo.audit = '1';
                vc.component._auditOrderInfo(_auditInfo);
            });
        },
        methods: {
            _listAuditOrders: function(_page, _rows) {
                $that.auditOrdersInfo.audit = '1';
                vc.component.auditOrdersInfo.conditions.page = _page;
                vc.component.auditOrdersInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.auditOrdersInfo.conditions
                };
                param.params.communityId = vc.getCurrentCommunity().communityId;
                //发送get请求
                vc.http.apiGet('/collection/getCollectionAuditOrder',
                    param,
                    function(json, res) {
                        var _auditOrdersInfo = JSON.parse(json);
                        vc.component.auditOrdersInfo.total = _auditOrdersInfo.total;
                        vc.component.auditOrdersInfo.records = _auditOrdersInfo.records;
                        vc.component.auditOrdersInfo.auditOrders = _auditOrdersInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.auditOrdersInfo.records,
                            dataCount: vc.component.auditOrdersInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAuditOrderModel: function(_auditOrder) {
                vc.component.auditOrdersInfo.orderInfo = _auditOrder;
                _auditOrder.startUserId = _auditOrder.userId;
                $that.auditOrdersInfo.audit = '2';
                vc.emit('flowAudit', 'openAuditModal', _auditOrder);
            },
            _queryAuditOrdersMethod: function() {
                vc.component._listAuditOrders(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType);
            },
            //提交审核信息
            _auditOrderInfo: function(_auditInfo) {
                console.log("提交得参数：" + _auditInfo);
                _auditInfo.taskId = vc.component.auditOrdersInfo.orderInfo.taskId;
                _auditInfo.applyOrderId = vc.component.auditOrdersInfo.orderInfo.applyOrderId;
                //_auditInfo.nextUserId = _auditInfo.nextUserId;
                // 新增通知状态字段，区别是否为仓管及对应状态
                if (_auditInfo.state == '1200') {
                    _auditInfo.noticeState = '1004';
                } else if (vc.component.auditOrdersInfo.procure) {
                    _auditInfo.noticeState = '1002';
                } else {
                    _auditInfo.noticeState = '1001';
                }
                //发送get请求
                vc.http.apiPost('/purchaseApply.auditApplyOrder',
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
                    applyOrderId: _auditOrder.applyOrderId,
                    state: '1200',
                    remark: '处理结束'
                };
                //发送get请求
                vc.http.apiPost('/purchaseApply.auditApplyOrder',
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
            _loadStepStaff: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        staffId: $that.auditOrdersInfo.currentUserId,
                        staffRole: '3003',
                        requestType: 'grantHandle'
                    }
                };
                //发送get请求
                vc.http.apiGet('/workflow.listWorkflowStepStaffs',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        if (_json.data.length > 0) {
                            $that.auditOrdersInfo.procure = true;
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _distributionOrder: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/resourceOutManage?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=" + _purchaseApply.resOrderType + "&taskId=" + _purchaseApply.taskId);
            }
        }
    });
})(window.vc);