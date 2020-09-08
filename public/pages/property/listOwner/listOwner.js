(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listOwnerInfo: {
                owners: [],
                total: 0,
                records: 1,
                moreCondition: false,
                _currentOwnerId: '',
                _eventName: '',
                conditions: {
                    ownerTypeCd: '1001',
                    ownerId: '',
                    name: '',
                    link: '',
                    idCard: '',
                    floorId: '',
                    floorName: '',
                    unitId: '',
                    roomNum: '',
                    roomId: '',
                    roomNum: '',
                },
                listColumns:[]
            }
        },
        _initMethod: function () {
            //加载 业主信息
            var _ownerId = vc.getParam('ownerId')

            if (vc.notNull(_ownerId)) {
                //vc.component.listOwnerInfo.conditions.ownerId = _ownerId;
            }
            $that._getColumns(function(){
                vc.component._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
        },
        _initEvent: function () {
            vc.on('listOwner', 'listOwnerData', function () {
                vc.component._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                vc.component._listOwnerData(_currentPage, DEFAULT_ROWS);
            });

            vc.on('listOwner', 'chooseRoom', function (_room) {
                if (vc.component.listOwnerInfo._eventName == 'PayPropertyFee') {
                    vc.jumpToPage("/admin.html#/pages/property/listRoomFee?" + vc.objToGetParam(_room));
                } else {
                    vc.jumpToPage("/admin.html#/pages/property/ownerRepairManage?ownerId=" + vc.component.listOwnerInfo._currentOwnerId + "&roomId=" + _room.roomId);
                }
            });

            vc.on('listOwner', 'chooseParkingSpace', function (_parkingSpace) {
                vc.jumpToPage("/admin.html#/pages/property/listParkingSpaceFee?" + vc.objToGetParam(_parkingSpace));
            });

            vc.on("listOwner", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    vc.component.listOwnerInfo.conditions.floorId = _param.floorId;
                }

                if (_param.hasOwnProperty("unitId")) {
                    vc.component.listOwnerInfo.conditions.unitId = _param.unitId;
                }

                if (_param.hasOwnProperty("roomId")) {
                    vc.component.listOwnerInfo.conditions.roomId = _param.roomId;
                    vc.component._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
                }
            });
        },
        methods: {
            _listOwnerData: function (_page, _row) {

                vc.component.listOwnerInfo.conditions.page = _page;
                vc.component.listOwnerInfo.conditions.row = _row;
                vc.component.listOwnerInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.listOwnerInfo.conditions
                }

                //发送get请求
                vc.http.get('listOwner',
                    'list',
                    param,
                    function (json, res) {
                        var listOwnerData = JSON.parse(json);

                        vc.component.listOwnerInfo.total = listOwnerData.total;
                        vc.component.listOwnerInfo.records = listOwnerData.records;
                        vc.component.listOwnerInfo.owners = listOwnerData.owners;
                        $that.dealOwnerAttr(listOwnerData.owners);
                        vc.emit('pagination', 'init', {
                            total: vc.component.listOwnerInfo.records,
                            dataCount: vc.component.listOwnerInfo.total,
                            currentPage: _page
                        });
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _openAddOwnerModal: function () { //打开添加框
                vc.emit('addOwner', 'openAddOwnerModal', -1);

                vc.component.listOwnerInfo.moreCondition = false;
            },
            _openDelOwnerModel: function (_owner) { // 打开删除对话框
                vc.emit('deleteOwner', 'openOwnerModel', _owner);
                vc.component.listOwnerInfo.moreCondition = false;
            },
            _openEditOwnerModel: function (_owner) {
                vc.emit('editOwner', 'openEditOwnerModal', _owner);
                vc.component.listOwnerInfo.moreCondition = false;
            },
            _queryOwnerMethod: function () {
                vc.component._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddOwnerRoom: function (_owner) {
                vc.jumpToPage("/admin.html#/pages/property/addOwnerRoomBinding?ownerId=" + _owner.ownerId);
            },
            _openHireParkingSpace: function (_owner) {
                vc.jumpToPage("/admin.html#/pages/property/hireParkingSpace?ownerId=" + _owner.ownerId);
            },
            _openSellParkingSpace: function (_owner) {
                vc.jumpToPage("/admin.html#/pages/property/sellParkingSpace?ownerId=" + _owner.ownerId);
            },
            _openOwnerDetailModel: function (_owner) {
                vc.jumpToPage("/admin.html#/pages/property/ownerDetail?ownerId=" + _owner.ownerId+"&ownerName="+_owner.name);
            },
            _openDeleteOwnerRoom: function (_owner) {
                vc.jumpToPage("/admin.html#/pages/property/deleteOwnerRoom?ownerId=" + _owner.ownerId);
            },
            _openOwnerRepair: function (_owner) {
                //查看 业主是否有多套房屋，如果有多套房屋，则提示对话框选择，只有一套房屋则直接跳转至交费页面缴费
                vc.component.listOwnerInfo._eventName = "OwnerRepair";
                vc.component.listOwnerInfo._currentOwnerId = _owner.ownerId; // 暂存如果有多个房屋是回调回来时 ownerId 会丢掉
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: _owner.ownerId
                    }
                }
                vc.http.get('listOwner',
                    'getRooms',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        var rooms = listRoomData.rooms;
                        if (rooms.length == 1) {
                            vc.jumpToPage("/admin.html#/pages/property/ownerRepairManage?ownerId=" + _owner.ownerId + "&roomId=" + rooms[0].roomId);
                        } else if (rooms.length == 0) {
                            //vc.toast("当前业主未查询到房屋信息");
                            vc.toast("当前业主未查询到房屋信息");
                        } else {

                            vc.emit('searchRoom', 'showOwnerRooms', rooms);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPayPropertyFee: function (_owner) {
                //查看 业主是否有多套房屋，如果有多套房屋，则提示对话框选择，只有一套房屋则直接跳转至交费页面缴费
                vc.component.listOwnerInfo._eventName = "PayPropertyFee";
                vc.component.listOwnerInfo._currentOwnerId = _owner.ownerId; // 暂存如果有多个房屋是回调回来时 ownerId 会丢掉
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: _owner.ownerId
                    }
                }
                vc.http.get('listOwner',
                    'getRooms',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        var rooms = listRoomData.rooms;
                        if (rooms.length == 1) {
                            vc.jumpToPage("/admin.html#/pages/property/listRoomFee?" + vc.objToGetParam(rooms[0]));

                        } else if (rooms.length == 0) {
                            //vc.toast("当前业主未查询到房屋信息");
                            vc.toast("当前业主未查询到房屋信息");
                        } else {

                            vc.emit('searchRoom', 'showOwnerRooms', rooms);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPayParkingSpaceFee: function (_owner) {
                //查看 业主是否有多套停车位，如果有多套停车位，则提示对话框选择，只有一套停车位则直接跳转至交费页面缴费

                vc.component.listOwnerInfo._currentOwnerId = _owner.ownerId; // 暂存如果有多个停车位是回调回来时 ownerId 会丢掉
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: _owner.ownerId
                    }
                }
                vc.http.get('listOwner',
                    'getParkingSpace',
                    param,
                    function (json, res) {
                        var listParkingSpaceData = JSON.parse(json);
                        var parkingSpaces = listParkingSpaceData.parkingSpaces;
                        if (parkingSpaces.length == 1) {
                            vc.jumpToPage("/admin.html#/pages/property/listParkingSpaceFee?" + vc.objToGetParam(parkingSpaces[0]));
                        } else if (parkingSpaces.length == 0) {
                            //vc.toast("当前业主未查询到车位信息");
                            vc.toast("当前业主未查询到车位信息");

                        } else {

                            vc.emit('searchParkingSpace', 'showOwnerParkingSpaces', parkingSpaces);
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if (vc.component.listOwnerInfo.moreCondition) {
                    vc.component.listOwnerInfo.moreCondition = false;
                } else {
                    vc.component.listOwnerInfo.moreCondition = true;
                }
            },
            dealOwnerAttr: function (owners) {  
                owners.forEach(item => {
                    $that._getColumnsValue(item);
                });
            },
            _getColumnsValue: function (_owner) {
                _owner.listValues = [];
                
                if (!_owner.hasOwnProperty('ownerAttrDtos') || _owner.ownerAttrDtos.length < 1) {
                    $that.listOwnerInfo.listColumns.forEach(_value => {
                        _owner.listValues.push('');
                    })
                    return;
                }

                let _ownerAttrDtos = _owner.ownerAttrDtos;

             

                $that.listOwnerInfo.listColumns.forEach(_value => {
                    let _tmpValue = '';
                    _ownerAttrDtos.forEach(_attrItem =>{
                        if(_value == _attrItem.specName){
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _owner.listValues.push(_tmpValue);
                })

            },
            _getColumns: function (_call) {
                console.log('_getColumns');
                $that.listOwnerInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    $that.listOwnerInfo.listColumns = [];
                    data.forEach(item => {
                        if(item.listShow == 'Y'){
                            $that.listOwnerInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
                
                // 循环所有房屋信息
                // for (let _ownerIndex = 0; _ownerIndex < _owners.length; _ownerIndex++) {
                //     let _owner = _owners[_ownerIndex];

                //     if (!_owner.hasOwnProperty('ownerAttrDtos')) {
                //         break;
                //     }
                //     let _ownerAttrDtos = _owner.ownerAttrDto;
                //     if (_ownerAttrDtos.length < 1) {
                //         break;
                //     }
                //     //获取房屋信息中 任意属性作为 列
                //     for (let _ownerAttrIndex = 0; _ownerAttrIndex < _ownerAttrDtos.length; _ownerAttrIndex++) {
                //         let attrItem = _ownerAttrDtos[_ownerAttrIndex];
                //         if (attrItem.listShow == 'Y') {
                //             $that.ownerInfo.listColumns.push(attrItem.specName);
                //         }
                //     }

                //     if ($that.ownerInfo.listColumns.length > 0) {
                //         break;
                //     }
                // }
            }
        }
    })
})(window.vc);