/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 30;
    vc.extends({
        data: {
            menuGroupManageInfo: {
                menuGroups: [],
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
                name: '',
                conditions: {
                    gId: '',
                    name: '',
                    icon: '',
                    label: '',
                    storeType: ''
                }
            }
        },
        _initMethod: function () {
            $that._swatchStoreType($that.menuGroupManageInfo.storeTYpes[0]);
        },
        _initEvent: function () {
            vc.on('menuGroupManage', 'listMenuGroup', function (_param) {
                $that._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listMenuGroups(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenuGroups: function (_page, _rows) {
                $that.menuGroupManageInfo.conditions.page = _page;
                $that.menuGroupManageInfo.conditions.row = _rows;
                let param = {
                    params: $that.menuGroupManageInfo.conditions
                };
                param.params.gId = param.params.gId.trim();
                param.params.name = param.params.name.trim();
                param.params.icon = param.params.icon.trim();
                //发送get请求
                vc.http.apiGet('/menuGroup.listMenuGroups',
                    param,
                    function (json, res) {
                        var _json = JSON.parse(json);
                        $that.menuGroupManageInfo.total = _json.total;
                        $that.menuGroupManageInfo.records = _json.records;
                        $that.menuGroupManageInfo.menuGroups = _json.menuGroups;
                        vc.emit('pagination', 'init', {
                            total: $that.menuGroupManageInfo.records,
                            dataCount: $that.menuGroupManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
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
            //查询
            _queryMenuGroupMethod: function () {
                $that._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMenuGroupMethod: function () {
                $that.menuGroupManageInfo.conditions.gId = "";
                $that.menuGroupManageInfo.conditions.name = "";
                $that.menuGroupManageInfo.conditions.icon = "";
                $that.menuGroupManageInfo.conditions.label = "";
                $that.menuGroupManageInfo.conditions.storeType = "";
                $that._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.menuGroupManageInfo.moreCondition) {
                    $that.menuGroupManageInfo.moreCondition = false;
                } else {
                    $that.menuGroupManageInfo.moreCondition = true;
                }
            },
            _swatchStoreType: function (_storeType) {
                $that.menuGroupManageInfo.conditions.storeType = _storeType.storeType;
                $that._listMenuGroups(DEFAULT_PAGE, DEFAULT_ROWS);
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