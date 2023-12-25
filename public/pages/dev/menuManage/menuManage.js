/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 30;
    vc.extends({
        data: {
            menuManageInfo: {
                menus: [],
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
                    gName: '',
                    gId: '',
                    mId: '',
                    mName: '',
                    pId: '',
                    pName: '',
                    domain: '',
                    uName: ''
                }
            }
        },
        _initMethod: function () {
            $that.menuManageInfo.conditions.mId = vc.getParam("mId");
            $that._swatchStoreType($that.menuManageInfo.storeTYpes[0]);
        },
        _initEvent: function () {
            vc.on('menuManage', 'chooseMenuGroup', function (_param) {
                if (_param.hasOwnProperty("name")) {
                    _param.gName = _param.name;
                }
                vc.copyObject(_param, $that.menuManageInfo.conditions);
            });
            vc.on('menuManage', 'listMenu', function (_param) {
                $that._listMenus(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that._listMenus(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenus: function (_page, _rows) {
                $that.menuManageInfo.conditions.page = _page;
                $that.menuManageInfo.conditions.row = _rows;
                var param = {
                    params: $that.menuManageInfo.conditions
                };
                param.params.gId = param.params.gId.trim();
                param.params.pId = param.params.pId.trim();
                param.params.pName = param.params.pName.trim();
                param.params.mId = param.params.mId.trim();
                param.params.mName = param.params.mName.trim();
                param.params.uName = param.params.uName.trim();
                //发送get请求
                vc.http.apiGet('/menu.listMenus',
                    param,
                    function (json, res) {
                        var _menuManageInfo = JSON.parse(json);
                        $that.menuManageInfo.total = _menuManageInfo.total;
                        $that.menuManageInfo.records = _menuManageInfo.records;
                        $that.menuManageInfo.menus = _menuManageInfo.menus;
                        vc.emit('pagination', 'init', {
                            total: $that.menuManageInfo.records,
                            dataCount: $that.menuManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMenuModal: function () {
                //vc.emit('addMenu','openAddMenuModal',{});
                vc.jumpToPage("/#/pages/dev/configMenu");
            },
            _openEditMenuModel: function (_menu) {
                vc.emit('editMenu', 'openEditMenuModal', _menu);
            },
            _openDeleteMenuModel: function (_menu) {
                vc.emit('deleteMenu', 'openDeleteMenuModal', _menu);
            },
            //查询
            _queryMenuMethod: function () {
                $that._listMenus(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMenuMethod: function () {
                $that.menuManageInfo.conditions.gName = "";
                $that.menuManageInfo.conditions.gId = "";
                $that.menuManageInfo.conditions.mId = "";
                $that.menuManageInfo.conditions.mName = "";
                $that.menuManageInfo.conditions.pId = "";
                $that.menuManageInfo.conditions.pName = "";
                $that.menuManageInfo.conditions.domain = "";
                $that.menuManageInfo.conditions.uName = "";
                $that._listMenus(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if ($that.menuManageInfo.moreCondition) {
                    $that.menuManageInfo.moreCondition = false;
                } else {
                    $that.menuManageInfo.moreCondition = true;
                }
            },
            _swatchStoreType: function (_storeType) {
                $that.menuManageInfo.conditions.domain = _storeType.storeType;
                $that._listMenus(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openPrivilegeModel: function (_menu) {
                vc.jumpToPage("/#/pages/dev/basePrivilegeManage?mId=" + _menu.mId);
            },
            _openChooseMenuGroupMethod: function () {
                vc.emit('chooseMenuGroup', 'openChooseMenuGroupModel', {});
            }
        }
    });
})(window.vc);