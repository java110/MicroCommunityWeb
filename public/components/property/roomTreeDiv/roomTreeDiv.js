(function(vc) {
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    vc.extends({
        data: {
            roomTreeDivInfo: {
                units: [],
                callName: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('roomTreeDiv', 'initRoomTreeDiv', function(_param) {
                $that.roomTreeDivInfo.callName = _param.callName;
                $that._loadRoomTreeDivFloorAndUnits();
            });
        },
        methods: {
            _loadRoomTreeDivFloorAndUnits: function() {
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
                        $that.roomTreeDivInfo.units = _unitInfo;
                        $that._initJsTreeRoomTreeDivFloorUnit();
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeRoomTreeDivFloorUnit: function() {
                let _data = $that._doJsTreeRoomTreeDivData();
                _data = _data.sort(function(a, b) {
                    return a.floorNum - b.floorNum
                })
                $.jstree.destroy()
                $("#jstree_floorUnitRoomDiv").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    'state': { //一些初始化状态
                        "opened": true,
                    },
                    'core': {
                        "check_callback": true,
                        'data': _data
                    }
                });
                $("#jstree_floorUnitRoomDiv").on("ready.jstree", function(e, data) {
                    //data.instance.open_all();//打开所有节点
                    $('#jstree_floorUnitRoomDiv').jstree('select_node', _data[0].children[0].id /* , true */ );

                });
                $('#jstree_floorUnitRoomDiv').on("changed.jstree", function(e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        //$("#jstree_floorUnit").jstree("close_all");
                        return;
                    }
                    let _selected = data.selected[0];
                    if (_selected.startsWith('f_')) {
                        return;
                    }
                    //console.log(_selected, data.node.original.unitId)
                    if (_selected.startsWith('u_')) {
                        $that._roomTreeDivLoadRoom(data.node.original.unitId, data);
                    }
                    if (_selected.startsWith('r_')) {
                        vc.emit($that.roomTreeDivInfo.callName, 'selectRoom', {
                            roomName: data.node.original.roomName,
                            roomId: data.node.original.roomId
                        })
                    }
                });
                $('#jstree_floorUnitRoomDiv')
                    .on('click', '.jstree-anchor', function(e) {
                        $(this).jstree(true).toggle_node(e.target);
                    })
            },
            _roomTreeDivLoadRoom: function(_unitId, data) {
                //获取选中的节点
                let node = data.instance.get_node(data.selected[0]);
                //遍历选中节点的子节点
                let childNodes = data.instance.get_children_dom(node);
                if (childNodes && childNodes.length > 0) {
                    for (var childIndex = 0; childIndex < childNodes.length; childIndex++) {
                        $('#jstree_floorUnitRoomDiv').jstree('delete_node', childNodes[childIndex]);
                    }
                }
                let param = {
                        params: {
                            page: 1,
                            row: 1000,
                            unitId: _unitId,
                            communityId: vc.getCurrentCommunity().communityId
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        if (listRoomData.total < 1) {
                            return;
                        }
                        listRoomData.rooms.forEach(_room => {
                            let _text = _room.roomNum;
                            if (_room.ownerName) {
                                _text += ('(' + _room.ownerName + ")")
                            }
                            let _data = {
                                id: 'r_' + _room.roomId,
                                roomId: _room.roomId,
                                roomName: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                                text: _text,
                                icon: "/img/room.png",
                            };
                            $('#jstree_floorUnitRoomDiv').jstree('create_node', $('#u_' + _unitId), _data, "last", false, false);
                        })
                        $('#jstree_floorUnitRoomDiv').jstree('open_node', $('#u_' + _unitId));
                        if (listRoomData.rooms && listRoomData.rooms.length > 0) {
                            vc.emit($that.roomTreeDivInfo.callName, 'selectRoom', {
                                roomName: listRoomData.rooms[0].floorNum + "-" + listRoomData.rooms[0].unitNum + "-" + listRoomData.rooms[0].roomNum,
                                roomId: listRoomData.rooms[0].roomId
                            })
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _doJsTreeRoomTreeDivData: function() {
                let _mFloorTree = [];
                let _units = $that.roomTreeDivInfo.units;
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
                            id: 'f_' + pItem.floorId,
                            floorId: pItem.floorId,
                            floorNum: pItem.floorNum,
                            icon: "/img/floor.png",
                            text: pItem.floorNum + "栋",
                            state: {
                                opened: false
                            },
                            children: []
                        };
                        $that._doJsTreeRoomTreeDivMenuData(_floorItem);
                        _mFloorTree.push(_floorItem);
                    }
                });
                return _mFloorTree;
            },
            _doJsTreeRoomTreeDivMenuData: function(_floorItem) {
                let _units = $that.roomTreeDivInfo.units;
                //构建菜单
                let _children = _floorItem.children;
                for (let _pIndex = 0; _pIndex < _units.length; _pIndex++) {
                    if (_floorItem.floorId == _units[_pIndex].floorId) {
                        let _includeMenu = false;
                        for (let _mgIndex = 0; _mgIndex < _children.length; _mgIndex++) {
                            if (_units[_pIndex].unitId == _children[_mgIndex].unitId) {
                                _includeMenu = true;
                            }
                        }
                        if (!_includeMenu) {
                            let _menuItem = {
                                id: 'u_' + _units[_pIndex].unitId,
                                unitId: _units[_pIndex].unitId,
                                text: _units[_pIndex].unitNum + "单元",
                                icon: "/img/unit.png",
                                state: {
                                    opened: true
                                },
                                children: []
                            };
                            _children.push(_menuItem);
                        }
                    }
                }
            },
        }
    });
})(window.vc);