/**
 //出库申请
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            itemOutManageInfo: {
                itemOuts: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: '',
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    applyOrderId: '',
                    state: '',
                    userName: '',
                    resOrderType: '20000',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            //与字典表关联
            vc.getDict('purchase_apply', "state", function(_data) {
                vc.component.itemOutManageInfo.states = _data;
            });
            vc.component._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('itemOutManage', 'listItemOut', function(_param) {
                vc.component._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listItemOuts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listItemOuts: function(_page, _rows) {
                vc.component.itemOutManageInfo.conditions.page = _page;
                vc.component.itemOutManageInfo.conditions.row = _rows;
                let param = {
                    params: vc.component.itemOutManageInfo.conditions
                };
                param.params.applyOrderId = param.params.applyOrderId.trim();
                param.params.userName = param.params.userName.trim();
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function(json, res) {
                        var _itemOutManageInfo = JSON.parse(json);
                        vc.component.itemOutManageInfo.total = _itemOutManageInfo.total;
                        vc.component.itemOutManageInfo.records = _itemOutManageInfo.records;
                        vc.component.itemOutManageInfo.itemOuts = _itemOutManageInfo.purchaseApplys;
                        vc.emit('pagination', 'init', {
                            total: vc.component.itemOutManageInfo.records,
                            dataCount: vc.component.itemOutManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddItemOutModal: function() {
                vc.jumpToPage("/#/pages/common/addItemOutStep?resOrderType=" + vc.component.itemOutManageInfo.conditions.resOrderType);
            },
            _openDetailItemOutModel: function(_itemOut) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _itemOut.applyOrderId + "&resOrderType=" + vc.component.itemOutManageInfo.conditions.resOrderType);
            },
            _openDeleteItemOutModel: function(_itemOut) {
                vc.emit('deleteItemOut', 'openDeleteItemOutModal', _itemOut);
            },
            _queryItemOutMethod: function() {
                vc.component._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if (vc.component.itemOutManageInfo.moreCondition) {
                    vc.component.itemOutManageInfo.moreCondition = false;
                } else {
                    vc.component.itemOutManageInfo.moreCondition = true;
                }
            },
            //查询
            _queryInspectionPlanMethod: function() {
                vc.component._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function() {
                vc.component.itemOutManageInfo.conditions.applyOrderId = "";
                vc.component.itemOutManageInfo.conditions.state = "";
                vc.component.itemOutManageInfo.conditions.userName = "";
                vc.component._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openRunWorkflowImage: function(_itemOut) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _itemOut.applyOrderId
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
            //导出
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=itemOutManage&' + vc.objToGetParam($that.itemOutManageInfo.conditions));
            }
        }
    });
})(window.vc);