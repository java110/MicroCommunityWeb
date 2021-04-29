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
                resName: '',
                conditions: {
                    resId: '',
                    resName: '',
                    resCode: '',
                    shIda: '',
                    shIdz: ''
                },
                storehouses: []
            }
        },
        _initMethod: function () {
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
            //查询方法
            _listAllocationStorehouses: function (_page, _rows) {
                vc.component.allocationStorehouseManageInfo.conditions.page = _page;
                vc.component.allocationStorehouseManageInfo.conditions.row = _rows;
                vc.component.allocationStorehouseManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.allocationStorehouseManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.resCode = param.params.resCode.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationStorehouses',
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
                vc.jumpToPage("/admin.html#/pages/common/allocationStorehouseDetail?asId=" + _item.asId);
            },
            _moreCondition: function () {
                if (vc.component.allocationStorehouseManageInfo.moreCondition) {
                    vc.component.allocationStorehouseManageInfo.moreCondition = false;
                } else {
                    vc.component.allocationStorehouseManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
