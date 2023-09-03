/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            menuGroupCatalogManageInfo: {
                menuGroupCatalogs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                gcId: '',
                catalogName: '',
                conditions: {
                    caId: '',
                    gId: ''
                }
            }
        },
        _initMethod: function () {
            $that.menuGroupCatalogManageInfo.catalogName = vc.getParam('catalogName');
            $that.menuGroupCatalogManageInfo.conditions.caId = vc.getParam('caId');
            vc.component._listMenuGroupCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('menuGroupCatalogManage', 'listMenuGroupCatalog', function (_param) {
                vc.component._listMenuGroupCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMenuGroupCatalogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenuGroupCatalogs: function (_page, _rows) {
                vc.component.menuGroupCatalogManageInfo.conditions.page = _page;
                vc.component.menuGroupCatalogManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.menuGroupCatalogManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/menuGroupCatalog.listMenuGroupCatalog',
                    param,
                    function (json, res) {
                        var _menuGroupCatalogManageInfo = JSON.parse(json);
                        vc.component.menuGroupCatalogManageInfo.total = _menuGroupCatalogManageInfo.total;
                        vc.component.menuGroupCatalogManageInfo.records = _menuGroupCatalogManageInfo.records;
                        vc.component.menuGroupCatalogManageInfo.menuGroupCatalogs = _menuGroupCatalogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.menuGroupCatalogManageInfo.records,
                            dataCount: vc.component.menuGroupCatalogManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMenuGroupCatalogModal: function () {
                vc.emit('addMenuGroupCatalog', 'openAddMenuGroupCatalogModal', {});
            },
            _openEditMenuGroupCatalogModel: function (_menuGroupCatalog) {
                vc.emit('editMenuGroupCatalog', 'openEditMenuGroupCatalogModal', _menuGroupCatalog);
            },
            _openDeleteMenuGroupCatalogModel: function (_menuGroupCatalog) {
                vc.emit('deleteMenuGroupCatalog', 'openDeleteMenuGroupCatalogModal', _menuGroupCatalog);
            },
            _queryMenuGroupCatalogMethod: function () {
                vc.component._listMenuGroupCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.menuGroupCatalogManageInfo.moreCondition) {
                    vc.component.menuGroupCatalogManageInfo.moreCondition = false;
                } else {
                    vc.component.menuGroupCatalogManageInfo.moreCondition = true;
                }
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);