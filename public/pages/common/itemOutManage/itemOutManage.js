/**
 出库申请
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
                    resName: '',
                    startTime: '',
                    endTime: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function() {
            //与字典表关联
            vc.getDict('purchase_apply', "state", function(_data) {
                $that.itemOutManageInfo.states = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.itemOutManageInfo.states.push(item);
                });
            });
            vc.initDateTime('startTime', function(_value) {
                $that.itemOutManageInfo.conditions.startTime = _value;
            });
            vc.initDateTime('endTime', function(_value) {
                $that.itemOutManageInfo.conditions.endTime = _value;
            })
            $that._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {
            vc.on('itemOutManage', 'listItemOut', function(_param) {
                $that._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listItemOuts(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listItemOuts: function(_page, _rows) {
                $that.itemOutManageInfo.conditions.page = _page;
                $that.itemOutManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.itemOutManageInfo.conditions
                };
                param.params.applyOrderId = param.params.applyOrderId.trim();
                param.params.userName = param.params.userName.trim();
                //发送get请求
                vc.http.apiGet('/purchaseApply.listPurchaseApplys',
                    param,
                    function(json, res) {
                        var _itemOutManageInfo = JSON.parse(json);
                        $that.itemOutManageInfo.total = _itemOutManageInfo.total;
                        $that.itemOutManageInfo.records = _itemOutManageInfo.records;
                        $that.itemOutManageInfo.itemOuts = _itemOutManageInfo.purchaseApplys;
                        vc.emit('pagination', 'init', {
                            total: $that.itemOutManageInfo.records,
                            dataCount: $that.itemOutManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddItemOutModal: function() {
                vc.jumpToPage("/#/pages/common/addItemOut?resOrderType=" + $that.itemOutManageInfo.conditions.resOrderType);
            },
            _openDetailItemOutModel: function(_itemOut) {
                vc.jumpToPage("/#/pages/common/purchaseApplyDetail?applyOrderId=" + _itemOut.applyOrderId + "&resOrderType=" + $that.itemOutManageInfo.conditions.resOrderType);
            },
            _openDeleteItemOutModel: function(_itemOut) {
                vc.emit('deleteItemOut', 'openDeleteItemOutModal', _itemOut);
            },
            _queryItemOutMethod: function() {
                $that._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function() {
                if ($that.itemOutManageInfo.moreCondition) {
                    $that.itemOutManageInfo.moreCondition = false;
                } else {
                    $that.itemOutManageInfo.moreCondition = true;
                }
            },
            //查询
            _queryInspectionPlanMethod: function() {
                $that._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetInspectionPlanMethod: function() {
                $that.itemOutManageInfo.conditions.applyOrderId = "";
                $that.itemOutManageInfo.conditions.state = "";
                $that.itemOutManageInfo.conditions.userName = "";
                $that._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
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
            },
            swatchState: function(_item) {
                $that.itemOutManageInfo.conditions.state = _item.statusCd;
                $that._listItemOuts(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);