/**
 采购组件
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            purchaseApplyManageInfo: {
                purchaseApplys: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    state: '',
                    applyOrderId: '',
                    userName: '',
                    resOrderType: '10000',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            vc.component._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            vc.getDict('purchase_apply', "state", function(_data) {
                vc.component.purchaseApplyManageInfo.states = _data;
            });
        },
        _initEvent: function() {
            vc.on('purchaseApplyManage', 'listPurchaseApply', function(_param) {
                vc.component._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listPurchaseApplys(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listPurchaseApplys: function(_page, _rows) {
                vc.component.purchaseApplyManageInfo.conditions.page = _page;
                vc.component.purchaseApplyManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.purchaseApplyManageInfo.conditions
                };
                param.params.applyOrderId = param.params.applyOrderId.trim();
                param.params.state = param.params.state.trim();
                param.params.userName = param.params.userName.trim();
                //发送get请求
                vc.http.get('purchaseApplyManage',
                    'list',
                    param,
                    function(json, res) {
                        var _purchaseApplyManageInfo = JSON.parse(json);
                        vc.component.purchaseApplyManageInfo.total = _purchaseApplyManageInfo.total;
                        vc.component.purchaseApplyManageInfo.records = _purchaseApplyManageInfo.records;
                        vc.component.purchaseApplyManageInfo.purchaseApplys = _purchaseApplyManageInfo.purchaseApplys;
                        vc.emit('pagination', 'init', {
                            total: vc.component.purchaseApplyManageInfo.records,
                            dataCount: vc.component.purchaseApplyManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //采购申请
            _openAddPurchaseApplyModal: function() {
                vc.emit('viewResourceStoreInfo2', 'setResourcesOut', "10000");
                vc.jumpToPage("/#/pages/common/addPurchaseApplyStep?resOrderType=" + this.purchaseApplyManageInfo.conditions.resOrderType);
            },
            //紧急采购
            _openUrgentPurchaseApplyModal: function() {
                vc.emit('viewResourceStoreInfo4', 'setResourcesOut', "10000");
                vc.jumpToPage("/#/pages/common/urgentPurchaseApplyStep?resOrderType=" + this.purchaseApplyManageInfo.conditions.resOrderType);
            },
            _openDetailPurchaseApplyModel: function(_purchaseApply) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _purchaseApply.applyOrderId + "&resOrderType=10000");
            },
            _openDeletePurchaseApplyModel: function(_purchaseApply) {
                vc.emit('deletePurchaseApply', 'openDeletePurchaseApplyModal', _purchaseApply);
            },
            //查询
            _queryPurchaseApplyMethod: function() {
                vc.component._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function() {
                vc.component.purchaseApplyManageInfo.conditions.applyOrderId = "";
                vc.component.purchaseApplyManageInfo.conditions.state = "";
                vc.component.purchaseApplyManageInfo.conditions.userName = "";
                vc.component._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.purchaseApplyManageInfo.moreCondition) {
                    vc.component.purchaseApplyManageInfo.moreCondition = false;
                } else {
                    vc.component.purchaseApplyManageInfo.moreCondition = true;
                }
            },
            _openRunWorkflowImage: function(_purchaseApply) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _purchaseApply.applyOrderId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function(json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _queryInspectionPlanMethod: function() {
                vc.component._listPurchaseApplys(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //导出
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=purchaseApplyManage&' + vc.objToGetParam($that.purchaseApplyManageInfo.conditions));
            }
        }
    });
})(window.vc);