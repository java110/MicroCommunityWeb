/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            allocationUserStorehouseManageInfo: {
                allocationUserStorehouses: [],
                total: 0,
                records: 1,
                moreCondition: false,
                ausId: '',
                subTotalQuantity: '',
                highTotalQuantity: '',
                conditions: {
                    resId: '',
                    resName: '',
                    acceptUserId: '',
                    acceptUserName: '',
                    rstId: '',
                    rssId: ''
                },
                resourceStoreTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function () {
            vc.component._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function () {
            vc.on('allocationUserStorehouseManage', 'listAllocationUserStorehouse', function (_param) {
                vc.component._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listAllocationUserStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAllocationUserStorehouses: function (_page, _rows) {
                vc.component.allocationUserStorehouseManageInfo.conditions.page = _page;
                vc.component.allocationUserStorehouseManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.allocationUserStorehouseManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.acceptUserId = param.params.acceptUserId.trim();
                param.params.acceptUserName = param.params.acceptUserName.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listAllocationUserStorehouses',
                    param,
                    function (json, res) {
                        var _allocationUserStorehouseManageInfo = JSON.parse(json);
                        vc.component.allocationUserStorehouseManageInfo.total = _allocationUserStorehouseManageInfo.total;
                        vc.component.allocationUserStorehouseManageInfo.records = _allocationUserStorehouseManageInfo.records;
                        vc.component.allocationUserStorehouseManageInfo.allocationUserStorehouses = _allocationUserStorehouseManageInfo.data;
                        if (_allocationUserStorehouseManageInfo.data.length > 0) {
                            vc.component.allocationUserStorehouseManageInfo.subTotalQuantity = _allocationUserStorehouseManageInfo.data[0].subTotalQuantity;
                            vc.component.allocationUserStorehouseManageInfo.highTotalQuantity = _allocationUserStorehouseManageInfo.data[0].highTotalQuantity;
                        } else {
                            vc.component.allocationUserStorehouseManageInfo.subTotalQuantity = "0";
                            vc.component.allocationUserStorehouseManageInfo.highTotalQuantity = "0";
                        }
                        vc.emit('pagination', 'init', {
                            total: vc.component.allocationUserStorehouseManageInfo.records,
                            dataCount: vc.component.allocationUserStorehouseManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationUserStorehouseMethod: function () {
                vc.component._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationUserStorehouseMethod: function () {
                vc.component.allocationUserStorehouseManageInfo.conditions.resId = "";
                vc.component.allocationUserStorehouseManageInfo.conditions.resName = "";
                vc.component.allocationUserStorehouseManageInfo.conditions.acceptUserId = "";
                vc.component.allocationUserStorehouseManageInfo.conditions.acceptUserName = "";
                vc.component.allocationUserStorehouseManageInfo.conditions.rstId = "";
                vc.component.allocationUserStorehouseManageInfo.conditions.rssId = "";
                vc.component._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
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
                        vc.component.allocationUserStorehouseManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function () {
                vc.component.allocationUserStorehouseManageInfo.resourceStoreSpecifications = [];
                vc.component.allocationUserStorehouseManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: vc.component.allocationUserStorehouseManageInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function (json, res) {
                        var _allocationUserStorehouseManageInfo = JSON.parse(json);
                        vc.component.allocationUserStorehouseManageInfo.resourceStoreSpecifications = _allocationUserStorehouseManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.allocationUserStorehouseManageInfo.moreCondition) {
                    vc.component.allocationUserStorehouseManageInfo.moreCondition = false;
                } else {
                    vc.component.allocationUserStorehouseManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);
