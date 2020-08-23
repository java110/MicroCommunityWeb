(function (vc) {

    vc.extends({
        data: {
            privilegeInfo: {
                _currentPgId: "",
                _currentPgName: "",
                _pName: '',
                _currentStoreId: "9999",
                _privileges: []
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.component.$on('privilege_group_event', function (_pgObj) {
                vc.component.privilegeInfo._currentPgId = _pgObj._pgId;
                vc.component.privilegeInfo._currentPgName = _pgObj._pgName;
                vc.component.privilegeInfo._currentStoreId = _pgObj._storeId;
                //调用接口查询权限
                vc.component._loadPrivilege(_pgObj._pgId);
            });
            vc.component.$on('privilege_loadPrivilege', function (_pgId) {
                vc.component._loadPrivilege(_pgId);
            });
        },
        methods: {
            _loadPrivilege: function (_pgId) {
                vc.component.privilegeInfo._privileges = [];
                var param = {
                    params: {
                        pgId: _pgId,
                        name: vc.component.privilegeInfo._pName

                    }
                };

                //发送get请求
                vc.http.get('addPrivilege',
                    'listNoAddPrivilege',
                    param,
                    function (json) {
                        var _privileges = JSON.parse(json);
                        vc.component.privilegeInfo._privileges = _privileges;
                        $that._initJsTreePrivilege(_privileges);
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            openAddPrivilegeModel: function () {
                vc.component.$emit('addPrivilege_openPrivilegeModel', {
                    pgId: vc.component.privilegeInfo._currentPgId
                });
            },
            openDeletePrivilegeModel: function (_p) {
                _p.pgId = vc.component.privilegeInfo._currentPgId;
                vc.emit('deletePrivilege', 'openDeletePrivilegeModel', _p);
            },
            queryPrivilege: function () {
                vc.component._loadPrivilege(vc.component.privilegeInfo._currentPgId);
            },
            _initJsTreePrivilege: function (_privileges) {

                let _data = $that._doJsTreeData(_privileges);

                console.log('菜单', _data);

                $.jstree.destroy()

                $("#jstree_privilege").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"],
                    'core': {
                        'data': _data
                    }
                });
                $('#jstree_privilege').on("changed.jstree", function (e, data) {
                    console.log('点击', data);
                });

            },
            _doJsTreeData: function (_privileges) {
                let _mGroupTree = [];

                //构建 第一层菜单组
                _privileges.forEach(pItem => {
                    let _includeGroup = false;
                    for (let _mgIndex = 0; _mgIndex < _mGroupTree.length; _mgIndex++) {
                        if (pItem.gId == _mGroupTree[_mgIndex].gId) {
                            _includeGroup = true;
                        }
                    }

                    if (!_includeGroup) {
                        let _groupItem = {
                            gId: pItem.gId,
                            text: pItem.gName,
                            state: {
                                opened: false
                            },
                            children: []
                        };
                        $that._doJsTreeMenuData(_groupItem);
                        _mGroupTree.push(_groupItem);
                    }
                });
                return _mGroupTree;
            },
            _doJsTreeMenuData: function (_groupItem) {
                let _privileges = $that.privilegeInfo._privileges;
                //构建菜单
                let _children = _groupItem.children;
                for (let _pIndex = 0; _pIndex < _privileges.length; _pIndex++) {
                    if (_groupItem.gId == _privileges[_pIndex].gId) {
                        let _includeMenu = false;
                        for (let _mgIndex = 0; _mgIndex < _children.length; _mgIndex++) {
                            if (_privileges[_pIndex].mId == _children[_mgIndex].mId) {
                                _includeMenu = true;
                            }
                        }
                        if (!_includeMenu) {
                            let _menuItem = {
                                mId: _privileges[_pIndex].mId,
                                text: _privileges[_pIndex].mName,
                                state: {
                                    opened: false
                                },
                                children: []
                            };
                            $that._doJsTreePrivilegeData(_menuItem);
                            _children.push(_menuItem);
                        }

                    }
                }
            },
            _doJsTreePrivilegeData: function (_menuItem) {
                let _privileges = $that.privilegeInfo._privileges;
                //构建菜单
                let _children = _menuItem.children;
                for (let _pIndex = 0; _pIndex < _privileges.length; _pIndex++) {
                    if (_menuItem.mId == _privileges[_pIndex].mId) {
                        let _includePrivilege = false;
                        for (let _mIndex = 0; _mIndex < _children.length; _mIndex++) {
                            if (_privileges[_pIndex].pId == _children[_mIndex].pId) {
                                _includePrivilege = true;
                            }
                        }
                        if (!_includePrivilege) {
                            let _selected = false;
                            if (_privileges[_pIndex].pgId) {
                                _selected = true;
                            }
                            let _privilegeItem = {
                                pId: _privileges[_pIndex].pId,
                                text: _privileges[_pIndex].pName,
                                state: {
                                    opened: false,
                                    selected: _selected
                                }
                            };
                            _children.push(_privilegeItem);
                        }

                    }
                }
            }
        }
    });

})(window.vc);