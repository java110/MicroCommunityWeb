(function(vc){
    let DEFAULT_PAGE = 1;
    let DEFAULT_ROW = 10;
    vc.extends({
        data:{
            roomTreeInfo: {
                units:[],
                callName:''
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('roomTree','openRoomTree',function(_param){
                $that.roomTreeInfo.callName = _param.callName;
                $('#roomTreeModal').modal('show');
                $that._loadRoomTreeFloorAndUnits();
            });
        },
        methods:{
            _loadRoomTreeFloorAndUnits: function() {

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
                        $that.roomTreeInfo.units = _unitInfo;
                        $that._initJsTreeRoomTreeFloorUnit();
                    },
                    function() {
                        console.log('请求失败处理');
                    });
            },
            _initJsTreeRoomTreeFloorUnit: function() {

                let _data = $that._doJsTreeRoomTreeData();

                _data = _data.sort(function(a, b) {
                    return a.floorNum - b.floorNum
                })
                $.jstree.destroy()
                $("#jstree_floorUnitRoom").jstree({
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
                $("#jstree_floorUnitRoom").on("ready.jstree", function(e, data) {
                    //data.instance.open_all();//打开所有节点
                    $('#jstree_floorUnitRoom').jstree('select_node', _data[0].children[0].id /* , true */ );

                });

                $('#jstree_floorUnitRoom').on("changed.jstree", function(e, data) {
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
                        $that._roomTreeLoadRoom(data.node.original.unitId,data);
                    }

                    if(_selected.startsWith('r_')){
                        $('#roomTreeModal').modal('hide');
                         vc.emit($that.roomTreeInfo.callName, 'selectRoom', {
                            roomName: data.node.original.roomName,
                            roomId:data.node.original.roomId
                        })
                    }
                });
            },
            _roomTreeLoadRoom:function(_unitId,data){
                //获取选中的节点
                let node = data.instance.get_node(data.selected[0]);
                //遍历选中节点的子节点
                let childNodes = data.instance.get_children_dom(node);
                if(childNodes && childNodes.length>0){
                    for(var childIndex = 0; childIndex<childNodes.length;childIndex++){
                        $('#jstree_floorUnitRoom').jstree('delete_node',  childNodes[childIndex]);
                    }
                }
                let param = {
                    params:{
                        page:1,
                        row:1000,
                        unitId:_unitId,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                }
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        if(listRoomData.total< 1){
                            return ;
                        }
                        listRoomData.rooms.forEach(_room =>{
                            let _text = _room.roomNum;
                            if(_room.ownerName){
                                _text +=('('+_room.ownerName+")") 
                            }
                            let _data = {
                                id: 'r_' + _room.roomId,
                                roomId: _room.roomId,
                                roomName:_room.floorNum+"-"+_room.unitNum+"-"+_room.roomNum,
                                text: _text,
                                icon: "/img/room.png",
                            };
                            $('#jstree_floorUnitRoom').jstree('create_node', $('#u_'+_unitId), _data, "last", false, false);	
                        })
                        $('#jstree_floorUnitRoom').jstree('open_node', $('#u_'+_unitId));
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _doJsTreeRoomTreeData: function() {
                let _mFloorTree = [];

                let _units = $that.roomTreeInfo.units;

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
                        $that._doJsTreeRoomTreeMenuData(_floorItem);
                        _mFloorTree.push(_floorItem);
                    }
                });
                return _mFloorTree;
            },
            _doJsTreeRoomTreeMenuData: function(_floorItem) {
                let _units = $that.roomTreeInfo.units;
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