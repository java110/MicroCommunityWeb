/**
 权限组
 **/
(function(vc) {
    vc.extends({
        propTypes: {
            feeName: vc.propTypes.string,
            feeTypeCd: vc.propTypes.string,
            payName: vc.propTypes.string
        },
        data: {
            mainFeeInfo: {
                feeName: $props.feeName,
                feeId: "",
                feeTypeCd: '',
                floorNum: "",
                roomId: "",
                roomNum: "",
                builtUpArea: "",
                ownerId: "",
                ownerName: "",
                link: "",
                startTime: "",
                endTime: "",
                amount: "-1.00",
                feeFlagName: '',
                feeTypeCdName: '',
                configId: '',
                stateName: '',
                additionalAmount: 0.0,
                squarePrice: 0,
                deadlineTime: '',
                payerObjType: '',
                payerObjId: '',
                payerObjName: '',
                feeAttrs: [],
                carTypeCd: '',
                batchId: ''
            }
        },
        _initMethod: function() {
            //加载 业主信息
            var _feeId = vc.getParam('feeId')
                //$that.mainFeeInfo.builtUpArea = vc.getParam('builtUpArea')
            if (vc.notNull(_feeId)) {
                vc.component.loadMainFeeInfo({
                    feeId: _feeId
                });
            }
        },
        _initEvent: function() {
            vc.on('viewMainFee', 'chooseRoom', function(_room) {
                vc.component.loadMainFeeInfo(_room);
            });
            vc.on('viewMainFee', 'reloadFee', function(_room) {
                if (vc.component.mainFeeInfo.roomId != '') {
                    vc.component.loadMainFeeInfo({
                        roomId: vc.component.mainFeeInfo.roomId
                    });
                }
            });
        },
        methods: {
            openSearchRoomModel: function() {
                vc.emit('searchRoom', 'openSearchRoomModel', {});
            },
            openPayModel: function() {
                vc.emit($props.payName, 'openPayModel', {
                    feeId: vc.component.mainFeeInfo.feeId,
                    configId: vc.component.mainFeeInfo.configId,
                    builtUpArea: vc.component.mainFeeInfo.builtUpArea
                });
            },
            loadMainFeeInfo: function(_fee) {
                //vc.copyObject(_fee,vc.component.mainFeeInfo);
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        feeId: _fee.feeId,
                        row: 1,
                        page: 1
                    }
                };
                //发送get请求
                vc.http.get('viewMainFee',
                    'getFee',
                    param,
                    function(json, res) {
                        var _fee = JSON.parse(json).fees[0];
                        vc.copyObject(_fee, vc.component.mainFeeInfo);
                        $that.mainFeeInfo.feeAttrs = _fee.feeAttrs;
                        vc.emit('propertyFee', 'listFeeDetail', {
                            feeId: _fee.feeId
                        });
                        if (_fee.payerObjType == '3333') {
                            $that._loadRoomAndOwnerByRoomId();
                        } else if (_fee.payerObjType == '6666') {
                            $that._loadRoomAndOwnerByCarId();
                        } else {
                            $that._loadContractAndOwnerByContractId();
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _openCallBackOwner: function() {
                vc.getBack();
            },
            _getDeadlineTime: function(_fee) {
                if (_fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.deadlineTime;
            },
            _getEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.endTime;
            },
            _loadRoomAndOwnerByRoomId: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        roomId: $that.mainFeeInfo.payerObjId
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFee',
                    'listRoom',
                    param,
                    function(json, res) {
                        var listRoomData = JSON.parse(json);
                        let total = listRoomData.total;
                        if (total < 1) {
                            return;
                        }
                        let _room = listRoomData.rooms[0];
                        let _payerObjName = _room.roomType == '1010301' ? _room.floorNum + "-" + _room.unitNum + "-" + _room.roomNum : _room.floorNum + "-" + _room.roomNum;
                        if (_room.hasOwnProperty('ownerName')) {
                            _payerObjName += ('(' + _room.ownerName + ')')
                        } else {
                            _payerObjName += ('(无业主)')
                        }
                        $that.mainFeeInfo.payerObjName = _payerObjName;
                        $that.mainFeeInfo.builtUpArea = _room.builtUpArea;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadContractAndOwnerByContractId: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        contractId: $that.mainFeeInfo.payerObjId
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function(json, res) {
                        var listRoomData = JSON.parse(json);
                        let total = listRoomData.total;
                        if (total < 1) {
                            return;
                        }
                        let _contract = listRoomData.data[0];
                        let _payerObjName = _contract.contractName;
                        if (_contract.hasOwnProperty('ownerName')) {
                            _payerObjName += ('(' + _contract.ownerName + ')')
                        } else {
                            _payerObjName += ('(' + _contract.contractCode + ')')
                        }
                        $that.mainFeeInfo.payerObjName = _payerObjName;
                        $that.mainFeeInfo.builtUpArea = _contract.builtUpArea;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadRoomAndOwnerByCarId: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 10,
                        communityId: vc.getCurrentCommunity().communityId,
                        carId: $that.mainFeeInfo.payerObjId,
                        carTypeCd: $that.mainFeeInfo.carTypeCd
                    }
                };
                //发送get请求
                vc.http.apiGet('owner.queryOwnerCars',
                    param,
                    function(json, res) {
                        var _json = JSON.parse(json);
                        let total = _json.total;
                        let ownerCars = _json.data;
                        if (total < 1) {
                            return;
                        }
                        let _car = ownerCars[0];
                        let _payerObjName = _car.carNum;
                        if (_car.hasOwnProperty('areaNum')) {
                            _payerObjName = _car.areaNum + "停车场" + _car.num + "车位-" + _payerObjName
                        }
                        if (_car.hasOwnProperty('ownerName')) {
                            _payerObjName += ('(' + _car.ownerName + ')')
                        } else {
                            _payerObjName += ('(无业主)')
                        }
                        $that.mainFeeInfo.payerObjName = _payerObjName;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _viewFeeConfig: function() {
                vc.emit('viewFeeConfigData', 'showData', {
                    configId: $that.mainFeeInfo.configId
                })
            },
            _viewRoomData: function() {
                vc.emit('viewRoomData', 'showData', {
                    roomId: $that.mainFeeInfo.payerObjId
                })
            }
        }
    });
})(window.vc);