/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROW = 10;
    vc.extends({
        data: {
            roomUnits: [],
            roomInfo: {
                rooms: [],
                total: 0,
                records: 1,
                floorId: '',
                unitId: '',
                states: [],
                roomNum: '',
                moreCondition: false,
                conditions: {
                    floorId: '',
                    floorName: '',
                    unitId: '',
                    roomNum: '',
                    roomId: '',
                    state: '',
                    section: '',
                    roomType: '1010301',
                    roomSubType: ''
                },
                currentPage: DEFAULT_PAGE,
                listColumns: [],
                roomSubTypes: []
            }
        },
        _initMethod: function() {
            vc.component.roomInfo.conditions.floorId = vc.getParam("floorId");
            vc.component.roomInfo.conditions.floorName = vc.getParam("floorName");
            vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            //与字典表关联
            vc.getDict('building_room', "state", function(_data) {
                vc.component.roomInfo.states = _data;
            });

            //与字典表关联
            vc.getDict('building_room', "room_sub_type", function(_data) {
                vc.component.roomInfo.roomSubTypes = _data;
            });
            //根据 参数查询相应数据
            //vc.component._loadDataByParam();
        },
        _initEvent: function() {
            vc.on('room', 'chooseFloor', function(_param) {
                vc.component.roomInfo.conditions.floorId = _param.floorId;
                vc.component.roomInfo.conditions.floorName = _param.floorName;
                vc.component.loadUnits(_param.floorId);
            });
            vc.on('room', 'listRoom', function(_param) {
                vc.component.listRoom($that.roomInfo.currentPage, DEFAULT_ROW);
            });
            vc.on('room', 'loadData', function(_param) {
                vc.component.listRoom($that.roomInfo.currentPage, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function(_currentPage) {
                $that.roomInfo.currentPage = _currentPage;
                vc.component.listRoom(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listRoom: function(_page, _row) {
                vc.component.roomInfo.conditions.page = _page;
                vc.component.roomInfo.conditions.row = _row;
                vc.component.roomInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: JSON.parse(JSON.stringify(vc.component.roomInfo.conditions))
                };
                let _allNum = $that.roomInfo.conditions.roomId;
                if (_allNum.split('-').length == 3) {
                    let _allNums = _allNum.split('-')
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                    param.params.roomId = '';
                }
                //发送get请求
                vc.http.get('room',
                    'listRoom',
                    param,
                    function(json, res) {
                        var listRoomData = JSON.parse(json);
                        vc.component.roomInfo.total = listRoomData.total;
                        vc.component.roomInfo.records = listRoomData.records;
                        vc.component.roomInfo.rooms = listRoomData.rooms;
                        $that.dealRoomAttr(listRoomData.rooms);
                        vc.emit('pagination', 'init', {
                            total: vc.component.roomInfo.records,
                            dataCount: vc.component.roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRoom: function() {
                vc.jumpToPage("/#/pages/property/addRoomBinding");
            },
            _openEditRoomModel: function(_room) {
                //_room.floorId = vc.component.roomInfo.conditions.floorId;
                vc.emit('editRoom', 'openEditRoomModal', _room);
            },
            _openDelRoomModel: function(_room) {
                //_room.floorId = vc.component.roomInfo.conditions.floorId;
                vc.emit('deleteRoom', 'openRoomModel', _room);
            },
            /**
             根据楼ID加载房屋
             **/
            loadUnits: function(_floorId) {
                vc.component.addRoomUnits = [];
                var param = {
                    params: {
                        floorId: _floorId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.get(
                    'room',
                    'loadUnits',
                    param,
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var tmpUnits = JSON.parse(json);
                            vc.component.roomUnits = tmpUnits;
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _queryRoomMethod: function() {
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            },
            showState: function(_state) {
                if (_state == '2001') {
                    return "已入住";
                } else if (_state == '2002') {
                    return "未入住";
                } else if (_state == '2003') {
                    return "已交定金";
                } else if (_state == '2004') {
                    return "已出租";
                } else {
                    return "未知";
                }
            },
            _loadDataByParam: function() {
                vc.component.roomInfo.conditions.floorId = vc.getParam("floorId");
                vc.component.roomInfo.conditions.floorId = vc.getParam("floorName");
                //如果 floodId 没有传 则，直接结束
                /* if(!vc.notNull(vc.component.roomInfo.conditions.floorId)){
                     return ;
                 }*/
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: vc.component.roomInfo.conditions.floorId
                    }
                }
                vc.http.get(
                    'room',
                    'loadFloor',
                    param,
                    function(json, res) {
                        if (res.status == 200) {
                            var _floorInfo = JSON.parse(json);
                            var _tmpFloor = _floorInfo.apiFloorDataVoList[0];
                            /*vc.emit('roomSelectFloor','chooseFloor', _tmpFloor);
                             */
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function() {
                if (vc.component.roomInfo.moreCondition) {
                    vc.component.roomInfo.moreCondition = false;
                } else {
                    vc.component.roomInfo.moreCondition = true;
                }
            },
            _openChooseFloorMethod: function() {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            dealRoomAttr: function(rooms) {
                $that._getColumns(rooms, function() {
                    rooms.forEach(item => {
                        $that._getColumnsValue(item);
                    });
                });
            },
            _getColumnsValue: function(_room) {
                _room.listValues = [];
                if (!_room.hasOwnProperty('roomAttrDto') || _room.roomAttrDto.length < 1) {
                    $that.roomInfo.listColumns.forEach(_value => {
                        _room.listValues.push('');
                    })
                    return;
                }
                let _roomAttrDtos = _room.roomAttrDto;
                $that.roomInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _roomAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _room.listValues.push(_tmpValue);
                })
            },
            _getColumns: function(_rooms, _call) {
                $that.roomInfo.listColumns = [];
                vc.getAttrSpec('building_room_attr', function(data) {
                    $that.roomInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.roomInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            },
            _openImportRoomInfo: function() {
                vc.emit('importOwnerRoom', 'openImportOwnerRoomModal', {})
            },
            _resetRoomInfo: function() {
                vc.resetObject($that.roomInfo.conditions);
                $that.roomInfo.conditions.roomType = '1010301';
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            }

        }
    });
})(window.vc);