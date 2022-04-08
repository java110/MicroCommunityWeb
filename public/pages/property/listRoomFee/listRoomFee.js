(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listRoomCreateFeeInfo: {
                fees: [],
                roomName: '',
                roomId: '',
                total: 0,
                records: 1,
                builtUpArea: 0.00,
                floorNum: '',
                unitNum: '',
                roomNum: '',
                ownerName: '',
                roomType: '',
                hireOwnerFee: '0',
                urlOwnerId: ''
            }
        },
        _initMethod: function() {
            if (vc.notNull(vc.getParam("roomId"))) {
                $that._listRoom(vc.getParam("roomId"));
            }
            if (vc.notNull(vc.getParam("hireOwnerFee"))) {
                $that.listRoomCreateFeeInfo.hireOwnerFee = vc.getParam("hireOwnerFee");
            }
            if (vc.notNull(vc.getParam('ownerId'))) {
                $that.listRoomCreateFeeInfo.urlOwnerId = vc.getParam("ownerId");
            }
        },
        _initEvent: function() {
            vc.on('listRoomFee', 'notify', function(_param) {
                vc.component._loadListRoomCreateFeeInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event',
                function(_currentPage) {
                    vc.component._loadListRoomCreateFeeInfo(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            getOnePrice1: function(fee) {
                let _price = fee.mwPrice;
                if (!_price) {
                    return fee.squarePrice;
                }
                if (parseFloat(_price) > 0) {
                    return _price;
                }
                return fee.squarePrice;
            },
            _loadListRoomCreateFeeInfo: function(_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: vc.component.listRoomCreateFeeInfo.roomId
                            // ownerId: $that.listRoomCreateFeeInfo.urlOwnerId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.listRoomCreateFeeInfo.total = _feeConfigInfo.total;
                        vc.component.listRoomCreateFeeInfo.records = _feeConfigInfo.records;
                        vc.component.listRoomCreateFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('pagination', 'init', {
                            total: _feeConfigInfo.records,
                            dataCount: _feeConfigInfo.total,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _payFee: function(_fee) {
                _fee.roomName = $that.listRoomCreateFeeInfo.roomName;
                _fee.builtUpArea = $that.listRoomCreateFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/payFeeOrder?' + vc.objToGetParam(_fee));
            },
            _editFee: function(_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function(_fee) {
                _fee.builtUpArea = $that.listRoomCreateFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function(_fee) {
                // var dateA = new Date(_fee.startTime);
                // var dateB = new Date();
                // if(dateA.setHours(0, 0, 0, 0) != dateB.setHours(0, 0, 0, 0)){
                //     vc.toast("只能取消当天添加的费用");
                //     return;
                // }
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _refreshListRoomCreateFeeInfo: function() {
                vc.component.listRoomCreateFeeInfo._currentFeeConfigName = "";
            },
            _goBack: function() {
                vc.goBack();
            },
            _toOwnerPayFee: function() {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + $that.listRoomCreateFeeInfo.roomId + "&payObjType=3333&roomName=" + $that.listRoomCreateFeeInfo.roomName);
            },
            _openRoomCreateFeeAddModal: function() {
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: false,
                    room: $that.listRoomCreateFeeInfo
                });
            },
            _openAddMeterWaterModal: function() {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.listRoomCreateFeeInfo.roomId,
                    roomName: $that.listRoomCreateFeeInfo.roomName,
                    ownerName: $that.listRoomCreateFeeInfo.ownerName
                });
            },
            _getAttrValue: function(_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });
                return _value;
            },
            _getDeadlineTime: function(_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
            _openProxyFeeModal: function() { //创建代收费用
                vc.emit('addProxyFee', 'openAddProxyFeeModal', {
                    roomId: $that.listRoomCreateFeeInfo.roomId,
                    roomName: $that.listRoomCreateFeeInfo.roomName,
                    ownerName: $that.listRoomCreateFeeInfo.ownerName
                });
            },
            _listRoom: function(roomId) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        roomId: roomId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFee',
                    'listRoom',
                    param,
                    function(json, res) {
                        let listRoomData = JSON.parse(json);
                        if (listRoomData.total < 1) {
                            return;
                        }
                        vc.copyObject(listRoomData.rooms[0], $that.listRoomCreateFeeInfo);
                        if (listRoomData.rooms[0].roomType == '1010301') {
                            $that.listRoomCreateFeeInfo.roomName = listRoomData.rooms[0].floorNum + "-" + listRoomData.rooms[0].unitNum + "-" + listRoomData.rooms[0].roomNum;
                        } else {
                            $that.listRoomCreateFeeInfo.roomName = listRoomData.rooms[0].floorNum + "-" + listRoomData.rooms[0].roomNum;
                        }
                        // 换存搜索条件
                        vc.emit('listRoomFee', 'notify', {})
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);