/**
 入驻小区
 **/
(function(vc) {
    vc.extends({
        data: {
            floorUnitTreeInfo: {
                units: []
            }
        },
        _initMethod: function() {
            $that._loadFloorAndUnits();

        },
        _initEvent: function() {

        },
        methods: {

            _loadFloorAndUnits: function() {

                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/unit.queryUnits',
                    param,
                    function(json) {
                        let _unitInfo = JSON.parse(json);
                        $that.floorUnitTreeInfo.units = _unitInfo;
                        $that._initJsTreeFloorUnit();
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeFloorUnit: function() {

                let _data = $that._doJsTreeData();
                $.jstree.destroy()
                $("#jstree_floorUnit").jstree({
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
                $('#jstree_privilege').on("changed.jstree", function(e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        $("#jstree_floorUnit").jstree("close_all");
                        return;
                    }
                    // let _selected = data.node.state.selected;
                    // let _d = data.node.children_d;
                    // if (_d.length < 1) {
                    //     _d.push(data.node.id);
                    // }
                    // let _selectPrivileges = [];
                    // _d.forEach(_dItem => {
                    //     if (_dItem.indexOf('p_') > -1) {
                    //         _selectPrivileges.push(_dItem.substring(2));
                    //     }
                    // });

                    // if (_selectPrivileges.length < 1) {
                    //     return;
                    // }

                    // if (_selected) {
                    //     $that.addPrivilegeToPrivilegeFloor(_selectPrivileges);
                    // } else {
                    //     $that.deletePrivilege(_selectPrivileges);
                    // }
                });


            },
            _doJsTreeData: function() {
                let _mFloorTree = [];

                let _units = $that.floorUnitTreeInfo.units;

                //构建 第一层菜单组
                _units.forEach(pItem => {
                    let _includeFloor = false;
                    for (let _mgIndex = 0; _mgIndex < _mFloorTree.length; _mgIndex++) {
                        if (pItem.floorId == _mFloorTree[_mgIndex].floorId) {
                            _includeFloor = true;
                        }
                    }

                    if (!_includeFloor) {
                        let _floorItem = {
                            id: 'g_' + pItem.floorId,
                            floorId: pItem.floorId,
                            icon: "/img/floor.png",
                            text: pItem.floorNum + "栋",
                            state: {
                                opened: false
                            },
                            children: []
                        };
                        $that._doJsTreeMenuData(_floorItem);
                        _mFloorTree.push(_floorItem);
                    }
                });
                return _mFloorTree;
            },
            _doJsTreeMenuData: function(_floorItem) {
                let _units = $that.floorUnitTreeInfo.units;
                //构建菜单
                let _children = _floorItem.children;
                for (let _pIndex = 0; _pIndex < _units.length; _pIndex++) {
                    if (_floorItem.floorId == _units[_pIndex].floorId) {
                        let _includeMenu = false;
                        for (let _mgIndex = 0; _mgIndex < _children.length; _mgIndex++) {
                            if (_units[_pIndex].mId == _children[_mgIndex].mId) {
                                _includeMenu = true;
                            }
                        }
                        if (!_includeMenu) {
                            let _menuItem = {
                                id: 'm_' + _units[_pIndex].unitId,
                                unitId: _units[_pIndex].unitId,
                                text: _units[_pIndex].unitNum + "单元",
                                icon: "/img/unit.png",
                                state: {
                                    opened: true
                                }
                            };
                            _children.push(_menuItem);
                        }

                    }
                }
            },

        }
    });
})(window.vc);