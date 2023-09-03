(function (vc) {
    var default_row = 500;
    vc.extends({
        propTypes: {
            emitSelectRooms: vc.propTypes.string,
        },
        data: {
            selectRoomsInfo: {
                rooms: [],
                roomIds: [],
                records: 0,
                total: 0,
                conditions: {
                    roomName: '',
                    communityId: vc.getCurrentCommunity().communityId,
                    unitId: '',
                    floorId: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                }
            }
        },
        watch: {
            'selectRoomsInfo.roomIds': {
                deep: true,
                handler: function () {
                    vc.emit($props.emitSelectRooms, 'notifySelectRooms', $that.selectRoomsInfo.roomIds);
                }
            }
        },
        _initMethod: function () { },
        _initEvent: function () {
            vc.on('selectRooms', 'refreshTree', function (_param) {
                if (_param) {
                    $that.selectRoomsInfo.floorId = _param.floorId;
                }
                $that._loadSelectRoomsFloorAndUnits();
            });
            vc.on('selectRooms', 'switchFloor', function (_param) {
                $that.selectRoomsInfo.conditions.floorId = _param.floorId;
                if (_param.floorId) {
                    $that.listSelectRoom(1, default_row);
                    return;
                }
            });
            vc.on('selectRooms', 'switchUnit', function (_param) {
                $that.selectRoomsInfo.conditions.unitId = _param.unitId;
                if (_param.unitId) {
                    $that.listSelectRoom(1, default_row);
                    return;
                }
            });
            vc.on('selectRooms', 'deleteSelectFloor', function (_param) {
                let _unFloorId = _param.unFloorId;
                let _roomIds = $that.selectRoomsInfo.roomIds;
                let _tmpRoomIds = [];
                _roomIds.forEach(item => {
                    if (item.floorId != _unFloorId) {
                        _tmpRoomIds.push(item);
                    }
                });
                $that.selectRoomsInfo.roomIds = _tmpRoomIds;
                $that.computeSelectedRoomCount();
            });
            vc.on('selectRooms', 'deleteSelectUnit', function (_param) {
                let _unUnitId = _param.unUnitId;
                let _roomIds = $that.selectRoomsInfo.roomIds;
                let _tmpRoomIds = [];
                _roomIds.forEach(item => {
                    if (item.unitId != _unUnitId) {
                        _tmpRoomIds.push(item);
                    }
                });
                $that.selectRoomsInfo.roomIds = _tmpRoomIds;
                $that.computeSelectedRoomCount();
            });
        },
        methods: {
            _loadSelectRoomsFloorAndUnits: function () {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/floor.queryFloorAndUnits',
                    param,
                    function (json) {
                        let _unitInfo = JSON.parse(json);
                        $that.selectRoomsInfo.units = _unitInfo;
                        $that._initSelectRoomsJsTreeFloorUnit();
                    },
                    function () {
                        console.log('请求失败处理');
                    });
            },
            _initSelectRoomsJsTreeFloorUnit: function () {
                let _data = $that._doSelectRoomsJsTreeData();
                let _unitId = '';
                $that.selectRoomsInfo.units.forEach(item => {
                    if ($that.selectRoomsInfo.floorId && item.floorId == $that.selectRoomsInfo.floorId) {
                        _unitId = item.unitId;
                    }
                });
                $.jstree.destroy()
                $("#jstree_selectRooms_floorUnit").jstree({
                    "checkbox": {
                        "keep_selected_style": false
                    },
                    'state': { //一些初始化状态
                        "opened": false,
                    },
                    "plugins": ["checkbox"],
                    'core': {
                        'data': _data,
                        'check_callback': true,
                    },
                });
                $("#jstree_selectRooms_floorUnit").on("ready.jstree", function (e, data) {
                    //data.instance.open_all();//打开所有节点

                });

                $('#jstree_selectRooms_floorUnit').on("changed.jstree", function (e, data) {
                    if (data.action == 'model' || data.action == 'ready') {
                        //默认合并
                        $("#jstree_selectRooms_floorUnit").jstree("close_all");
                        return;
                    } else if (data.action == 'deselect_node') {
                        let _nodeId = data.node.id;
                        if (_nodeId.startsWith('f_')) {
                            vc.emit('selectRooms', 'switchFloor', {
                                floorId: '',
                                unFloorId: data.node.original.floorId
                            });
                            vc.emit('selectRooms', 'deleteSelectFloor', {
                                unFloorId: data.node.original.floorId
                            })
                        }
                        if (_nodeId.startsWith('u_')) {
                            vc.emit('selectRooms', 'deleteSelectUnit', {
                                unUnitId: data.node.original.unitId
                            })
                        }
                        vc.emit('selectRooms', 'switchUnit', {
                            unitId: '',
                            unUnitId: data.node.original.unitId
                        });

                        return;
                    }
                    let _selected = data.selected[0];
                    if (!_selected) {
                        return;
                    }
                    if (_selected.startsWith('f_')) {
                        vc.emit('selectRooms', 'switchFloor', {
                            floorId: data.node.original.floorId
                        })
                        return;
                    }
                    //console.log(_selected, data.node.original.unitId)
                    vc.emit('selectRooms', 'switchUnit', {
                        unitId: data.node.original.unitId
                    })
                });
            },
            _doSelectRoomsJsTreeData: function () {
                let _mFloorTree = [];
                let _units = $that.selectRoomsInfo.units;
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
                            text: pItem.floorNum,
                            state: {
                                opened: false,
                                selected: false
                            },
                            children: []
                        };
                        $that._doSelectRoomsJsTreeMenuData(_floorItem);
                        _mFloorTree.push(_floorItem);
                    }
                });
                return _mFloorTree;
            },
            _doSelectRoomsJsTreeMenuData: function (_floorItem) {
                let _units = $that.selectRoomsInfo.units;
                //构建菜单
                let _children = _floorItem.children;
                for (let _pIndex = 0; _pIndex < _units.length; _pIndex++) {
                    if (_floorItem.floorId == _units[_pIndex].floorId && _units[_pIndex].unitId) {
                        let _includeMenu = false;
                        for (let _mgIndex = 0; _mgIndex < _children.length; _mgIndex++) {
                            if (_units[_pIndex].unitId == _children[_mgIndex].unitId) {
                                _includeMenu = true;
                            }
                        }

                        if (_units[_pIndex].unitNum == "0") {
                            continue;
                        }
                        if (!_includeMenu) {
                            let _menuItem = {
                                id: 'u_' + _units[_pIndex].unitId,
                                unitId: _units[_pIndex].unitId,
                                text: _units[_pIndex].unitNum + "单元",
                                icon: "/img/unit.png",
                                state: {
                                    opened: false,
                                    selected: false
                                },
                            };
                            _children.push(_menuItem);
                        }
                    }
                }
            },
            listSelectRoom: function (_page, _row) {
                vc.component.selectRoomsInfo.conditions.page = _page;
                vc.component.selectRoomsInfo.conditions.row = _row;
                let param = {
                    params: JSON.parse(JSON.stringify(vc.component.selectRoomsInfo.conditions))
                };
                let _roomName = $that.selectRoomsInfo.conditions.roomName;
                let _roomNames = _roomName.split('-')
                if (_roomNames.length == 3) {
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                }
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        $that.selectRoomsInfo.total = listRoomData.total;
                        $that.selectRoomsInfo.records = listRoomData.records;
                        $that.selectRoomsInfo.rooms = listRoomData.rooms;
                        listRoomData.rooms.forEach(item => {
                            $that.selectRoomsInfo.roomIds.push(item);
                        });
                        $that.computeSelectedRoomCount();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            computeSelectedRoomCount: function (e) {
                let _selectNodeIds = $("#jstree_selectRooms_floorUnit").jstree('get_selected');
                if (!_selectNodeIds) {
                    return;
                }
                setTimeout(function () {
                    let _roomIds = $that.selectRoomsInfo.roomIds;
                    _selectNodeIds.forEach(item => {
                        if (item.startsWith("f_")) {
                            $that.computeFloorSelectRoomCount(item, _roomIds);
                        }
                        if (item.startsWith("u_")) {
                            $that.computeUnitSelectRoomCount(item, _roomIds);
                        }
                    })
                }, 1000);
            },
            computeFloorSelectRoomCount: function (_floorId, _roomIds) {
                let _count = 0;
                _roomIds.forEach(_room => {
                    if (("f_" + _room.floorId) == _floorId) {
                        _count += 1;
                    }
                });

                let _node = $("#jstree_selectRooms_floorUnit").jstree('get_node', _floorId);
                let _text = _node.text;
                if (_text.indexOf('(选择') > -1) {
                    _text = _text.substr(0, _text.indexOf('(选择'));
                }
                _text = _text + "(选择" + _count + "个房屋)";
                $("#jstree_selectRooms_floorUnit").jstree('rename_node', _node, _text);
            },
            computeUnitSelectRoomCount: function (_unitId, _roomIds) {
                let _count = 0;
                _roomIds.forEach(_room => {
                    if (("u_" + _room.unitId) == _unitId) {
                        _count += 1;
                    }
                });

                let _node = $("#jstree_selectRooms_floorUnit").jstree('get_node', _unitId);
                let _text = _node.text;
                if (_text.indexOf('(选择') > -1) {
                    _text = _text.substr(0, _text.indexOf('(选择'));
                }
                _text = _text + "(选择" + _count + "个房屋)";
                $("#jstree_selectRooms_floorUnit").jstree('rename_node', _node, _text);
            }
        }
    });
})(window.vc);