/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            resourceStoreTypeManageInfo: {
                resourceStoreTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    rstId: '',
                    name: '',
                    description: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('resourceStoreTypeManage', 'listResourceStoreType', function (_param) {
                vc.component._listResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listResourceStoreTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            //查询方法
            _listResourceStoreTypes: function (_page, _rows) {
                vc.component.resourceStoreTypeManageInfo.conditions.page = _page;
                vc.component.resourceStoreTypeManageInfo.conditions.row = _rows;
                vc.component.resourceStoreTypeManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.resourceStoreTypeManageInfo.conditions
                };
                param.params.rstId = param.params.rstId.trim();
                param.params.name = param.params.name.trim();
                //发送post请求
                vc.http.apiGet('/resourceStoreType.listResourceStoreTypes',
                    param,
                    function (json, res) {
                        var _resourceStoreTypeManageInfo = JSON.parse(json);
                        vc.component.resourceStoreTypeManageInfo.total = _resourceStoreTypeManageInfo.total;
                        vc.component.resourceStoreTypeManageInfo.records = _resourceStoreTypeManageInfo.records;
                        vc.component.resourceStoreTypeManageInfo.resourceStoreTypes = _resourceStoreTypeManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.resourceStoreTypeManageInfo.records,
                            dataCount: vc.component.resourceStoreTypeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //重置方法
            _resetResourceStoreTypes: function (_page, _rows) {
                vc.component.resourceStoreTypeManageInfo.conditions.rstId = '';
                vc.component.resourceStoreTypeManageInfo.conditions.name = '';
                vc.component.resourceStoreTypeManageInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                $that._listResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddResourceStoreTypeModal: function () {
                vc.emit('addResourceStoreType', 'openAddResourceStoreTypeModal', {});
            },
            //二级分类
            _openAddResourceStoreType: function (_resourceStoreType) {
                vc.jumpToPage('/#/pages/property/listSonResourceStoreType?rstId=' + _resourceStoreType.rstId + "&name=" + _resourceStoreType.name);
            },
            _openDeleteResourceStoreTypeModel: function (_resourceStoreType) {
                vc.emit('deleteResourceStoreType', 'openDeleteResourceStoreTypeModal', _resourceStoreType);
            },
            _openEditResourceStoreTypeModel: function (_resourceStoreType) {
                vc.emit("editResourceStoreType", "openEditResourceStoreTypeModal", _resourceStoreType);
            },
            //查询
            _queryResourceStoreTypeMethod: function () {
                vc.component._listResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetResourceStoreTypeMethod: function () {
                vc.component._resetResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.resourceStoreTypeManageInfo.moreCondition) {
                    vc.component.resourceStoreTypeManageInfo.moreCondition = false;
                } else {
                    vc.component.resourceStoreTypeManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);