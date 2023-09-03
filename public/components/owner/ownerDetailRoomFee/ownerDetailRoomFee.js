/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            ownerDetailRoomFeeInfo: {
                fees: [],
                roomNum: '',
                allOweFeeAmount: '0',
                payObjs:[],
                payerObjIds: [],
                ownerId:'',
                state:'2008001',
                totalAmount:0,
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('ownerDetailRoomFee', 'switch', function (_data) {
                $that.ownerDetailRoomFeeInfo.ownerId = _data.ownerId;
                $that._loadDetailRoomsData();
            });
            vc.on('ownerDetailRoomFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    $that._loadOwnerDetailRoomFeeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('ownerDetailRoomFee', 'notify', function (_data) {
                $that._loadOwnerDetailRoomFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadOwnerDetailRoomFeeData: function (_page, _row) {
                let _payerObjIds = $that.ownerDetailRoomFeeInfo.payerObjIds.join(',');
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjIds: _payerObjIds,
                        state:$that.ownerDetailRoomFeeInfo.state
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.ownerDetailRoomFeeInfo.total = _feeConfigInfo.total;
                        $that.ownerDetailRoomFeeInfo.records = _feeConfigInfo.records;
                        $that.ownerDetailRoomFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('pagination', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                        let _totalAmount = 0.0;
                        _feeConfigInfo.fees.forEach(item => {
                            _totalAmount += parseFloat(item.amountOwed);
                        })
                        $that.ownerDetailRoomFeeInfo.totalAmount = _totalAmount.toFixed(2);
                        $that.$forceUpdate();
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyOwnerDetailRoomFee: function () {
                $that._loadOwnerDetailRoomFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openTempImportRoomFeeModal: function() {
                vc.emit('roomsImportTempFee', 'openImportRoomFeeModal', {
                    ownerId: $that.ownerDetailRoomFeeInfo.ownerId,
                    ownerName: $that.ownerDetailRoomFeeInfo.ownerName
                })
            },
            _payRoomFee: function(_fee) {
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editRoomFee: function(_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payRoomFeeHis: function(_fee) {
                _fee.builtUpArea = $that.ownerDetailRoomFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteRoomFee: function(_fee) {
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _finishRoomFee: function(_fee) {
                vc.emit('finishFee', 'openFinishFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _toRoomOwePayFee: function() {
                let _ids = $that.ownerDetailRoomFeeInfo.payerObjIds;
                if(!_ids || _ids.length < 1 ){
                    vc.toast('请选择房屋');
                    return ;
                }
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + _ids.join(',') + "&payObjType=3333&roomName=");
            },
            _printOwnOrder: function() {
                let _ids = $that.ownerDetailRoomFeeInfo.payerObjIds;
                if(!_ids || _ids.length < 1 ){
                    vc.toast('请选择房屋');
                    return ;
                }
                //打印催交单
                window.open('/print.html#/pages/property/printOweFee?payObjId=' + _ids.join(',') + "&payObjType=3333&payObjName=")
            },
            _openRoomsCreateFeeModal: function() {
                vc.emit('roomsCreateFee', 'openRoomsCreateFeeModal', {
                    ownerId: $that.ownerDetailRoomFeeInfo.ownerId,
                    ownerName: $that.ownerDetailRoomFeeInfo.ownerName
                });
            },
            _getRoomAttrValue: function(_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });
                return _value;
            },
            _getRoomDeadlineTime: function(_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getRoomEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
            _chanagePayerObjId: function() {
                $that._loadOwnerDetailRoomFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _changeContractConfigId:function() {
                $that._loadOwnerDetailRoomFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _loadDetailRoomsData:function(){
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        ownerId:$that.ownerDetailRoomFeeInfo.ownerId,
                        page:1,
                        row:100
                    }
                };
                $that.ownerDetailRoomFeeInfo.payerObjIds = [];
                //发送get请求
                vc.http.apiGet('/room.queryRoomsByOwner',
                    param,
                    function (json) {
                        let _roomInfo = JSON.parse(json);
                        $that.ownerDetailRoomFeeInfo.payObjs = _roomInfo.rooms;
                        _roomInfo.rooms.forEach(_room =>{
                            $that.ownerDetailRoomFeeInfo.payerObjIds.push(_room.roomId);
                        });
                        $that._loadOwnerDetailRoomFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _openBatchPayRoomFeeModal: function() {
                vc.jumpToPage('/#/pages/property/batchPayFeeOrder?ownerId=' + $that.ownerDetailRoomFeeInfo.ownerId + "&payerObjType=3333")
            },
            _openProxyFeeModal: function() { //创建代收费用
                vc.emit('roomsProxyFee', 'openRoomsProxyFeeModal', {
                    ownerId: $that.ownerDetailRoomFeeInfo.ownerId,
                    ownerName: $that.ownerDetailRoomFeeInfo.ownerName
                });
            },
           
            
        }
    });
})(window.vc);