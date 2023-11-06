/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailOrgPrivilegeInfo: {
                privileges: [],
                orgs: [],
                communitys: [],
                roles: [],
                staffId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('staffDetailOrgPrivilege', 'switch', function (_data) {
                $that.staffDetailOrgPrivilegeInfo.staffId = _data.staffId;
                $that._loadStaffPrivileges(_data.staffId);
                $that._loadStaffOrgs();
                //$that._loadStaffCommunity();
                $that._loadStaffRole();
            });
            vc.on('staffDetailOrgPrivilege', 'notify', function (_data) {
                $that._loadOwnerDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffPrivileges: function () {
                let param = {
                    params: {
                        staffId: $that.staffDetailOrgPrivilegeInfo.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.user.privilege',
                    param,
                    function (json) {
                        let _staffDetailOrgPrivilegeInfo = JSON.parse(json);
                        vc.component.staffDetailOrgPrivilegeInfo.privileges = _staffDetailOrgPrivilegeInfo.datas;
                        $that._initJsTreePrivilege(_staffDetailOrgPrivilegeInfo.datas);
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreePrivilege: function (_privileges) {
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
                $('#jstree_privilege').on("loaded.jstree", function (e, data) {
                    console.log(data);
                    //默认合并
                    // $("#jstree_privilege").jstree("open_all");
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
            _doJsTreeMenuData: function (_groupItem) {
                let _privileges = $that.staffDetailOrgPrivilegeInfo.privileges;
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
            _doJsTreePrivilegeData: function (_menuItem) {
                let _privileges = $that.staffDetailOrgPrivilegeInfo.privileges;
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
            _loadStaffOrgs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        staffId: $that.staffDetailOrgPrivilegeInfo.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/user.listStaffOrgs',
                    param,
                    function (json) {
                        let _staffInfo = JSON.parse(json);
                        $that.staffDetailOrgPrivilegeInfo.orgs = _staffInfo.data
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadStaffRole: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 9999,
                        staffId: $that.staffDetailOrgPrivilegeInfo.staffId
                    }
                };
                //发送get请求
                vc.http.apiGet('/user.listStaffRoles',
                    param,
                    function (json) {
                        let _staffInfo = JSON.parse(json);
                        $that.staffDetailOrgPrivilegeInfo.roles = _staffInfo.data
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);