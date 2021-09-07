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
            vc.component._loadStepStaff();
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
                param.params.communityId = vc.getCurrentCommunity().communityId;

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
                            dataCount: vc.component.allocationStorehouseAuditOrdersInfo.total,
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
                _auditInfo.taskId = vc.component.allocationStorehouseAuditOrdersInfo.orderInfo.taskId;
                _auditInfo.applyId = vc.component.allocationStorehouseAuditOrdersInfo.orderInfo.applyId;
                _auditInfo.procure = vc.component.allocationStorehouseAuditOrdersInfo.procure;
                // 新增通知状态字段，区别是否为仓管及对应状态
                if (_auditInfo.state == '1200') {
                    _auditInfo.noticeState = '1203';
                } else if (vc.component.allocationStorehouseAuditOrdersInfo.procure) {
                    _auditInfo.noticeState = '1204';
                } else {
                    _auditInfo.noticeState = '1201';
                }
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
                    applyId: _auditOrder.applyId,
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
            _loadStepStaff: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        staffId: $that.allocationStorehouseAuditOrdersInfo.currentUserId,
                        staffRole: '3003',
                        requestType: 'allocationHandle'
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listWorkflowStepStaffs',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        if (_json.data.length > 0) {
                            $that.allocationStorehouseAuditOrdersInfo.procure = true;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toDetail: function (_item) {
                vc.jumpToPage("/admin.html#/pages/common/allocationStorehouseDetail?applyId=" + _item.applyId);
            }
        }
    });
})(window.vc);
