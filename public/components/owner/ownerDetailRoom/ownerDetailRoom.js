/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailRoomInfo: {
                rooms: [],
                ownerId:'',
                roomNum: '',
                allOweFeeAmount:'0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailRoom', 'switch', function (_data) {
                $that.ownerDetailRoomInfo.ownerId = _data.ownerId;
                $that._loadOwnerDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('ownerDetailRoom', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadOwnerDetailRoomData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailRoom', 'notify', function (_data) {
                $that._loadOwnerDetailRoomData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadOwnerDetailRoomData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.ownerDetailRoomInfo.ownerId,
                        roomNum:$that.ownerDetailRoomInfo.roomNum,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerDetailRoomInfo.rooms = _roomInfo.rooms;
                        $that._computeOwnerRoomOweFeeAmount();
                        vc.emit('ownerDetailRoom', 'paginationPlus', 'init', {
                            total: _roomInfo.records,
                            dataCount: _roomInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailRoom: function () {
                $that._loadOwnerDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            },

            _computeOwnerRoomOweFeeAmount(){
                let _rooms = $that.ownerDetailRoomInfo.rooms;
                let _totalOweFeeAmount = 0;
                $that.ownerDetailRoomInfo.allOweFeeAmount = 0;
                if(!_rooms ||_rooms.length <1){
                    return ;
                }

                _rooms.forEach(_room => {
                    if(_room.roomOweFee){
                        _totalOweFeeAmount += parseFloat(_room.roomOweFee);
                    }
                });

                $that.ownerDetailRoomInfo.allOweFeeAmount = _totalOweFeeAmount.toFixed(2);
            },
            _openAddOwnerRoom: function () {
                vc.jumpToPage("/#/pages/property/addOwnerRoomBinding?ownerId=" + $that.ownerDetailRoomInfo.ownerId);
            },
            ownerExitRoomModel: function(_room) {
                vc.emit('ownerExitRoom', 'openExitRoomModel', {
                    ownerId:  $that.ownerDetailRoomInfo.ownerId,
                    roomId: _room.roomId
                });
            },
            _toSimplifyAcceptance: function (_room) {
                let _date = new Date();
                vc.saveData("JAVA110_IS_BACK", _date.getTime());
                vc.saveData('simplifyAcceptanceSearch', {
                    searchType: '1',
                    searchValue: _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum,
                    searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                })
                vc.jumpToPage('/#/pages/property/simplifyAcceptance?tab=业务受理');
            },
            _openEditRoomModel: function (_room) {
                vc.emit('editRoom', 'openEditRoomModal', _room);
            },
        }
    });
})(window.vc);