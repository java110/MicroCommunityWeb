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
                $that.allocationStorehousesInfo.states = _data;
            });
            //与字典表关联
            vc.getDict('allocation_storehouse_apply', "apply_type", function (_data) {
                $that.allocationStorehousesInfo.applyTypes = [{
                    statusCd: '',
                    name: '全部'
                }];
                _data.forEach(item => {
                    $that.allocationStorehousesInfo.applyTypes.push(item);
                });
            });
            $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listStorehouses();
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('allocationStorehouseDetailed', '_listAllocationStore', function (_param) {
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listAllocationStores(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listAllocationStores: function (_page, _rows) {
                $that.allocationStorehousesInfo.conditions.page = _page;
                $that.allocationStorehousesInfo.conditions.row = _rows;
                $that.allocationStorehousesInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: $that.allocationStorehousesInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.applyId = param.params.applyId.trim();
                param.params.startUserId = param.params.startUserId.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationStorehouses',
                    param,
                    function (json, res) {
                        var _allocationStorehousesInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.total = _allocationStorehousesInfo.total;
                        $that.allocationStorehousesInfo.records = _allocationStorehousesInfo.records;
                        $that.allocationStorehousesInfo.resourceStores = _allocationStorehousesInfo.data;
                        vc.emit('pagination', 'init', {
                            total: $that.allocationStorehousesInfo.records,
                            dataCount: $that.allocationStorehousesInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationStorehouseMethod: function () {
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationStorehouseMethod: function () {
                $that.allocationStorehousesInfo.conditions.applyId = "";
                $that.allocationStorehousesInfo.conditions.shIda = "";
                $that.allocationStorehousesInfo.conditions.shIdz = "";
                $that.allocationStorehousesInfo.conditions.startUserId = "";
                $that.allocationStorehousesInfo.conditions.resId = "";
                $that.allocationStorehousesInfo.conditions.resName = "";
                $that.allocationStorehousesInfo.conditions.parentRstId = "";
                $that.allocationStorehousesInfo.conditions.rstId = "";
                $that.allocationStorehousesInfo.conditions.rssId = "";
                $that.allocationStorehousesInfo.conditions.state = "";
                $that.allocationStorehousesInfo.conditions.applyType = "";
                $that.allocationStorehousesInfo.resourceStoreSonTypes = [];
                $that.allocationStorehousesInfo.resourceStoreSpecifications = [];
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
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
                        $that.allocationStorehousesInfo.storehouses = _storehouseManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreTypes: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: '0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.allocationStorehousesInfo.resourceStoreTypes = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function () {
                $that.allocationStorehousesInfo.conditions.rstId = '';
                $that.allocationStorehousesInfo.resourceStoreSonTypes = [];
                if ($that.allocationStorehousesInfo.conditions.parentRstId == '') {
                    return;
                }
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.allocationStorehousesInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                $that.allocationStorehousesInfo.resourceStoreSpecifications = [];
                $that.allocationStorehousesInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.allocationStorehousesInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _allocationStorehousesInfo = JSON.parse(json);
                        $that.allocationStorehousesInfo.resourceStoreSpecifications = _allocationStorehousesInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.allocationStorehousesInfo.moreCondition) {
                    $that.allocationStorehousesInfo.moreCondition = false;
                } else {
                    $that.allocationStorehousesInfo.moreCondition = true;
                }
            },
            _exportExcel: function () {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationStorehouseDetail&' + vc.objToGetParam($that.allocationStorehousesInfo.conditions));
            },
            swatchApplyType: function (_item) {
                $that.allocationStorehousesInfo.conditions.applyType = _item.statusCd;
                $that._listAllocationStores(DEFAULT_PAGE, DEFAULT_ROWS);
            },
        }
    });
})(window.vc);