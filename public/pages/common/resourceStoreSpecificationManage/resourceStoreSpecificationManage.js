/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceStoreSpecificationManageInfo: {
                resourceStoreSpecifications: [],
                total: 0,
                records: 1,
                moreCondition: false,
                rssId: '',
                conditions: {
                    specName: '',
                    parentRstId: '',
                    rstId: '',
                    rssId: '',
                },
                resourceStoreTypes: [],
                resourceStoreSonTypes: []
            }
        },
        _initMethod: function() {
            vc.component._listResourceStoreSpecifications(DEFAULT_PAGE, DEFAULT_ROWS);
            $that._listResourceStoreTypes();
        },
        _initEvent: function() {
            vc.on('resourceStoreSpecificationManage', 'listResourceStoreSpecification', function(_param) {
                vc.component._listResourceStoreSpecifications(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listResourceStoreSpecifications(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listResourceStoreSpecifications: function(_page, _rows) {
                vc.component.resourceStoreSpecificationManageInfo.conditions.page = _page;
                vc.component.resourceStoreSpecificationManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.resourceStoreSpecificationManageInfo.conditions
                };
                param.params.specName = param.params.specName.trim();
                param.params.rssId = param.params.rssId.trim();
                //发送get请求
                vc.http.apiGet('resourceStore.listResourceStoreSpecifications',
                    param,
                    function(json, res) {
                        var _resourceStoreSpecificationManageInfo = JSON.parse(json);
                        vc.component.resourceStoreSpecificationManageInfo.total = _resourceStoreSpecificationManageInfo.total;
                        vc.component.resourceStoreSpecificationManageInfo.records = _resourceStoreSpecificationManageInfo.records;
                        vc.component.resourceStoreSpecificationManageInfo.resourceStoreSpecifications = _resourceStoreSpecificationManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceStoreSpecificationManageInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.resourceStoreSpecificationManageInfo.total
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //添加
            _openAddResourceStoreSpecificationModal: function() {
                vc.emit('addResourceStoreSpecification', 'openAddResourceStoreSpecificationModal', {});
            },
            //修改
            _openEditResourceStoreSpecificationModel: function(_resourceStoreSpecification) {
                vc.emit('editResourceStoreSpecification', 'openEditResourceStoreSpecificationModal', _resourceStoreSpecification);
            },
            //删除
            _openDeleteResourceStoreSpecificationModel: function(_resourceStoreSpecification) {
                vc.emit('deleteResourceStoreSpecification', 'openDeleteResourceStoreSpecificationModal', _resourceStoreSpecification);
            },
            //查询
            _queryResourceStoreSpecificationMethod: function() {
                vc.component._listResourceStoreSpecifications(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreSpecificationMethod: function() {
                vc.component.resourceStoreSpecificationManageInfo.conditions.rstId = '';
                vc.component.resourceStoreSpecificationManageInfo.conditions.specName = '';
                vc.component.resourceStoreSpecificationManageInfo.conditions.parentRstId = '';
                vc.component.resourceStoreSpecificationManageInfo.conditions.rssId = '';
                vc.component.resourceStoreSpecificationManageInfo.resourceStoreSonTypes = [];
                $that._listResourceStoreSpecifications(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _listResourceStoreTypes: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.resourceStoreSpecificationManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            // 父级分类改变
            resourceStoreParentTypesChange: function() {
                vc.component.resourceStoreSpecificationManageInfo.conditions.rstId = '';
                if (vc.component.resourceStoreSpecificationManageInfo.conditions.parentRstId == '') {
                    vc.component.resourceStoreSpecificationManageInfo.resourceStoreSonTypes = [];
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        rstId: vc.component.resourceStoreSpecificationManageInfo.conditions.parentRstId,
                        flag: "0"
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function(json, res) {
                        var _resourceStoreTypeInfo = JSON.parse(json);
                        vc.component.resourceStoreSpecificationManageInfo.resourceStoreSonTypes = _resourceStoreTypeInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function() {
                if (vc.component.resourceStoreSpecificationManageInfo.moreCondition) {
                    vc.component.resourceStoreSpecificationManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceStoreSpecificationManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);