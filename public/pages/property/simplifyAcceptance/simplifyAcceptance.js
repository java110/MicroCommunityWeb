/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
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
                sex: 0
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('simplifyAcceptance', 'chooseRoom', function (_room) {
                vc.copyObject(_room, $that.simplifyAcceptanceInfo);
                $that.simplifyAcceptanceInfo.roomName = _room.floorNum + '栋' + _room.unitNum + '单元' + _room.roomNum;
                vc.emit('simplifyRoomFee', 'switch', $that.simplifyAcceptanceInfo)
            });
        },
        methods: {
            _changeSearchType: function () {
                switch ($that.simplifyAcceptanceInfo.searchType) {
                    case '1':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入房屋编号 楼栋-单元-房屋 如1-1-1';
                        break;
                    case '2':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主名称';
                        break;
                    case '3':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主手机号';
                        break;
                    case '4':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主身份证';
                        break;
                    case '5':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主车牌号';
                        break;
                    case '6':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入家庭成员名称';
                        break;
                    case '7':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入家庭成员电话';
                        break;
                    case '8':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入家庭成员身份证';
                        break;
                    default:
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入房屋编号 楼栋-单元-房屋 如1-1-1';
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

                        let _owner = _ownerJson.data;
                        vc.copyObject(_owner, $that.simplifyAcceptanceInfo);
                        if (!_owner.hasOwnProperty('rooms')) {
                            return;
                        }
                        let _rooms = _owner.rooms;
                        if (_rooms.length > 1) {
                            vc.emit('searchRoom', 'showOwnerRooms', _rooms);
                            return;
                        }
                        vc.copyObject(_rooms[0], $that.simplifyAcceptanceInfo);
                        $that.simplifyAcceptanceInfo.roomName = _rooms[0].floorNum + '栋' + _rooms[0].unitNum + '单元' + _rooms[0].roomNum;
                        vc.emit('simplifyRoomFee', 'switch', $that.simplifyAcceptanceInfo);

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            changeTab: function (_tab) {
                $that.simplifyAcceptanceInfo._currentTab = _tab;

                vc.emit(_tab, 'switch', {
                    ownerId: $that.simplifyAcceptanceInfo.ownerId,
                    roomId: $that.simplifyAcceptanceInfo.roomId
                })
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
                    sex: 0
                }
            }

        }
    });
})(window.vc);
