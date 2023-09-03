/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    var TEMP_SEARCH = "simplifyAcceptanceSearch";
    vc.extends({
        data: {
            simplifyAcceptanceInfo: {
                searchType: '1',
                searchValue: '',
                searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                ownerPhoto: '',
                _currentTab: 'simplifyRoomFee',
                roomId: '',
                ownerId: '',
                ownerRemark: '',
                roomRemark: '',
                name: '',
                idCard: '',
                link: '',
                createTime: '',
                apartmentName: '',
                floorNum: '',
                unitNum: '',
                roomNum: '',
                builtUpArea: '',
                feeCoefficient: '',
                stateName: '',
                roomName: '',
                roomType: '',
                roomSubTypeName: '',
                roomSubType: '',
                roomArea: '',
                sex: '',
                roomRent: '',
                timer: {}
            }
        },
        _initMethod: function () {
            if (!vc.isBack()) {
                return;
            }
            //检查是否有缓存数据
            let _tempData = vc.getData(TEMP_SEARCH);
            if (_tempData == null) {
                return;
            }
            $that.simplifyAcceptanceInfo.searchType = _tempData.searchType;
            $that.simplifyAcceptanceInfo.searchValue = _tempData.searchValue;
            $that.simplifyAcceptanceInfo.searchPlaceholder = _tempData.searchPlaceholder;
            $that._doSearch();
        },
        _initEvent: function () {
            vc.on('simplifyAcceptance', 'chooseRoom', function (_room) {
                vc.copyObject(_room, $that.simplifyAcceptanceInfo);
                $that.simplifyAcceptanceInfo.roomRemark = _room.remark;
                $that.simplifyAcceptanceInfo.roomName = _room.floorNum + '栋' + _room.unitNum + '单元' + _room.roomNum;
                vc.emit('simplifyRoomFee', 'switch', $that.simplifyAcceptanceInfo)
            });
            vc.on('simplifyAcceptance', 'notifyOwner', function (_owner) {
                $that.simplifyAcceptanceInfo.searchValue = _owner.name;
                $that._doSearch();
            });
            vc.on('simplifyAcceptance', 'notifyRoom', function (_room) {
                $that.simplifyAcceptanceInfo.searchValue = _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum;
                $that._doSearch();
            });
            vc.on('simplifyAcceptance', 'selectRoom', function (_param) {
                $that.simplifyAcceptanceInfo.searchType = '1';
                $that.simplifyAcceptanceInfo.searchValue = _param.roomName;
                $that.simplifyAcceptanceInfo.searchPlaceholder = "请输入房屋编号 楼栋-单元-房屋 如1-1-1";
                $that._doSearch();
            })
        },
        methods: {
            _changeSearchType: function () {
                switch ($that.simplifyAcceptanceInfo.searchType) {
                    case '1':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入房屋编号 楼栋-单元-房屋 如1-1-1';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '2':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主名称';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '3':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主手机号';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '4':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主身份证';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '5':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主车牌号';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '6':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入家庭成员名称';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '7':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入家庭成员电话';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '8':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入家庭成员身份证';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                        break;
                    case '9':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入商铺编号 楼栋-商铺 如1-1';
                        break;
                    case '10':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入合同号';
                        break;
                    default:
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入房屋编号 楼栋-单元-房屋 如1-1-1';
                        $that.simplifyAcceptanceInfo.searchValue = "";
                }
            },
            _doSearch: function () {
                if (!vc.isNotEmpty($that.simplifyAcceptanceInfo.searchValue)) {
                    vc.toast('请输入查询条件');
                    return;
                }
                // 清理信息
                $that._clearData();
                let _param = {
                    params: {
                        searchType: $that.simplifyAcceptanceInfo.searchType,
                        searchValue: $that.simplifyAcceptanceInfo.searchValue,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                }
                vc.http.apiGet('/ownerApi/comprehensiveQuery',
                    _param,
                    function (json, res) {
                        let _ownerJson = JSON.parse(json);
                        if (_ownerJson.code != 0) {
                            vc.toast(_ownerJson.msg);
                            return;
                        }
                        $that.saveTempSearchData();
                        let _owner = _ownerJson.data;
                        vc.copyObject(_owner, $that.simplifyAcceptanceInfo);
                        $that.simplifyAcceptanceInfo.ownerRemark = _owner.remark;
                        $that.simplifyAcceptanceInfo.ownerPhoto = _owner.url;
                        if (!_owner.hasOwnProperty('rooms')) {
                            return;
                        }
                        let _rooms = _owner.rooms;
                        if (_rooms.length > 1) {
                            vc.emit('searchRoom', 'showOwnerRooms', _rooms);
                            return;
                        }
                        vc.copyObject(_rooms[0], $that.simplifyAcceptanceInfo);
                        $that.simplifyAcceptanceInfo.roomRemark = _rooms[0].remark;
                        $that.simplifyAcceptanceInfo.roomName = _rooms[0].floorNum + '栋' + _rooms[0].unitNum + '单元' + _rooms[0].roomNum + '室';
                        vc.emit('simplifyRoomFee', 'switch', $that.simplifyAcceptanceInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            saveTempSearchData: function () {
                let _searchType = $that.simplifyAcceptanceInfo.searchType;
                let _searchValue = $that.simplifyAcceptanceInfo.searchValue;
                let _searchPlaceholder = $that.simplifyAcceptanceInfo.searchPlaceholder;
                //缓存起来
                vc.saveData(TEMP_SEARCH, {
                    searchType: _searchType,
                    searchValue: _searchValue,
                    searchPlaceholder: _searchPlaceholder
                });
            },
            changeTab: function (_tab) {
                $that.simplifyAcceptanceInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    ownerId: $that.simplifyAcceptanceInfo.ownerId,
                    ownerName: $that.simplifyAcceptanceInfo.ownerName,
                    roomId: $that.simplifyAcceptanceInfo.roomId,
                    roomName: $that.simplifyAcceptanceInfo.roomName,
                    floorNum: $that.simplifyAcceptanceInfo.floorNum,
                    unitNum: $that.simplifyAcceptanceInfo.unitNum,
                    roomNum: $that.simplifyAcceptanceInfo.roomNum
                })
            },
            _toSimplifyNotepadPage: function () {
                if (!$that.simplifyAcceptanceInfo.ownerId) {
                    vc.toast('请先选择房屋');
                    return;
                }
                vc.jumpToPage('/#/pages/property/simplifyNotepadManage?roomId=' + $that.simplifyAcceptanceInfo.roomId + "&ownerId=" + $that.simplifyAcceptanceInfo.ownerId)
            },
            errorLoadImg: function () {
                vc.component.simplifyAcceptanceInfo.ownerPhoto = "/img/noPhoto.jpg";
            },
            _clearData: function () {
                let _searchType = $that.simplifyAcceptanceInfo.searchType;
                let _searchValue = $that.simplifyAcceptanceInfo.searchValue;
                let _searchPlaceholder = $that.simplifyAcceptanceInfo.searchPlaceholder;
                $that.simplifyAcceptanceInfo = {
                    searchType: _searchType,
                    searchValue: _searchValue,
                    searchPlaceholder: _searchPlaceholder,
                    ownerPhoto: '',
                    _currentTab: 'simplifyRoomFee',
                    roomId: '',
                    ownerId: '',
                    name: '',
                    idCard: '',
                    link: '',
                    createTime: '',
                    apartmentName: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    builtUpArea: '',
                    feeCoefficient: '',
                    stateName: '',
                    roomName: '',
                    sex: '',
                    ownerRemark: '',
                    roomRemark: '',
                    roomType: '',
                    roomSubTypeName: '',
                    roomSubType: '',
                    roomArea: '',
                    roomRent: ''
                };
                $that.changeTab('simplifyRoomFee');
            },
            _simplifyAcceptanceChooseRoom: function () {
                vc.emit('roomTree', 'openRoomTree', {
                    callName: 'simplifyAcceptance'
                })
            },
            _handover: function () {
                vc.jumpToPage('/#/pages/property/handover')
            },
            _simplifyOwnerExitRoom: function () {
                vc.jumpToPage('/#/pages/property/ownerExitRoom')
            },
            _simplifyInputOwner: function () {
                if ($that.simplifyAcceptanceInfo.searchType != "2" && $that.simplifyAcceptanceInfo.searchType != "6" && $that.simplifyAcceptanceInfo.searchType != "1") {
                    return;
                }
                if ($that.simplifyAcceptanceInfo.timer) {
                    clearTimeout($that.simplifyAcceptanceInfo.timer)
                }
                if ($that.simplifyAcceptanceInfo.searchType == "1") {
                    $that.simplifyAcceptanceInfo.timer = setTimeout(() => {
                        vc.emit('inputSearchRoomInfo', 'searchRoom', {
                            callComponent: 'simplifyAcceptance',
                            roomName: $that.simplifyAcceptanceInfo.searchValue
                        });
                    }, 1500)
                    return;
                }
                let _ownerTypeCd = $that.simplifyAcceptanceInfo.searchType == "2" ? '1001' : '1002,1003,1005'
                $that.simplifyAcceptanceInfo.timer = setTimeout(() => {
                    vc.emit('inputSearchOwnerInfo', 'searchOwner', {
                        callComponent: 'simplifyAcceptance',
                        ownerTypeCd: _ownerTypeCd,
                        ownerName: $that.simplifyAcceptanceInfo.searchValue
                    });
                }, 1500)
            }
        }
    });
})(window.vc);