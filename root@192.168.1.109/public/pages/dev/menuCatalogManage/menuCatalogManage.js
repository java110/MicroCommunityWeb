/**
    入驻小区
**/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            menuCatalogManageInfo: {
                menuCatalogs: [],
                total: 0,
                records: 1,
                moreCondition: false,
                caId: '',
                conditions: {
                    name: '',
                    seq: '',
                    isShow: '',
                    storeType: ''

                }
            }
        },
        _initMethod: function() {
            vc.component._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function() {

            vc.on('menuCatalogManage', 'listMenuCatalog', function(_param) {
                vc.component._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listMenuCatalogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenuCatalogs: function(_page, _rows) {

                vc.component.menuCatalogManageInfo.conditions.page = _page;
                vc.component.menuCatalogManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.menuCatalogManageInfo.conditions
                };

                //发送get请求
                vc.http.apiGet('/menuCatalog.listMenuCatalog',
                    param,
                    function(json, res) {
                        var _menuCatalogManageInfo = JSON.parse(json);
                        vc.component.menuCatalogManageInfo.total = _menuCatalogManageInfo.total;
                        vc.component.menuCatalogManageInfo.records = _menuCatalogManageInfo.records;
                        vc.component.menuCatalogManageInfo.menuCatalogs = _menuCatalogManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.menuCatalogManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMenuCatalogModal: function() {
                vc.emit('addMenuCatalog', 'openAddMenuCatalogModal', {});
            },
            _openEditMenuCatalogModel: function(_menuCatalog) {
                vc.emit('editMenuCatalog', 'openEditMenuCatalogModal', _menuCatalog);
            },
            _openDeleteMenuCatalogModel: function(_menuCatalog) {
                vc.emit('deleteMenuCatalog', 'openDeleteMenuCatalogModal', _menuCatalog);
            },
            _queryMenuCatalogMethod: function() {
                vc.component._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function() {
                if (vc.component.menuCatalogManageInfo.moreCondition) {
                    vc.component.menuCatalogManageInfo.moreCondition = false;
                } else {
                    vc.component.menuCatalogManageInfo.moreCondition = true;
                }
            },
            _openMenuCatalogGroup: function(_menuCatalog) {
                vc.jumpToPage('/#/pages/dev/menuGroupCatalogManage?caId=' + _menuCatalog.caId + "&storeType=" + _menuCatalog.storeType + "&catalogName=" + _menuCatalog.name);
            },
            _getStoreTypeName: function(_storeTypeCd) {
                // <option value="800900000001">运营团队</option>
                // <option value="800900000002">代理商</option>
                // <option value="800900000003">物业</option>
                // <option value="800900000004">物流公司</option>
                // <option value="800900000005">商家</option>
                // <option value="800900000000">开发团队</option>

                if (_storeTypeCd == '800900000001') {
                    return "运营团队";
                } else if (_storeTypeCd == '800900000002') {
                    return "代理商";
                } else if (_storeTypeCd == '800900000003') {
                    return "物业";
                } else if (_storeTypeCd == '800900000004') {
                    return "物流公司";
                } else if (_storeTypeCd == '800900000005') {
                    return "商家";
                } else if (_storeTypeCd == '800900000000') {
                    return "开发团队";
                } else if (_storeTypeCd == '800900000006') {
                    return "跑腿";
                } else {
                    return "未知";
                }
            }


        }
    });
})(window.vc);