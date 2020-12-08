/**
 入驻小区
 **/
(function (vc) {
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
                state: '2008001'
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyRoomFee', 'switch', function (_param) {
                if (_param.roomId == '') {
                    return;
                }
                $that.clearSimplifyRoomFeeInfo();
                vc.copyObject(_param, $that.simplifyRoomFeeInfo)
                $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);

                vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                    $that.simplifyRoomFeeInfo.feeTypeCds = _data;
                });
            });

            vc.on('simplifyRoomFee', 'notify', function () {
                $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
            });


            vc.on('simplifyRoomFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._listSimplifyRoomFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _listSimplifyRoomFee: function (_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.simplifyRoomFeeInfo.roomId,
                        configId: $that.simplifyRoomFeeInfo.configId,
                        state: $that.simplifyRoomFeeInfo.state,
                        feeTypeCd: $that.simplifyRoomFeeInfo.feeTypeCd
                    }
                };

                //发送get请求
                vc.http.get('listRoomFee',
                    'list',
                    param,
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        vc.component.simplifyRoomFeeInfo.total = _feeConfigInfo.total;
                        vc.component.simplifyRoomFeeInfo.records = _feeConfigInfo.records;
                        vc.component.simplifyRoomFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('simplifyRoomFee', 'paginationPlus', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _toOwnerPayFee: function () {
                vc.jumpToPage('/admin.html#/pages/property/owePayFeeOrder?payObjId=' + $that.simplifyRoomFeeInfo.roomId + "&payObjType=3333&roomName=" + $that.simplifyRoomFeeInfo.roomName);
            },
            _openRoomCreateFeeAddModal: function () {
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: false,
                    room: $that.simplifyRoomFeeInfo,
                    ownerName: $that.simplifyRoomFeeInfo.name
                });
            },
            _openAddMeterWaterModal: function () {
                vc.emit('addMeterWater', 'openAddMeterWaterModal', {
                    roomId: $that.simplifyRoomFeeInfo.roomId,
                    roomName: $that.simplifyRoomFeeInfo.roomName,
                    ownerName: $that.simplifyRoomFeeInfo.name

                });
            },
            _getAttrValue: function (_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });

                return _value;
            },
            _getDeadlineTime: function (_fee) {

                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }

                if (_fee.state == '2009001') {
                    return "-";
                }

                return _fee.deadlineTime;
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return _fee.endTime;
            },
            _openProxyFeeModal: function () { //创建代收费用
                vc.emit('addProxyFee', 'openAddProxyFeeModal', {
                    roomId: $that.simplifyRoomFeeInfo.roomId,
                    roomName: $that.simplifyRoomFeeInfo.roomName,
                    ownerName: $that.simplifyRoomFeeInfo.name
                });
            },
            _payFee: function (_fee) {
                _fee.roomName = $that.simplifyRoomFeeInfo.roomName;
                _fee.builtUpArea = $that.simplifyRoomFeeInfo.builtUpArea;
                //vc.jumpToPage('/admin.html#/pages/property/payFeeOrder?'+vc.objToGetParam(_fee));
                vc.jumpToPage('/admin.html#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editFee: function (_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function (_fee) {
                _fee.builtUpArea = $that.simplifyRoomFeeInfo.builtUpArea;
                vc.jumpToPage('/admin.html#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function (_fee) {

                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            clearSimplifyRoomFeeInfo: function () {
                let _feeConfigs = $that.roomCreateFeeAddInfo.feeTypeCds;
                $that.simplifyRoomFeeInfo = {
                    fees: [],
                    roomId: '',
                    roomName: '',
                    name: '',
                    roomName: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    feeConfigs: _feeConfigs,
                    feeTypeCd: '',
                    configId: '',
                    state: '2008001'
                }
            },
            _changeSimplifyRoomFeeFeeTypeCd: function (_feeTypeCd) {
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
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.simplifyRoomFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _changeSimplifyRoomConfigId: function () {
                vc.emit('simplifyRoomFee', 'notify', {});
            }


        }
    });
})(window.vc);
