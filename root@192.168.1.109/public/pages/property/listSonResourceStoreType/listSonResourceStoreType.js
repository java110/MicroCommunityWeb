/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            sonResourceStoreTypeInfo: {
                sonResourceStoreTypes: [],
                total: 0,
                records: 1,
                moreCondition: false,
                conditions: {
                    name: '',
                    rstName: '',
                    rsId: '',
                    rstId: '',
                    flag: '0'
                }
            }
        },
        _initMethod: function () {
            vc.component.sonResourceStoreTypeInfo.conditions.rstId = vc.getParam('rstId');
            vc.component.sonResourceStoreTypeInfo.conditions.name = vc.getParam('name');
            vc.component._listSonResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listSonResourceStoreType', 'listSonResourceStoreTypes', function (_param) {
                vc.component._listSonResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listSonResourceStoreTypes(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listSonResourceStoreTypes: function (_page, _rows) {
                vc.component.sonResourceStoreTypeInfo.conditions.page = _page;
                vc.component.sonResourceStoreTypeInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.sonResourceStoreTypeInfo.conditions
                };
                param.params.rsId = param.params.rsId.trim();
                param.params.rstName = param.params.rstName.trim();
                //发送get请求
                vc.http.get('resourceStoreTypeManage',
                    'list',
                    param,
                    function (json, res) {
                        var _sonResourceStoreTypeInfo = JSON.parse(json);
                        vc.component.sonResourceStoreTypeInfo.total = _sonResourceStoreTypeInfo.total;
                        vc.component.sonResourceStoreTypeInfo.records = _sonResourceStoreTypeInfo.records;
                        vc.component.sonResourceStoreTypeInfo.sonResourceStoreTypes = _sonResourceStoreTypeInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.sonResourceStoreTypeInfo.records,
                            dataCount: vc.component.sonResourceStoreTypeInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            //添加
            _openAddModal: function (rstId) {
                vc.emit('addResourceStoreType', 'openAddResourceStoreTypeModal', rstId);
            },
            //修改
            _openEditResourceStoreTypeModel: function (_sonResourceStoreType) {
                _sonResourceStoreType.flag = 1;
                vc.emit('editResourceStoreType', 'openEditResourceStoreTypeModal', _sonResourceStoreType);
            },
            //删除
            _openDeleteResourceStoreTypeModel: function (_sonResourceStoreType) {
                vc.emit('deleteResourceStoreType', 'openDeleteResourceStoreTypeModal', _sonResourceStoreType);
            },
            //查询
            _querySonResourceStoreTypeMethod: function () {
                vc.component._listSonResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetSonResourceStoreTypeMethod: function () {
                vc.component.sonResourceStoreTypeInfo.conditions.rsId = "";
                vc.component.sonResourceStoreTypeInfo.conditions.rstName = "";
                vc.component._listSonResourceStoreTypes(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.sonResourceStoreTypeInfo.moreCondition) {
                    vc.component.sonResourceStoreTypeInfo.moreCondition = false;
                } else {
                    vc.component.sonResourceStoreTypeInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
