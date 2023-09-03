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
                    address: '',
                    floorId: '',
                    floorName: '',
                    unitId: '',
                    roomNum: '',
                    roomId: '',
                    roomName: '',
                    memberName:'',
                    memberLink:''
                },
                currentPage: DEFAULT_PAGE,
                listColumns: []
            }
        },
        _initMethod: function () {
            //加载 业主信息
            var _ownerId = vc.getParam('ownerId')
            if (vc.notNull(_ownerId)) {
                //$that.listOwnerInfo.conditions.ownerId = _ownerId;
            }
            $that._getColumns(function () {
                $that._listOwnerData($that.listOwnerInfo.currentPage, DEFAULT_ROWS);
            });
        },
        _initEvent: function () {
            vc.on('listOwner', 'listOwnerData', function () {
                $that._listOwnerData($that.listOwnerInfo.currentPage, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event', function (_currentPage) {
                $that.listOwnerInfo.currentPage = _currentPage;
                $that._listOwnerData(_currentPage, DEFAULT_ROWS);
            });
            vc.on('listOwner', 'chooseRoom', function (_room) {
                if ($that.listOwnerInfo._eventName == 'PayPropertyFee') {
                    vc.jumpToPage("/#/pages/property/listRoomFee?" + vc.objToGetParam(_room));
                } else {
                    vc.jumpToPage("/#/pages/property/ownerRepairManage?ownerId=" + $that.listOwnerInfo._currentOwnerId + "&roomId=" + _room.roomId);
                }
            });
            vc.on('listOwner', 'chooseParkingSpace', function (_parkingSpace) {
                vc.jumpToPage("/#/pages/property/listParkingSpaceFee?" + vc.objToGetParam(_parkingSpace));
            });
            vc.on("listOwner", "notify", function (_param) {
                if (_param.hasOwnProperty("floorId")) {
                    $that.listOwnerInfo.conditions.floorId = _param.floorId;
                }
                if (_param.hasOwnProperty("unitId")) {
                    $that.listOwnerInfo.conditions.unitId = _param.unitId;
                }
                if (_param.hasOwnProperty("roomId")) {
                    $that.listOwnerInfo.conditions.roomId = _param.roomId;
                    $that._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
                }
            });
        },
        methods: {
            _listOwnerData: function (_page, _row) {
                $that.listOwnerInfo.conditions.page = _page;
                $that.listOwnerInfo.conditions.row = _row;
                $that.listOwnerInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                let param = {
                    params: $that.listOwnerInfo.conditions
                }
                param.params.name = param.params.name.trim();
                param.params.roomName = param.params.roomName.trim();
                param.params.link = param.params.link.trim();
                param.params.ownerId = param.params.ownerId.trim();
                param.params.idCard = param.params.idCard.trim();
                //发送get请求
                vc.http.apiGet('/owner.queryOwners',
                    param,
                    function (json, res) {
                        var listOwnerData = JSON.parse(json);
                        $that.listOwnerInfo.total = listOwnerData.total;
                        $that.listOwnerInfo.records = listOwnerData.records;
                        $that.listOwnerInfo.owners = listOwnerData.owners;
                        $that.dealOwnerAttr(listOwnerData.owners);
                        vc.emit('pagination', 'init', {
                            total: $that.listOwnerInfo.records,
                            dataCount: $that.listOwnerInfo.total,
                            currentPage: _page
                        });
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openAddOwnerModal: function () { //打开添加框
                vc.emit('addOwner', 'openAddOwnerModal', -1);
                $that.listOwnerInfo.moreCondition = false;
            },
            _openDelOwnerModel: function (_owner) { // 打开删除对话框
                vc.emit('deleteOwner', 'openOwnerModel', _owner);
                $that.listOwnerInfo.moreCondition = false;
            },
            _openEditOwnerModel: function (_owner) {
                vc.emit('editOwner', 'openEditOwnerModal', _owner);
                $that.listOwnerInfo.moreCondition = false;
            },
            //查询
            _queryOwnerMethod: function () {
                $that._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //重置
            _resetOwnerMethod: function () {
                $that.listOwnerInfo.conditions.name = "";
                $that.listOwnerInfo.conditions.roomName = "";
                $that.listOwnerInfo.conditions.link = "";
                $that.listOwnerInfo.conditions.ownerId = "";
                $that.listOwnerInfo.conditions.idCard = "";
                $that._listOwnerData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openAddOwnerRoom: function (_owner) {
                vc.jumpToPage("/#/pages/property/addOwnerRoomBinding?ownerId=" + _owner.ownerId);
            },
            _openHireParkingSpace: function (_owner) {
                vc.jumpToPage("/#/pages/property/hireParkingSpace?ownerId=" + _owner.ownerId);
            },
            _openSellParkingSpace: function (_owner) {
                vc.jumpToPage("/#/pages/property/sellParkingSpace?ownerId=" + _owner.ownerId);
            },
            _openOwnerDetailModel: function (_owner) {
                vc.jumpToPage("/#/pages/owner/ownerDetail?ownerId=" + _owner.ownerId + "&ownerName=" + _owner.name+"&needBack=true");
            },
            _openDeleteOwnerRoom: function (_owner) {
                vc.jumpToPage("/#/pages/property/deleteOwnerRoom?ownerId=" + _owner.ownerId);
            },
            _openOwnerRepair: function (_owner) {
                //查看 业主是否有多套房屋，如果有多套房屋，则提示对话框选择，只有一套房屋则直接跳转至交费页面缴费
                $that.listOwnerInfo._eventName = "OwnerRepair";
                $that.listOwnerInfo._currentOwnerId = _owner.ownerId; // 暂存如果有多个房屋是回调回来时 ownerId 会丢掉
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: _owner.ownerId
                    }
                }
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        var rooms = listRoomData.rooms;
                        if (rooms.length == 1) {
                            vc.jumpToPage("/#/pages/property/ownerRepairManage?ownerId=" + _owner.ownerId + "&roomId=" + rooms[0].roomId);
                        } else if (rooms.length == 0) {
                            //vc.toast("当前业主未查询到房屋信息");
                            vc.toast("当前业主未查询到房屋信息");
                        } else {
                            vc.emit('searchRoom', 'showOwnerRooms', rooms);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPayPropertyFee: function (_owner) {
                //查看 业主是否有多套房屋，如果有多套房屋，则提示对话框选择，只有一套房屋则直接跳转至交费页面缴费
                $that.listOwnerInfo._eventName = "PayPropertyFee";
                $that.listOwnerInfo._currentOwnerId = _owner.ownerId; // 暂存如果有多个房屋是回调回来时 ownerId 会丢掉
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: _owner.ownerId
                    }
                }
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json, res) {
                        var listRoomData = JSON.parse(json);
                        var rooms = listRoomData.rooms;
                        if (rooms.length == 1) {
                            vc.jumpToPage("/#/pages/property/listRoomFee?" + vc.objToGetParam(rooms[0]));
                        } else if (rooms.length == 0) {
                            //vc.toast("当前业主未查询到房屋信息");
                            vc.toast("当前业主未查询到房屋信息");
                        } else {
                            vc.emit('searchRoom', 'showOwnerRooms', rooms);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openPayParkingSpaceFee: function (_owner) {
                //查看 业主是否有多套停车位，如果有多套停车位，则提示对话框选择，只有一套停车位则直接跳转至交费页面缴费
                $that.listOwnerInfo._currentOwnerId = _owner.ownerId; // 暂存如果有多个停车位是回调回来时 ownerId 会丢掉
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: _owner.ownerId
                    }
                }
                vc.http.apiGet('/parkingSpace.queryParkingSpacesByOwner',
                    param,
                    function (json, res) {
                        var listParkingSpaceData = JSON.parse(json);
                        var parkingSpaces = listParkingSpaceData.parkingSpaces;
                        if (parkingSpaces.length == 1) {
                            vc.jumpToPage("/#/pages/property/listParkingSpaceFee?" + vc.objToGetParam(parkingSpaces[0]));
                        } else if (parkingSpaces.length == 0) {
                            //vc.toast("当前业主未查询到车位信息");
                            vc.toast("当前业主未查询到车位信息");
                        } else {
                            vc.emit('searchParkingSpace', 'showOwnerParkingSpaces', parkingSpaces);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function () {
                if ($that.listOwnerInfo.moreCondition) {
                    $that.listOwnerInfo.moreCondition = false;
                } else {
                    $that.listOwnerInfo.moreCondition = true;
                }
            },
            dealOwnerAttr: function (owners) {
                if (!owners) {
                    return;
                }
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
                    _ownerAttrDtos.forEach(_attrItem => {
                        if (_value == _attrItem.specName) {
                            _tmpValue = _attrItem.valueName;
                        }
                    })
                    _owner.listValues.push(_tmpValue);
                })
            },
            _getColumns: function (_call) {
                $that.listOwnerInfo.listColumns = [];
                vc.getAttrSpec('building_owner_attr', function (data) {
                    $that.listOwnerInfo.listColumns = [];
                    data.forEach(item => {
                        if (item.listShow == 'Y') {
                            $that.listOwnerInfo.listColumns.push(item.specName);
                        }
                    });
                    _call();
                });
            },
            _viewOwnerRooms: function (_owner) {
                vc.emit('ownerRooms', 'openOwnerRoomModel', _owner);
            },
            _viewOwnerMembers: function (_owner) {
                vc.emit('ownerMembers', 'openOwnerMemberModel', _owner);
            },

            _viewOwnerCars: function (_owner) {
                vc.emit('ownerCars', 'openOwnerCarModel', _owner);
            },
            _viewComplaints: function (_owner) {
                vc.emit('ownerComplaints', 'openOwnerComplaintModel', _owner);
            },
            _viewRepairs: function (_owner) {
                vc.emit('ownerRepairs', 'openOwnerRepairModel', _owner);
            },
            _viewOweFees: function (_owner) {
                vc.emit('ownerOweFees', 'openOwnerOweFeeModel', _owner);
            },
            _viewRoomContracts: function (_owner) {
                vc.emit('roomContracts', 'openRoomContractModel', _owner);
            },
            _viewOwnerFace: function (_url) {
                vc.emit('viewImage', 'showImage', {
                    url: _url
                });
            },
        }
    })
})(window.vc);