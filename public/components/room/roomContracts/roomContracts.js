(function (vc) {
    vc.extends({
        data: {
            roomContractsInfo: {
                contracts: [],
                ownerId:'',
                roomId:''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('roomContracts', 'openRoomContractModel', function (_param) {
                $('#roomContractsModel').modal('show');
                $that.roomContractsInfo.ownerId = _param.ownerId;
                $that.roomContractsInfo.roomId = _param.roomId;
                vc.component._loadRoomContractInfo(1, 10);
            });
            vc.on('roomContracts', 'paginationPlus', 'page_event', function (_currentPage) {
                vc.component._loadRoomContractInfo(_currentPage, 10);
            });
        },
        methods: {
            _loadRoomContractInfo: function (_page, _row) {
                let param = {
                    params: {
                        page:_page,
                        row:_row,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId:$that.roomContractsInfo.ownerId,
                    }
                };

                let _url = '/contract/queryContract';
                if($that.roomContractsInfo.roomId){
                    param.params.roomId = $that.roomContractsInfo.roomId;
                    _url = '/contract.queryContractByRoomId';
                }

               
                //发送get请求
                vc.http.apiGet(_url,
                    param,
                    function (json) {
                        var _roomInfo = JSON.parse(json);
                        vc.component.roomContractsInfo.contracts = _roomInfo.data;
                        vc.emit('roomContracts', 'paginationPlus', 'init', {
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
                $('#roomContractsModel').modal('hide');
            },
            
            _getFeeOweAllAmount: function (item) {
                let _fees = $that.roomContractsInfo.fees;
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