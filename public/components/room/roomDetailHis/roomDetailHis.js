/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            roomDetailHisInfo: {
                rooms: [],
                roomId: '',
                roomName: '',
                logStartTime: '',
                logEndTime: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomDetailHis', 'switch', function (_data) {
                $that.roomDetailHisInfo.roomId = _data.roomId;
                $that.roomDetailHisInfo.roomName = _data.roomName;
                $that.roomDetailHisInfo.logStartTime = _data.logStartTime;
                $that.roomDetailHisInfo.logEndTime = _data.logEndTime;


                $that._loadRoomDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);

            });
            vc.on('roomDetailHis', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadRoomDetailHisData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('roomDetailHis', 'notify', function (_data) {
                $that._loadRoomDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadRoomDetailHisData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId: $that.roomDetailHisInfo.roomId,
                        roomName: $that.roomDetailHisInfo.roomName,
                        logStartTime: $that.roomDetailHisInfo.logStartTime,
                        logEndTime: $that.roomDetailHisInfo.logEndTime,
                        page: _page,
                        row: _row
                    }
                };

                //发送get请求
                vc.http.apiGet('/room.queryHisRoom',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        $that.roomDetailHisInfo.rooms = _roomInfo.data;
                        vc.emit('roomDetailHis', 'paginationPlus', 'init', {
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
            _qureyRoomDetailHis: function () {
                $that._loadRoomDetailHisData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _getRoomHisOperate: function (_room) {
                let _roomCount = 0;
                $that.roomDetailHisInfo.rooms.forEach(item => {
                    if (_room.bId == item.bId) {
                        _roomCount += 1;
                    }
                });

                if (_roomCount <= 1) {
                    if (_room.operate == 'ADD') {
                        return '添加';
                    }
                    if (_room.operate == 'DEL') {
                        return '删除';
                    }
                    return "-"
                }

                if (_room.operate == 'ADD') {
                    return '修改(新)';
                }
                if (_room.operate == 'DEL') {
                    return '修改(旧)';
                }

                return "-"
            }
        }
    });
})(window.vc);