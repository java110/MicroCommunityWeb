/**
 入驻小区
 **/
(function (vc) {
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
        _initMethod: function () {
            vc.component.roomInfo.conditions.floorId = vc.getParam("floorId");
            vc.component.roomInfo.conditions.floorName = vc.getParam("floorName");
            //vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            //与字典表关联
            vc.getDict('building_room', "state", function (_data) {
                vc.component.roomInfo.states = _data;
            });

            //与字典表关联
            vc.getDict('building_room', "room_sub_type", function (_data) {
                vc.component.roomInfo.roomSubTypes = _data;
            });
            //根据 参数查询相应数据
            //vc.component._loadDataByParam();
        },
        _initEvent: function () {
            vc.on('room', 'switchFloor', function (_param) {
                vc.component.roomInfo.conditions.floorId = _param.floorId;
                vc.component.roomInfo.conditions.unitId = '';
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('room', 'switchUnit', function (_param) {
                vc.component.roomInfo.conditions.floorId = '';
                vc.component.roomInfo.conditions.unitId = _param.unitId;
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            });
            vc.on('room', 'listRoom', function (_param) {
                vc.component.listRoom($that.roomInfo.currentPage, DEFAULT_ROW);
            });
            vc.on('room', 'loadData', function (_param) {
                vc.component.listRoom($that.roomInfo.currentPage, DEFAULT_ROW);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that.roomInfo.currentPage = _currentPage;
                vc.component.listRoom(_currentPage, DEFAULT_ROW);
            });
        },
        methods: {
            listRoom: function (_page, _row) {
                vc.component.roomInfo.conditions.page = _page;
                vc.component.roomInfo.conditions.row = _row;
                vc.component.roomInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: JSON.parse(JSON.stringify(vc.component.roomInfo.conditions))
                };
                let _allNum = $that.roomInfo.conditions.roomId;
                let _allNums = _allNum.split('-')
                if (_allNums.length == 3) {
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                    param.params.roomId = '';
                    param.params.unitId = '';
                    param.params.floorId = '';
                }else if(_allNums.length >3){
                    param.params.floorNum = _allNums[0].trim();
                    param.params.unitNum = _allNums[1].trim();
                    param.params.roomNum = _allNums[2].trim();
                    for(let _numIndex = 3;_numIndex < _allNums.length;_numIndex++){
                        param.params.roomNum += ('-'+_allNums[_numIndex].trim());
                    }
                    param.params.roomId = '';
                    param.params.unitId = '';
                    param.params.floorId = '';
                }
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json, res) {
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
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddRoom: function () {
                vc.jumpToPage("/#/pages/property/addRoomBinding");
            },
            _openEditRoomModel: function (_room) {
                vc.emit('editRoom', 'openEditRoomModal', _room);
            },
            _openDelRoomModel: function (_room) {
                vc.emit('deleteRoom', 'openRoomModel', _room);
            },
            /**
             根据楼ID加载房屋
             **/
            loadUnits: function (_unitId, callBack) {
                vc.component.addRoomUnits = [];
                let param = {
                    params: {
                        unitId: _unitId,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                }
                vc.http.get(
                    'room',
                    'loadUnits',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            var tmpUnits = JSON.parse(json);
                            callBack(tmpUnits[0]);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _queryRoomMethod: function () {
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            },
            showState: function (_state) {
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
            _loadFloor: function (_floorId, callBack) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        floorId: _floorId
                    }
                }
                vc.http.get(
                    'room',
                    'loadFloor',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.total > 0) {
                            callBack(_json.apiFloorDataVoList[0]);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _moreCondition: function () {
                if (vc.component.roomInfo.moreCondition) {
                    vc.component.roomInfo.moreCondition = false;
                } else {
                    vc.component.roomInfo.moreCondition = true;
                }
            },
            _openChooseFloorMethod: function () {
                vc.emit('searchFloor', 'openSearchFloorModel', {});
            },
            dealRoomAttr: function (rooms) {
                $that._getColumns(rooms, function () {
                    rooms.forEach(item => {
                        $that._getColumnsValue(item);
                    });
                });
            },
            _getColumnsValue: function (_room) {
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
            _getColumns: function (_rooms, _call) {
                $that.roomInfo.listColumns = [];
                vc.getAttrSpec('building_room_attr', function (data) {
                    $that.roomInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.roomInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            },
            _openImportRoomInfo: function () {
                vc.emit('importOwnerRoom', 'openImportOwnerRoomModal', {})
            },
            _resetRoomInfo: function () {
                vc.resetObject($that.roomInfo.conditions);
                $that.roomInfo.conditions.roomType = '1010301';
                vc.component.listRoom(DEFAULT_PAGE, DEFAULT_ROW);
            },
            _openAddRoomFloorModal: function () {
                vc.emit('addFloor', 'openAddFloorModal', {});
            },
            _openUpdateRoomFloorModal: function () {
                if (!$that.roomInfo.conditions.floorId) {
                    vc.toast('请先选择楼栋');
                    return;
                }
                $that._loadFloor($that.roomInfo.conditions.floorId, function (_floor) {
                    vc.emit('editFloor', 'openEditFloorModal', _floor);
                })
            },
            _openDeleteRoomFloorModal: function () {
                if (!$that.roomInfo.conditions.floorId) {
                    vc.toast('请先选择楼栋');
                    return;
                }
                $that._loadFloor($that.roomInfo.conditions.floorId, function (_floor) {
                    vc.emit('deleteFloor', 'openFloorModel', _floor);
                })
            },
            _openAddRoomUnitModal: function () {
                if (!$that.roomInfo.conditions.floorId) {
                    vc.toast('请先选择楼栋');
                    return;
                }
                vc.emit('addUnit', 'addUnitModel', {
                    floorId: vc.component.roomInfo.conditions.floorId
                });
            },
            _openUpdateRoomUnitModal: function () {
                if (!$that.roomInfo.conditions.unitId) {
                    vc.toast('请先选择单元');
                    return;
                }
                $that.loadUnits($that.roomInfo.conditions.unitId, function (_unit) {
                    vc.emit('editUnit', 'openUnitModel', _unit);
                })
            },
            _openDeleteRoomUnitModal: function () {
                if (!$that.roomInfo.conditions.unitId) {
                    vc.toast('请先选择单元');
                    return;
                }
                $that.loadUnits($that.roomInfo.conditions.unitId, function (_unit) {
                    vc.emit('deleteUnit', 'openUnitModel', _unit);
                })
            },
            _openRoomCreateFeeComboModal: function (_room) {
                let _roomName = _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum;
                vc.jumpToPage('/#/pages/property/createFeeByCombo?payerObjId=' +
                    _room.roomId +
                    "&payerObjName=" + _roomName +
                    "&payerObjType=3333")
            },
        }
    });
})(window.vc);