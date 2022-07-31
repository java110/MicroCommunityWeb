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

                        $that.saveTempSearchData();
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
                    roomId: $that.simplifyAcceptanceInfo.roomId,
                    roomName: $that.simplifyAcceptanceInfo.floorNum+"栋"+$that.simplifyAcceptanceInfo.unitNum+"单元"+$that.simplifyAcceptanceInfo.roomNum+"室"
                })
                if(_tab=='feeReceipt'){
                    this.timer = setTimeout(()=>{   //设置延迟执行
                        vc.component._initDatetimepicker();
                    },500);
                }
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
            },
            _initDatetimepicker:function(){
                $(".startTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    startView: 2,
                    minView: 2,
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".endTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    startView: 2,
                    minView: 2,
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".startTime").val();
                    vc.component.feeReceiptManageInfo.conditions.qstartTime = value ;
                });
                $('.endTime').datetimepicker()
                .on('changeDate', function (ev) {
                    var value = $(".endTime").val();
                    vc.component.feeReceiptManageInfo.conditions.qendTime = value ;
                });
            }

        }
    });
})(window.vc);
