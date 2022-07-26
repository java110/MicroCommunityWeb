/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            privilegeTreeInfo: {
                privileges:[],
                _currentPgId:''
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('privilegeTree','loadPrivilege',function(_pgId){
                $that.privilegeTreeInfo._currentPgId = _pgId;
                $that._loadPrivilege(_pgId);
            });
        },
        methods: {
            addPrivilegeToPrivilegeGroup: function(_selectPrivileges) {
                if (_selectPrivileges.length < 1) {
                    vc.toast("请先选择权限");
                    return;
                }
                let _pIds = [];
                for (let selectIndex = 0; selectIndex < _selectPrivileges.length; selectIndex++) {
                    let _pId = {
                        pId: _selectPrivileges[selectIndex]
                    };
                    _pIds.push(_pId);
                }
                let _objData = {
                    pgId: vc.component.privilegeTreeInfo._currentPgId,
                    pIds: _pIds
                };
                vc.http.post(
                    'addPrivilege',
                    'addPrivilegeToPrivilegeGroup',
                    JSON.stringify(_objData), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            return;
                        }
                        vc.toast('失败')
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast('失败')
                    });
            },
            deletePrivilege: function(_selectPrivileges) {
                if (_selectPrivileges.length < 1) {
                    vc.toast("请先选择权限");
                    return;
                }
                var _pIds = [];
                for (var selectIndex = 0; selectIndex < _selectPrivileges.length; selectIndex++) {
                    var _pId = {
                        pId: _selectPrivileges[selectIndex]
                    };
                    _pIds.push(_pId);
                }
                var _objData = {
                    pgId: vc.component.privilegeTreeInfo._currentPgId,
                    pIds: _pIds
                };
                vc.http.post(
                    'deletePrivilege',
                    'delete',
                    JSON.stringify(_objData), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            return;
                        }
                        vc.toast('删除失败');
                    },
                    function(errInfo, error) {
                        vc.toast('删除失败');
                    });
            },
            _initJsTreePrivilege: function(_privileges) {

                let _data = $that._doJsTreeData(_privileges);
                $.jstree.destroy()
                $("#jstree_privilege").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    "plugins": ["checkbox"],
                    'state': { //一些初始化状态
                        "opened": false,
                    },
                    'core': {
                        'data': _data
                    }
                });
                $('#jstree_privilege').on("changed.jstree", function(e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        $("#jstree_privilege").jstree("close_all");
                        return;
                    }
                    let _selected = data.node.state.selected;
                    let _d = data.node.children_d;
                    if (_d.length < 1) {
                        _d.push(data.node.id);
                    }
                    let _selectPrivileges = [];
                    _d.forEach(_dItem => {
                        if (_dItem.indexOf('p_') > -1) {
                            _selectPrivileges.push(_dItem.substring(2));
                        }
                    });

                    if (_selectPrivileges.length < 1) {
                        return;
                    }

                    if (_selected) {
                        $that.addPrivilegeToPrivilegeGroup(_selectPrivileges);
                    } else {
                        $that.deletePrivilege(_selectPrivileges);
                    }
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
                let _privileges = $that.privilegeTreeInfo.privileges;
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
                let _privileges = $that.privilegeTreeInfo.privileges;
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
            _loadPrivilege: function(_pgId) {
                vc.component.privilegeTreeInfo.privileges = [];
                var param = {
                    params: {
                        pgId: _pgId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.get('addPrivilege',
                    'listNoAddPrivilege',
                    param,
                    function(json) {
                        let _privileges = JSON.parse(json);
                        vc.component.privilegeTreeInfo.privileges = _privileges;
                        $that._initJsTreePrivilege(_privileges);
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            

        }
    });
})(window.vc);