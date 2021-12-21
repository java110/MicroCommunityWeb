/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationStorehousesInfo: {
                resourceStores: [],
                storehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                states: [],
                applyTypes: [],
                conditions: {
                    asId: '',
                    applyId: '',
                    resId: '',
                    resName: '',
                    resCode: '',
                    rssId: '',
                    parentRstId: '',
                    rstId: '',
                    shIda: '',
                    shIdz: '',
                    stock: '',
                    startUserId: '',
                    state: '',
                    applyType: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "state", function (_data) {
                vc.component.allocationStorehousesInfo.states = _data;
            });
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "apply_type", function (_data) {
                vc.component.allocationStorehousesInfo.applyTypes = _data;
            });
            vc.component._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('allocationStorehouseDetailed', '_listAllocationStore', function (_param) {
                vc.component._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAllocationStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listAllocationStores: function (_page, _rows) {
                vc.component.allocationStorehousesInfo.conditions.page = _page;
                vc.component.allocationStorehousesInfo.conditions.row = _rows;
                vc.component.allocationStorehousesInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.allocationStorehousesInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.applyId = param.params.applyId.trim();
                param.params.startUserId = param.params.startUserId.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        var _allocationStorehousesInfo = JSON.parse(json);
                        vc.component.allocationStorehousesInfo.total = _allocationStorehousesInfo.total;
                        vc.component.allocationStorehousesInfo.records = _allocationStorehousesInfo.records;
                        vc.component.allocationStorehousesInfo.resourceStores = _allocationStorehousesInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.allocationStorehousesInfo.records,
                            dataCount: vc.component.allocationStorehousesInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationStorehouseMethod: function () {
                vc.component._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationStorehouseMethod: function () {
                vc.component.allocationStorehousesInfo.conditions.applyId = "";
                vc.component.allocationStorehousesInfo.conditions.shIda = "";
                vc.component.allocationStorehousesInfo.conditions.shIdz = "";
                vc.component.allocationStorehousesInfo.conditions.startUserId = "";
                vc.component.allocationStorehousesInfo.conditions.resId = "";
                vc.component.allocationStorehousesInfo.conditions.resName = "";
                vc.component.allocationStorehousesInfo.conditions.parentRstId = "";
                vc.component.allocationStorehousesInfo.conditions.rstId = "";
                vc.component.allocationStorehousesInfo.conditions.rssId = "";
                vc.component.allocationStorehousesInfo.conditions.state = "";
                vc.component.allocationStorehousesInfo.conditions.applyType = "";
                vc.component.allocationStorehousesInfo.resourceStoreSonTypes = [];
                vc.component.allocationStorehousesInfo.resourceStoreSpecifications = [];
                vc.component._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
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
                        vc.component.allocationStorehousesInfo.storehouses = _storehouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypes: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.allocationStorehousesInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function () {
                vc.component.allocationStorehousesInfo.conditions.rstId = '';
                vc.component.allocationStorehousesInfo.resourceStoreSonTypes = [];
                if (vc.component.allocationStorehousesInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: vc.component.allocationStorehousesInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.allocationStorehousesInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                vc.component.allocationStorehousesInfo.resourceStoreSpecifications = [];
                vc.component.allocationStorehousesInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.allocationStorehousesInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _allocationStorehousesInfo = JSON.parse(json);
                        vc.component.allocationStorehousesInfo.resourceStoreSpecifications = _allocationStorehousesInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.allocationStorehousesInfo.moreCondition) {
                    vc.component.allocationStorehousesInfo.moreCondition = false;
                } else {
                    vc.component.allocationStorehousesInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationStorehouseDetail&' + vc.objToGetParam($that.allocationStorehousesInfo.conditions));
            }
        }
    });
})(window.vc);
