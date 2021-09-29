/**
    入驻小区
**/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            menuGroupManageInfo: {
                menuGroups: [],
                total: 0,
                records: 1,
                moreCondition: false,
                name: '',
                conditions: {
                    name: '',
                    icon: '',
                    label: '',
                    storeType: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {

            vc.on('menuGroupManage', 'listMenuGroup', function (_param) {
                vc.component._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMenuGroups(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenuGroups: function (_page, _rows) {

                vc.component.menuGroupManageInfo.conditions.page = _page;
                vc.component.menuGroupManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.menuGroupManageInfo.conditions
                };

                //发送get请求
                vc.http.get('menuGroupManage',
                    'list',
                    param,
                    function (json, res) {
                        var _menuGroupManageInfo = JSON.parse(json);
                        vc.component.menuGroupManageInfo.total = _menuGroupManageInfo.total;
                        vc.component.menuGroupManageInfo.records = _menuGroupManageInfo.records;
                        vc.component.menuGroupManageInfo.menuGroups = _menuGroupManageInfo.menuGroups;
                        vc.emit('pagination', 'init', {
                            total: vc.component.menuGroupManageInfo.records,
                            dataCount: vc.component.menuGroupManageInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMenuGroupModal: function () {
                vc.emit('addMenuGroup', 'openAddMenuGroupModal', {});
            },
            _openEditMenuGroupModel: function (_menuGroup) {
                vc.emit('editMenuGroup', 'openEditMenuGroupModal', _menuGroup);
            },
            _openDeleteMenuGroupModel: function (_menuGroup) {
                vc.emit('deleteMenuGroup', 'openDeleteMenuGroupModal', _menuGroup);
            },
            _queryMenuGroupMethod: function () {
                vc.component._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition: function () {
                if (vc.component.menuGroupManageInfo.moreCondition) {
                    vc.component.menuGroupManageInfo.moreCondition = false;
                } else {
                    vc.component.menuGroupManageInfo.moreCondition = true;
                }
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
