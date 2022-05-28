/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            menuUserManageInfo: {
                menuUsers: [],
                total: 0,
                records: 1,
                moreCondition: false,
                muId: '',
                conditions: {
                    muId: '',
                    mId: '',
                    seq: ''
                }
            }
        },
        _initMethod: function () {
            vc.component._listMenuUsers(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('menuUserManage', 'listMenuUser', function (_param) {
                vc.component._listMenuUsers(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listMenuUsers(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {
            _listMenuUsers: function (_page, _rows) {
                vc.component.menuUserManageInfo.conditions.page = _page;
                vc.component.menuUserManageInfo.conditions.row = _rows;
                var param = {
                    params: vc.component.menuUserManageInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/menuUser.listMenuUser',
                    param,
                    function (json, res) {
                        var _menuUserManageInfo = JSON.parse(json);
                        vc.component.menuUserManageInfo.total = _menuUserManageInfo.total;
                        vc.component.menuUserManageInfo.records = _menuUserManageInfo.records;
                        vc.component.menuUserManageInfo.menuUsers = _menuUserManageInfo.data;
                        vc.emit('pagination', 'init', {
                            total: vc.component.menuUserManageInfo.records,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddMenuUserModal: function () {
                vc.emit('addMenuUser', 'openAddMenuUserModal', {});
            },
            _openDeleteMenuUserModel: function (_menuUser) {
                vc.emit('deleteMenuUser', 'openDeleteMenuUserModal', _menuUser);
            },
            //查询
            _queryMenuUserMethod: function () {
                vc.component._listMenuUsers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetMenuUserMethod: function () {
                vc.component.menuUserManageInfo.conditions.muId = "";
                vc.component.menuUserManageInfo.conditions.mId = "";
                vc.component.menuUserManageInfo.conditions.seq = "";
                vc.component._listMenuUsers(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _moreCondition: function () {
                if (vc.component.menuUserManageInfo.moreCondition) {
                    vc.component.menuUserManageInfo.moreCondition = false;
                } else {
                    vc.component.menuUserManageInfo.moreCondition = true;
                }
            }
        }
    });
})(window.vc);