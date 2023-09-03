/**
 入驻小区
 **/
(function(vc) {
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
        _initMethod: function() {
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "state", function(_data) {
                $that.allocationStorehouseManageInfo.states = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.allocationStorehouseManageInfo.states.push(item);
                });
            });
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "apply_type", function(_data) {
                $that.allocationStorehouseManageInfo.applyTypes = _data;
            });
            $that._initDate();
            $that._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
        },
        _initEvent: function() {
            vc.on('allocationStorehouse', 'listAllocationStorehouse', function(_param) {
                $that._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('allocationStorehouseManage', 'listAllocationStorehouse', function(_param) {
                $that._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAllocationStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _initDate: function() {
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
                    .on('changeDate', function(ev) {
                        var value = $(".startTime").val();
                        $that.allocationStorehouseManageInfo.conditions.startTime = value;
                    });
                $('.endTime').datetimepicker()
                    .on('changeDate', function(ev) {
                        var value = $(".endTime").val();
                        $that.allocationStorehouseManageInfo.conditions.endTime = value;
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
            _listAllocationStorehouses: function(_page, _rows) {
                $that.allocationStorehouseManageInfo.conditions.page = _page;
                $that.allocationStorehouseManageInfo.conditions.row = _rows;
                $that.allocationStorehouseManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.allocationStorehouseManageInfo.conditions
                };
                param.params.applyId = param.params.applyId.trim();
                param.params.startUserId = param.params.startUserId.trim();
                param.params.startUserName = param.params.startUserName.trim();
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouseApplys',
                    param,
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.allocationStorehouseManageInfo.total = _json.total;
                        $that.allocationStorehouseManageInfo.records = _json.records;
                        $that.allocationStorehouseManageInfo.resourceStores = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.allocationStorehouseManageInfo.records,
                            dataCount: $that.allocationStorehouseManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationStorehouseMethod: function() {
                $that._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationStorehouseMethod: function() {
                $that.allocationStorehouseManageInfo.conditions.applyId = "";
                $that.allocationStorehouseManageInfo.conditions.startTime = "";
                $that.allocationStorehouseManageInfo.conditions.endTime = "";
                $that.allocationStorehouseManageInfo.conditions.state = "";
                $that.allocationStorehouseManageInfo.conditions.startUserId = "";
                $that.allocationStorehouseManageInfo.conditions.startUserName = "";
                $that.allocationStorehouseManageInfo.conditions.resId = "";
                $that.allocationStorehouseManageInfo.conditions.resName = "";
                $that.allocationStorehouseManageInfo.conditions.applyType = "";
                $that._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listStorehouses: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listStorehouses',
                    param,
                    function(json, res) {
                        let _storehouseManageInfo = JSON.parse(json);
                        $that.allocationStorehouseManageInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //取消调拨
            _openDeleteResourceStoreModel: function(_resourceStore) {
                vc.emit('deleteStorehouseManage', 'openDeleteStorehouseManageModal', _resourceStore);
            },
            //详情
            _toDetail: function(_item) {
                vc.jumpToPage("/#/pages/common/allocationStorehouseDetail?applyId=" + _item.applyId + '&applyType=' + _item.applyType + '&applyTypeName=' + _item.applyTypeName);
            },
            _openAllocationStorehouseApplyModal: function() {
                vc.jumpToPage("/#/pages/common/allocationStorehouseApply");
            },
            _openRunWorkflowImage: function(_purchaseApply) {
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        businessKey: _purchaseApply.applyId
                    }
                };
                //发送get请求
                vc.http.apiGet('/workflow.listRunWorkflowImage',
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
            _moreCondition: function() {
                if ($that.allocationStorehouseManageInfo.moreCondition) {
                    $that.allocationStorehouseManageInfo.moreCondition = false;
                } else {
                    $that.allocationStorehouseManageInfo.moreCondition = true;
                }
            },
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationStorehouse&' + vc.objToGetParam($that.allocationStorehouseManageInfo.conditions));
            },
            swatchState: function(_item) {
                $that.allocationStorehouseManageInfo.conditions.state = _item.statusCd;
                $that._listAllocationStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);