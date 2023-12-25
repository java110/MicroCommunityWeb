/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            menuCatalogManageInfo: {
                menuCatalogs: [],
                storeTYpes: [
                    {
                        name: '物业',
                        storeType: '800900000003'
                    }, {
                        name: '运营团队',
                        storeType: '800900000001'
                    }, {
                        name: '商家',
                        storeType: '800900000005'
                    }, {
                        name: '开发团队',
                        storeType: '800900000000'
                    },],
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
        _initMethod: function () {
            $that._swatchStoreType($that.menuCatalogManageInfo.storeTYpes[0]);
        },
        _initEvent: function () {
            vc.on('menuCatalogManage', 'listMenuCatalog', function (_param) {
                $that._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listMenuCatalogs(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenuCatalogs: function (_page, _rows) {
                $that.menuCatalogManageInfo.conditions.page = _page;
                $that.menuCatalogManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.menuCatalogManageInfo.conditions
                };
                param.params.name = param.params.name.trim();
                //发送get请求
                vc.http.apiGet('/menuCatalog.listMenuCatalog',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.menuCatalogManageInfo.total = _json.total;
                        $that.menuCatalogManageInfo.records = _json.records;
                        $that.menuCatalogManageInfo.menuCatalogs = _json.data;
                        vc.emit('pagination', 'init', {
                            total: $that.menuCatalogManageInfo.records,
                            dataCount: $that.menuCatalogManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMenuCatalogModal: function () {
                vc.emit('addMenuCatalog', 'openAddMenuCatalogModal', {});
            },
            _openEditMenuCatalogModel: function (_menuCatalog) {
                vc.emit('editMenuCatalog', 'openEditMenuCatalogModal', _menuCatalog);
            },
            _openDeleteMenuCatalogModel: function (_menuCatalog) {
                vc.emit('deleteMenuCatalog', 'openDeleteMenuCatalogModal', _menuCatalog);
            },
            //查询
            _queryMenuCatalogMethod: function () {
                $that._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMenuCatalogMethod: function () {
                $that.menuCatalogManageInfo.conditions.name = "";
                $that.menuCatalogManageInfo.conditions.storeType = "";
                $that.menuCatalogManageInfo.conditions.isShow = "";
                $that._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.menuCatalogManageInfo.moreCondition) {
                    $that.menuCatalogManageInfo.moreCondition = false;
                } else {
                    $that.menuCatalogManageInfo.moreCondition = true;
                }
            },
            _openMenuCatalogGroup: function (_menuCatalog) {
                vc.jumpToPage('/#/pages/dev/menuGroupCatalogManage?caId=' + _menuCatalog.caId + "&storeType=" + _menuCatalog.storeType + "&catalogName=" + _menuCatalog.name);
            },
            _swatchStoreType: function (_storeType) {
                $that.menuCatalogManageInfo.conditions.storeType = _storeType.storeType;
                $that._listMenuCatalogs(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getStoreTypeName: function (_storeTypeCd) {
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