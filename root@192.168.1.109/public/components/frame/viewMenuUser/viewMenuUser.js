(function(vc, vm) {

    vc.extends({
        data: {
            viewMenuUserInfo: {
                menus: []

            }
        },
        _initMethod: function() {
            $that._listViewMenuUsers();

        },
        _initEvent: function() {

        },
        methods: {
            _listViewMenuUsers: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100
                    }
                };
                //发送get请求
                vc.http.apiGet('/menuUser.listMenuUser',
                    param,
                    function(json, res) {
                        let _menuUserManageInfo = JSON.parse(json);
                        vc.component.viewMenuUserInfo.menus = _menuUserManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _toUserMenu: function() {
                $('#viewMenuUserModel').modal('hide');
                vc.jumpToPage('/#/pages/frame/menuUserManage?tab=常用菜单');
            },
            _closeViewMenuUser: function() {
                $('#viewMenuUserModel').modal('hide');
            },
            _jumpToUserPage: function(_item) {
                $('#viewMenuUserModel').modal('hide');
                let _href = _item.url;

                if (_href.indexOf('?') > -1) {
                    _href += ("&tab=" + _item.name)
                } else {
                    _href += ("?tab=" + _item.name)
                }
                vc.jumpToPage(_href);
            }
        }
    });

})(window.vc, window.vc.component);