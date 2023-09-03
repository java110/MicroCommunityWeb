(function (vc) {
    vc.extends({
        data: {
            roomOweFeesInfo: {
                fees: [],
                roomId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomOweFees', 'openRoomOweFeeModel', function (_param) {
                $('#roomOweFeesModel').modal('show');
                $that.roomOweFeesInfo.roomId = _param.roomId;
                vc.component._loadRoomOweFeeInfo(1, 10);
            });
            vc.on('roomOweFees', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadRoomOweFeeInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadRoomOweFeeInfo: function (_page, _row) {
                let param = {
                    params: {
                        page:_page,
                        row:_row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId:$that.roomOweFeesInfo.roomId,
                        payerObjType:'3333' 
                    }
                };
               
                //发送get请求
                vc.http.apiGet('/reportOweFee/queryReportOweFee',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.roomOweFeesInfo.fees = _roomInfo.data;
                        vc.emit('roomOweFees', 'paginationPlus', 'init', {
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
            chooseRoom: function (_room) {
                vc.emit($props.emitChooseRoom, 'chooseRoom', _room);
                vc.emit($props.emitLoadData, 'listRoomData', {
                    roomId: _room.roomId
                });
                $('#roomOweFeesModel').modal('hide');
            },
            
            _getRoomFeeOweAllAmount: function (item) {
                let _fees = $that.roomOweFeesInfo.fees;
                let _amountOwed = 0.0;
                _fees.forEach(_feeItem => {
                    let _items = _feeItem.items;
                    if (!_items) {
                        return 0;
                    }
                    _items.forEach(tmp => {
                        if (tmp.configId == item.configId) {
                            _amountOwed += parseFloat(tmp.amountOwed);
                        }
                    })
                });
                return _amountOwed.toFixed(2);
            },
        }
    });
})(window.vc);