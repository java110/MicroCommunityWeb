/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyRoomFeeInfo: {
                fees: [],
                roomId: '',
                roomName: '',
                name: '',
                roomName: '',
                floorNum: '',
                unitNum: '',
                roomNum: '',
                configId: '',
                feeTypeCds: [],
                feeTypeCd: '',
                roomType: '',
                state: '2008001',
                totalAmount: 0.0,
                roomType: '',
                ownerFee: 'N',
                ownerId: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            //切换 至费用页面
            vc.on('simplifyRoomFee', 'switch', function(_param) {
                if (_param.roomId == '') {
                    return;
                }
                $that.clearSimplifyRoomFeeInfo();
                vc.copyObject(_param, $that.simplifyRoomFeeInfo)
                $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
                vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                    $that.simplifyRoomFeeInfo.feeTypeCds = _data;
                });
            });
            vc.on('simplifyRoomFee', 'notify', function() {
                $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('simplifyRoomFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    vc.component._listSimplifyRoomFee(_currentPage, DEFAULT_ROWS);
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
            _listSimplifyRoomFee: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.simplifyRoomFeeInfo.roomId,
                        payerObjType: '3333',
                        configId: $that.simplifyRoomFeeInfo.configId,
                        state: $that.simplifyRoomFeeInfo.state,
                        feeTypeCd: $that.simplifyRoomFeeInfo.feeTypeCd,
                    }
                };
                //按业主查询
                if ($that.simplifyRoomFeeInfo.ownerFee == 'Y') {
                    param.params.payerObjId = '';
                    param.params.ownerId = $that.simplifyRoomFeeInfo.ownerId;
                }
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.simplifyRoomFeeInfo.total = _feeConfigInfo.total;
                        vc.component.simplifyRoomFeeInfo.records = _feeConfigInfo.records;
                        let _totalAmount = 0.0;
                        _feeConfigInfo.fees.forEach(item => {
                            _totalAmount += parseFloat(item.amountOwed);
                        })
                        $that.simplifyRoomFeeInfo.totalAmount = _totalAmount.toFixed(2);
                        vc.component.simplifyRoomFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('simplifyRoomFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            _toOwnerPayFee: function() {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + $that.simplifyRoomFeeInfo.roomId + "&payObjType=3333&roomName=" + $that.simplifyRoomFeeInfo.roomName);
            },
            _openRoomCreateFeeAddModal: function() {
                $that.simplifyRoomFeeInfo.ownerName = $that.simplifyRoomFeeInfo.name;
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: false,
                    room: $that.simplifyRoomFeeInfo,
                    ownerName: $that.simplifyRoomFeeInfo.name
                });
            },
            _openAddMeterWaterSimplifyModal: function() {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.simplifyRoomFeeInfo.roomId,
                    roomName: $that.simplifyRoomFeeInfo.roomName,
                    ownerName: $that.simplifyRoomFeeInfo.name
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
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
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
                    roomId: $that.simplifyRoomFeeInfo.roomId,
                    roomName: $that.simplifyRoomFeeInfo.roomName,
                    ownerName: $that.simplifyRoomFeeInfo.name
                });
            },
            _payFee: function(_fee) {
                _fee.roomName = $that.simplifyRoomFeeInfo.roomName;
                _fee.builtUpArea = $that.simplifyRoomFeeInfo.builtUpArea;
                // vc.jumpToPage('/#/pages/property/payFeeOrder?' + vc.objToGetParam(_fee));
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editFee: function(_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function(_fee) {
                _fee.builtUpArea = $that.simplifyRoomFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function(_fee) {
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _finishFee: function(_fee) {
                vc.emit('finishFee', 'openFinishFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _openTempImportRoomFeeModal: function() {
                vc.emit('tempImportRoomFee', 'openImportRoomFeeModal', {
                    roomId: $that.simplifyRoomFeeInfo.roomId,
                    roomName: $that.simplifyRoomFeeInfo.roomName,
                    ownerName: $that.simplifyRoomFeeInfo.name
                })
            },
            clearSimplifyRoomFeeInfo: function() {
                let _feeConfigs = $that.roomCreateFeeAddInfo.feeTypeCds;
                $that.simplifyRoomFeeInfo = {
                    fees: [],
                    accounts: [],
                    roomId: '',
                    roomName: '',
                    name: '',
                    roomName: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    roomType: '',
                    feeConfigs: _feeConfigs,
                    feeTypeCd: '',
                    configId: '',
                    state: '2008001',
                    totalAmount: 0.0,
                    roomType: '',
                    ownerFee: 'N',
                    ownerId: ''
                }
            },
            _changeSimplifyRoomFeeFeeTypeCd: function(_feeTypeCd) {
                $that.simplifyRoomFeeInfo.configId = '';
                vc.emit('simplifyRoomFee', 'notify', {});
                var param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: '',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.simplifyRoomFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _changeSimplifyRoomConfigId: function() {
                vc.emit('simplifyRoomFee', 'notify', {});
            },
            _simplifyRoomGetFeeOwnerInfo: function(attrs) {
                let ownerName = $that._getAttrValue(attrs, '390008');
                let ownerLink = $that._getAttrValue(attrs, '390009');
                return '业主：' + ownerName + ',电话：' + ownerLink;
            },
            _getSimplifyRoomFeeRoomName: function(fee) {
                if ($that.simplifyRoomFeeInfo.ownerFee != 'Y') {
                    return '';
                }
                let _feeName = ''
                fee.feeAttrs.forEach(item => {
                    if (item.specCd == '390012') {
                        _feeName = '(' + item.value + ')';
                    }
                })

                return _feeName;
            },
            _openBatchPayRoomFeeModal: function() {
                vc.jumpToPage('/#/pages/property/batchPayFeeOrder?ownerId=' + $that.simplifyRoomFeeInfo.ownerId + "&payerObjType=3333")
            }
        }
    });
})(window.vc);