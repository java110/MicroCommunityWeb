/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehouseManageInfo: {
                resourceStores: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: [],
                applyTypes: [],
                currentUserId: vc.getData('/nav/getUserInfo').userId,
                conditions: {
                    applyId: '',
                    resId: '',
                    resName: '',
                    resCode: '',
                    shIda: '',
                    shIdz: '',
                    startTime: '',
                    endTime: '',
                    startUserId: '',
                    startUserName: '',
                    state: '',
                    applyType: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                storehouses: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "state", function (_data) {
                vc.component.allocationStorehouseManageInfo.states = _data;
            });
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "apply_type", function (_data) {
                vc.component.allocationStorehouseManageInfo.applyTypes = _data;
            });
            vc.component._initDate();
            vc.component._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
        },
        _initEvent: function () {
            vc.on('allocationStorehouse', 'listAllocationStorehouse', function (_param) {
                vc.component._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('allocationStorehouseManage', 'listAllocationStorehouse', function (_param) {
                vc.component._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAllocationStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function () {
                $(".startTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.allocationStorehouseManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        vc.component.allocationStorehouseManageInfo.conditions.endTime = value;
                        let start = Date.parse(new Date($that.allocationStorehouseManageInfo.conditions.startTime))
                        let end = Date.parse(new Date($that.allocationStorehouseManageInfo.conditions.endTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.allocationStorehouseManageInfo.conditions.endTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName(' form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName(" form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            //查询方法
            _listAllocationStorehouses: function (_page, _rows) {
                vc.component.allocationStorehouseManageInfo.conditions.page = _page;
                vc.component.allocationStorehouseManageInfo.conditions.row = _rows;
                vc.component.allocationStorehouseManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.allocationStorehouseManageInfo.conditions
                };
                param.params.applyId = param.params.applyId.trim();
                param.params.startUserId = param.params.startUserId.trim();
                param.params.startUserName = param.params.startUserName.trim();
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStorehouseApplys',
                    param,
                    function (json, res) {
                        var _allocationStorehouseManageInfo = JSON.parse(json);
                        vc.component.allocationStorehouseManageInfo.total = _allocationStorehouseManageInfo.total;
                        vc.component.allocationStorehouseManageInfo.records = _allocationStorehouseManageInfo.records;
                        vc.component.allocationStorehouseManageInfo.resourceStores = _allocationStorehouseManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.allocationStorehouseManageInfo.records,
                            dataCount: vc.component.allocationStorehouseManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationStorehouseMethod: function () {
                vc.component._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationStorehouseMethod: function () {
                vc.component.allocationStorehouseManageInfo.conditions.applyId = "";
                vc.component.allocationStorehouseManageInfo.conditions.startTime = "";
                vc.component.allocationStorehouseManageInfo.conditions.endTime = "";
                vc.component.allocationStorehouseManageInfo.conditions.state = "";
                vc.component.allocationStorehouseManageInfo.conditions.startUserId = "";
                vc.component.allocationStorehouseManageInfo.conditions.startUserName = "";
                vc.component.allocationStorehouseManageInfo.conditions.resId = "";
                vc.component.allocationStorehouseManageInfo.conditions.resName = "";
                vc.component.allocationStorehouseManageInfo.conditions.applyType = "";
                vc.component._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listStorehouses: function (_page, _rows) {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('resourceStore.listStorehouses',
                    param,
                    function (json, res) {
                        var _storehouseManageInfo = JSON.parse(json);
                        vc.component.allocationStorehouseManageInfo.storehouses = _storehouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //取消调拨
            _openDeleteResourceStoreModel: function (_resourceStore) {
                vc.emit('deleteStorehouseManage', 'openDeleteStorehouseManageModal', _resourceStore);
            },
            //详情
            _toDetail: function (_item) {
                vc.jumpToPage("/admin.html#/pages/common/allocationStorehouseDetail?applyId=" + _item.applyId + '&applyType=' + _item.applyType + '&applyTypeName=' + _item.applyTypeName);
            },
            _openAllocationStorehouseApplyModal: function () {
                vc.jumpToPage("/admin.html#/pages/common/allocationStorehouseApplyManage");
            },
            _openRunWorkflowImage: function (_purchaseApply) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _purchaseApply.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('workflow.listRunWorkflowImage',
                    param,
                    function (json, res) {
                        var _workflowManageInfo = JSON.parse(json);
                        if (_workflowManageInfo.code != '0') {
                            vc.toast(_workflowManageInfo.msg);
                            return;
                        }
                        vc.emit('viewImage', 'showImage', {
                            url: 'data:image/png;base64,' + _workflowManageInfo.data
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.allocationStorehouseManageInfo.moreCondition) {
                    vc.component.allocationStorehouseManageInfo.moreCondition = false;
                } else {
                    vc.component.allocationStorehouseManageInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationStorehouse&' + vc.objToGetParam($that.allocationStorehouseManageInfo.conditions));
            }
        }
    });
})(window.vc);
