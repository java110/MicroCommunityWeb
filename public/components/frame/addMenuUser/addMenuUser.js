(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMenuUserInfo: {
                mId: '',
                icon: '',
                seq: '',
                menus: [],
            }
        },
        _initMethod: function() {
            $that._loadUserMenus();

        },
        _initEvent: function() {
            vc.on('addMenuUser', 'openAddMenuUserModal', function() {
                $('#addMenuUserModel').modal('show');
            });
        },
        methods: {
            addMenuUserValidate() {
                return vc.validate.validate({
                    addMenuUserInfo: vc.component.addMenuUserInfo
                }, {
                    'addMenuUserInfo.mId': [{
                            limit: "required",
                            param: "",
                            errInfo: "菜单不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "菜单不能超过30"
                        },
                    ],
                    'addMenuUserInfo.icon': [{
                            limit: "required",
                            param: "",
                            errInfo: "图标不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "图标不能超过128"
                        },
                    ],
                    'addMenuUserInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "列顺序'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "列顺序'不能超过11"
                        },
                    ],
                });
            },
            saveMenuUserInfo: function() {
                if (!vc.component.addMenuUserValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.http.apiPost(
                    '/menuUser.saveMenuUser',
                    JSON.stringify(vc.component.addMenuUserInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMenuUserModel').modal('hide');
                            vc.component.clearAddMenuUserInfo();
                            vc.emit('menuUserManage', 'listMenuUser', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddMenuUserInfo: function() {
                let _menus = $that.addMenuUserInfo.menus;
                vc.component.addMenuUserInfo = {
                    mId: '',
                    icon: '',
                    seq: '',
                    menus: _menus,
                };
            },
            _loadUserMenus: function() {
                let _param = {
                    params: {
                        a: 123
                    }
                }
                let _newMenus = []
                    //发送get请求
                vc.http.apiGet('/menu.listCatalogMenus',
                    _param,
                    function(json, res) {
                        let _menuData = JSON.parse(json);
                        if (_menuData.code != 0) {
                            return;
                        }
                        let _menus = _menuData.data;
                        if (_menus == null || _menus.length == 0) {
                            return;
                        }
                        _menus.sort(function(a, b) {
                            return a.seq - b.seq
                        });

                        _menus.forEach(item => {
                            item.childs.forEach(child => {
                                child.menuGroupName = item.name;
                                _newMenus.push(child);
                            })
                        });

                        $that.addMenuUserInfo.menus = _newMenus;

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc);