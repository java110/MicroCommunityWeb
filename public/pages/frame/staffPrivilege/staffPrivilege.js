(function(vc) {
    //员工权限
    vc.extends({
        data: {
            staffPrivilegeInfo: {
                privileges: [],
                _currentStaffId: '',
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('staffPrivilege', '_loadStaffPrivileges', function(_param) {
                vc.component._loadStaffPrivileges(_param);
            });
        },
        methods: {
            _loadStaffPrivileges: function(_param) {
                vc.component.staffPrivilegeInfo._currentStaffId = _param.staffId;
                var param = {
                    params: {
                        staffId: _param.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.user.privilege',
                    param,
                    function(json) {
                        var _staffPrivilegeInfo = JSON.parse(json);
                        vc.component.staffPrivilegeInfo.privileges = _staffPrivilegeInfo.datas;
                        $that._initJsTreePrivilege(_staffPrivilegeInfo.datas);

                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _openDeleteStaffPrivilegeModel: function(_staffPrivilege) {
                _staffPrivilege.staffId = vc.component.staffPrivilegeInfo._currentStaffId;
                vc.emit('deleteStaffPrivilege', 'openStaffPrivilegeModel', _staffPrivilege);
            },
            _initJsTreePrivilege: function(_privileges) {

                let _data = $that._doJsTreeData(_privileges);
                $.jstree.destroy()
                $("#jstree_privilege").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    'state': { //一些初始化状态
                        "opened": true,
                    },
                    'core': {
                        'data': _data
                    }
                });
                $('#jstree_privilege').on("loaded.jstree", function(e, data) {
                    console.log(data);
                    //默认合并
                    $("#jstree_privilege").jstree("open_all");
                });



            },
            _doJsTreeData: function(_privileges) {
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
                            id: 'g_' + pItem.gId,
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
            _doJsTreeMenuData: function(_groupItem) {
                let _privileges = $that.staffPrivilegeInfo.privileges;

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
                                id: 'm_' + _privileges[_pIndex].mId,
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
            _doJsTreePrivilegeData: function(_menuItem) {
                let _privileges = $that.staffPrivilegeInfo.privileges;
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
                            let _privilegeItem = {
                                id: 'p_' + _privileges[_pIndex].pId,
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
            },
        }
    });

})(window.vc);