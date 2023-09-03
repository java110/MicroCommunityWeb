/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            feeDetailRoomInfo: {
                rooms: [],
                roomId:'',
                roomNum: '',
                allOweFeeAmount:'0'
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('feeDetailRoom', 'switch', function (_data) {
                $that.feeDetailRoomInfo.roomId = _data.payerObjId;
                $that._loadFeeDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('feeDetailRoom', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadFeeDetailRoomData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('feeDetailRoom', 'notify', function (_data) {
                $that._loadFeeDetailRoomData(DEFAULT_PAGE,DEFAULT_ROWS);
            })
        },
        methods: {
            _loadFeeDetailRoomData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId:$that.feeDetailRoomInfo.roomId,
                        page:_page,
                        row:_row
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/room.queryRooms',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.feeDetailRoomInfo.rooms = _roomInfo.rooms;
                        vc.emit('feeDetailRoom', 'paginationPlus', 'init', {
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
            _qureyFeeDetailRoom: function () {
                $that._loadFeeDetailRoomData(DEFAULT_PAGE, DEFAULT_ROWS);
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
        }
    });
})(window.vc);