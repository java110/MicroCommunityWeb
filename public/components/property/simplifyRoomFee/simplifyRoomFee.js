/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyRoomFeeInfo: {
                total: 0,
                records: 1,
                fees: [],
                monthFees: [],
                roomId: '',
                roomName: '',
                name: '',
                floorNum: '',
                unitNum: '',
                roomNum: '',
                configId: '',
                feeTypeCds: [],
                feeTypeCd: '',
                state: '2008001',
                totalAmount: 0.0,
                roomType: '',
                ownerFee: 'N',
                ownerId: '',
                showFlag: 'DEFAULT'
            }
        },
        _initMethod: function () {
            vc.popover('popover-show');
            vc.popover('popover-show-endTime');
            vc.popover('popover-show-deadlineTime');
        },
        _initEvent: function () {
            //切换 至费用页面
            vc.on('simplifyRoomFee', 'switch', function (_param) {
                $that.clearSimplifyRoomFeeInfo();
                if (_param.roomId == '') {
                    return;
                }
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
                function(_currentPage) {
                    $that._listSimplifyRoomFee(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            getOnePrice1: function (fee) {
                let _price = fee.mwPrice;
                if (!_price) {
                    return fee.squarePrice;
                }
                if (parseFloat(_price) > 0) {
                    return _price;
                }
                return fee.squarePrice;
            },
            _listSimplifyRoomFee: function (_page, _row) {
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
                    function (json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.simplifyRoomFeeInfo.total = _feeConfigInfo.total;
                        $that.simplifyRoomFeeInfo.records = _feeConfigInfo.records;
                        let _totalAmount = 0.0;
                        _feeConfigInfo.fees.forEach(item => {
                            _totalAmount += parseFloat(item.amountOwed);
                        })
                        $that.simplifyRoomFeeInfo.totalAmount = _totalAmount.toFixed(2);
                        $that.simplifyRoomFeeInfo.fees = _feeConfigInfo.fees.sort($that._roomFeeCompare);
                        vc.emit('simplifyRoomFee', 'paginationPlus', 'init', {
                            total: $that.simplifyRoomFeeInfo.records,
                            dataCount: $that.simplifyRoomFeeInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _roomFeeCompare: function (a, b) {
                var val1 = a.payerObjName;
                var val2 = b.payerObjName;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
            _toOwnerPayFee: function () {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + $that.simplifyRoomFeeInfo.roomId + "&payObjType=3333&roomName=" + $that.simplifyRoomFeeInfo.roomName);
            },
           
            _openRoomCreateFeeAddModal: function () {
                $that.simplifyRoomFeeInfo.ownerName = $that.simplifyRoomFeeInfo.name;
                vc.emit('roomCreateFeeAdd', 'openRoomCreateFeeAddModal', {
                    isMore: false,
                    room: $that.simplifyRoomFeeInfo,
                    ownerName: $that.simplifyRoomFeeInfo.name
                });
            },
            _openAddMeterWaterSimplifyModal: function () {
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
                //return vc.dateSub(_fee.deadlineTime, _fee.feeFlag);
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
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
                // vc.jumpToPage('/#/pages/property/payFeeOrder?' + vc.objToGetParam(_fee));
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editFee: function (_fee) {
                // 计费结束时间
                _fee.maxEndTime = $that._getAttrValue(_fee.feeAttrs, '390010');
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function (_fee) {
                _fee.builtUpArea = $that.simplifyRoomFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function (_fee) {
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _finishFee: function (_fee) {
                vc.emit('finishFee', 'openFinishFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _openTempImportRoomFeeModal: function () {
                vc.emit('tempImportRoomFee', 'openImportRoomFeeModal', {
                    roomId: $that.simplifyRoomFeeInfo.roomId,
                    roomName: $that.simplifyRoomFeeInfo.roomName,
                    ownerName: $that.simplifyRoomFeeInfo.name
                })
            },
            clearSimplifyRoomFeeInfo: function () {
                let _feeConfigs = $that.roomCreateFeeAddInfo.feeTypeCds;
                $that.simplifyRoomFeeInfo = {
                    total: 0,
                    records: 1,
                    fees: [],
                    monthFees: [],
                    accounts: [],
                    roomId: '',
                    name: '',
                    roomName: '',
                    floorNum: '',
                    unitNum: '',
                    roomNum: '',
                    feeConfigs: _feeConfigs,
                    feeTypeCd: '',
                    configId: '',
                    state: '2008001',
                    totalAmount: 0.0,
                    roomType: '',
                    ownerFee: 'N',
                    ownerId: '',
                    showFlag: 'DEFAULT'
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
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.simplifyRoomFeeInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _changeSimplifyRoomConfigId: function () {
                vc.emit('simplifyRoomFee', 'notify', {});
            },
            _simplifyRoomGetFeeOwnerInfo: function (attrs) {
                let ownerName = $that._getAttrValue(attrs, '390008');
                let ownerLink = $that._getAttrValue(attrs, '390009');
                return '业主：' + ownerName + ',电话：' + ownerLink;
            },
            _getSimplifyRoomFeeRoomName: function (fee) {
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
            _openBatchPayRoomFeeModal: function () {
                vc.jumpToPage('/#/pages/property/batchPayFeeOrder?ownerId=' + $that.simplifyRoomFeeInfo.ownerId + "&payerObjType=3333")
            },
            _openMonthPayRoomFeeModal: function() {
                vc.jumpToPage('/#/pages/property/payFeeMonthOrder?payerObjId=' +
                    $that.simplifyRoomFeeInfo.roomId +
                    "&payerObjType=3333");
            },
            _openRoomCreateFeeComboModal: function() {
                vc.jumpToPage('/#/pages/property/createFeeByCombo?payerObjId=' +
                    $that.simplifyRoomFeeInfo.roomId +
                    "&payerObjName=" + $that.simplifyRoomFeeInfo.roomName + "&payerObjType=3333")
            },
            _openPrestoreAccountModal: function() {
                window.open('/#/pages/owner/ownerDetail?ownerId=' + $that.simplifyRoomFeeInfo.ownerId + "&currentTab=ownerDetailAccount")
            },
            _viewRoomFeeConfig: function(_fee) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        configId: _fee.configId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfig = _feeConfigManageInfo.feeConfigs[0];
                        vc.emit('viewData', 'openViewDataModal', {
                            title: _fee.feeName + " 费用项",
                            data: {
                                "费用项ID": _feeConfig.configId,
                                "费用类型": _feeConfig.feeTypeCdName,
                                "收费项目": _feeConfig.feeName,
                                "费用标识": _feeConfig.feeFlagName,
                                "催缴类型": _feeConfig.billTypeName,
                                "付费类型": _feeConfig.paymentCd == '1200' ? '预付费' : '后付费',
                                "缴费周期": _feeConfig.paymentCycle,
                                "应收开始时间": _feeConfig.startTime,
                                "应收结束时间": _feeConfig.endTime,
                                "公式": _feeConfig.computingFormulaName,
                                "计费单价": _feeConfig.computingFormula == '2002' ? '-' : _feeConfig.squarePrice,
                                "附加/固定费用": _feeConfig.additionalAmount,

                            }
                        })
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );

            },
            _viewRoomFee: function (_fee) {
                let _data = {
                    "费用ID": _fee.feeId,
                    "费用标识": _fee.feeFlagName,
                    "费用类型": _fee.feeTypeCdName,
                    "付费对象": _fee.payerObjName,
                    "费用项": _fee.feeName,
                    "费用状态": _fee.stateName,
                    "建账时间": _fee.startTime,
                    "应收开始时间": $that._getEndTime(_fee),
                    "应收结束时间": $that._getDeadlineTime(_fee),
                    "批次": _fee.batchId,
                };
                _fee.feeAttrs.forEach(attr => {
                    _data[attr.specCdName] = attr.value;
                })
                vc.emit('viewData', 'openViewDataModal', {
                    title: _fee.feeName + " 详情",
                    data: _data
                });
            },
            _changeSimplifyRoomShowFlag: function() {
                if ($that.simplifyRoomFeeInfo.showFlag == 'MONTH') {
                    $that._listSimplifyRoomMonthFee(DEFAULT_PAGE, DEFAULT_ROWS)
                } else {
                    $that._listSimplifyRoomFee(DEFAULT_PAGE, DEFAULT_ROWS);
                }
            },
            _listSimplifyRoomMonthFee: function(_page, _row) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        objId: $that.simplifyRoomFeeInfo.roomId,
                        payerObjType: '3333',
                        configId: $that.simplifyRoomFeeInfo.configId,
                        feeTypeCd: $that.simplifyRoomFeeInfo.feeTypeCd,
                        detailId: '-1'
                    }
                };
                //按业主查询
                if ($that.simplifyRoomFeeInfo.ownerFee == 'Y') {
                    param.params.payerObjId = '';
                    param.params.ownerId = $that.simplifyRoomFeeInfo.ownerId;
                }
                //发送get请求
                vc.http.apiGet('/fee.listMonthFee',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.simplifyRoomFeeInfo.total = _feeConfigInfo.total;
                        $that.simplifyRoomFeeInfo.records = _feeConfigInfo.records;
                        let _totalAmount = 0.0;
                        _feeConfigInfo.data.forEach(item => {
                            _totalAmount += parseFloat(item.receivableAmount);
                        })
                        $that.simplifyRoomFeeInfo.totalAmount = _totalAmount.toFixed(2);
                        $that.simplifyRoomFeeInfo.monthFees = _feeConfigInfo.data;
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);