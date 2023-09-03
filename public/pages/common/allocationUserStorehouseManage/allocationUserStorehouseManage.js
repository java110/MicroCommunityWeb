/**
 入驻小区
 **/
(function(vc) {
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
                    parentRstId: '',
                    rstId: '',
                    rssId: '',
                    communityId: vc.getCurrentCommunity().communityId
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: [],
                resourceStoreSpecifications: []
            }
        },
        _initMethod: function() {
            $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
            $that._listResourceStoreSpecifications();
        },
        _initEvent: function() {
            vc.on('allocationUserStorehouseManage', 'listAllocationUserStorehouse', function(_param) {
                $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that._listAllocationUserStorehouses(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listAllocationUserStorehouses: function(_page, _rows) {
                $that.allocationUserStorehouseManageInfo.conditions.page = _page;
                $that.allocationUserStorehouseManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.allocationUserStorehouseManageInfo.conditions
                };
                param.params.resId = param.params.resId.trim();
                param.params.resName = param.params.resName.trim();
                param.params.acceptUserId = param.params.acceptUserId.trim();
                param.params.acceptUserName = param.params.acceptUserName.trim();
                //发送get请求
                vc.http.apiGet('/resourceStore.listAllocationUserStorehouses',
                    param,
                    function(json, res) {
                        var _allocationUserStorehouseManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.total = _allocationUserStorehouseManageInfo.total;
                        $that.allocationUserStorehouseManageInfo.records = _allocationUserStorehouseManageInfo.records;
                        $that.allocationUserStorehouseManageInfo.allocationUserStorehouses = _allocationUserStorehouseManageInfo.data;
                        if (_allocationUserStorehouseManageInfo.data.length > 0) {
                            $that.allocationUserStorehouseManageInfo.subTotalQuantity = _allocationUserStorehouseManageInfo.data[0].subTotalQuantity;
                            $that.allocationUserStorehouseManageInfo.highTotalQuantity = _allocationUserStorehouseManageInfo.data[0].highTotalQuantity;
                        } else {
                            $that.allocationUserStorehouseManageInfo.subTotalQuantity = "0";
                            $that.allocationUserStorehouseManageInfo.highTotalQuantity = "0";
                        }
                        vc.emit('pagination', 'init', {
                            total: $that.allocationUserStorehouseManageInfo.records,
                            dataCount: $that.allocationUserStorehouseManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _queryAllocationUserStorehouseMethod: function() {
                $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetAllocationUserStorehouseMethod: function() {
                $that.allocationUserStorehouseManageInfo.conditions.resId = "";
                $that.allocationUserStorehouseManageInfo.conditions.resName = "";
                $that.allocationUserStorehouseManageInfo.conditions.acceptUserId = "";
                $that.allocationUserStorehouseManageInfo.conditions.acceptUserName = "";
                $that.allocationUserStorehouseManageInfo.conditions.rstId = "";
                $that.allocationUserStorehouseManageInfo.conditions.parentRstId = "";
                $that.allocationUserStorehouseManageInfo.conditions.rssId = "";
                $that.allocationUserStorehouseManageInfo.resourceStoreSonTypes = [];
                $that.allocationUserStorehouseManageInfo.resourceStoreSpecifications = [];
                $that._listAllocationUserStorehouses(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listResourceStoreTypes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId:'0'
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSonTypes: function() {
                $that.allocationUserStorehouseManageInfo.conditions.rstId = '';
                $that.allocationUserStorehouseManageInfo.resourceStoreSonTypes = [];
                if ($that.allocationUserStorehouseManageInfo.conditions.parentRstId == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        parentId: $that.allocationUserStorehouseManageInfo.conditions.parentRstId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.resourceStoreSonTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listResourceStoreSpecifications: function() {
                $that.allocationUserStorehouseManageInfo.resourceStoreSpecifications = [];
                $that.allocationUserStorehouseManageInfo.conditions.rssId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        rstId: $that.allocationUserStorehouseManageInfo.conditions.rstId
                    }
                };

                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceStoreSpecifications',
                    param,
                    function(json, res) {
                        var _allocationUserStorehouseManageInfo = JSON.parse(json);
                        $that.allocationUserStorehouseManageInfo.resourceStoreSpecifications = _allocationUserStorehouseManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function() {
                if ($that.allocationUserStorehouseManageInfo.moreCondition) {
                    $that.allocationUserStorehouseManageInfo.moreCondition = false;
                } else {
                    $that.allocationUserStorehouseManageInfo.moreCondition = true;
                }
            },
            //导出
            _exportExcel: function() {
                vc.jumpToPage('/callComponent/exportReportFee/exportData?pagePath=allocationUserStorehouseManage&' + vc.objToGetParam($that.allocationUserStorehouseManageInfo.conditions));
            }
        }
    });
})(window.vc);