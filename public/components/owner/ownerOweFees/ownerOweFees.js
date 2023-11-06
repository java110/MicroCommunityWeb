(function (vc) {
    vc.extends({
        data: {
            ownerOweFeesInfo: {
                fees: [],
                ownerId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerOweFees', 'openOwnerOweFeeModel', function (_param) {
                $('#ownerOweFeesModel').modal('show');
                $that.ownerOweFeesInfo.ownerId = _param.ownerId;
                vc.component._loadOwnerOweFeeInfo(1, 10);
            });
            vc.on('ownerOweFees', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadOwnerOweFeeInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadOwnerOweFeeInfo: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId: $that.ownerOweFeesInfo.ownerId
                    }
                };
                //发送get请求
                vc.http.apiGet('/reportOweFee/queryReportOweFee',
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.ownerOweFeesInfo.fees = _roomInfo.data;
                        vc.emit('ownerOweFees', 'paginationPlus', 'init', {
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
                $('#ownerOweFeesModel').modal('hide');
            },
            _getFeeOweAllAmount: function (item) {
                let _fees = $that.ownerOweFeesInfo.fees;
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