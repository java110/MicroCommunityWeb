/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            contractDetailFeeInfo: {
                rooms: [],
                contractId: '',
                roomNum: '',
                allOweFeeAmount: '0',
                totalAmount: 0,
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('contractDetailFee', 'switch', function(_data) {
                $that.contractDetailFeeInfo.contractId = _data.contractId;
                $that._loadContractDetailFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('contractDetailFee', 'paginationPlus', 'page_event',
                function(_currentPage) {
                    $that._loadContractDetailFeeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('contractDetailFee', 'notify', function(_data) {
                $that._loadContractDetailFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadContractDetailFeeData: function(_page, _row) {
                let param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: $that.contractDetailFeeInfo.contractId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function(json) {
                        let _feeConfigInfo = JSON.parse(json);
                        $that.contractDetailFeeInfo.total = _feeConfigInfo.total;
                        $that.contractDetailFeeInfo.records = _feeConfigInfo.records;
                        $that.contractDetailFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('pagination', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                        let _totalAmount = 0.0;
                        _feeConfigInfo.fees.forEach(item => {
                            _totalAmount += parseFloat(item.amountOwed);
                        })
                        $that.contractDetailFeeInfo.totalAmount = _totalAmount.toFixed(2);
                        $that.$forceUpdate();
                    },
                    function() {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyContractDetailFee: function() {
                $that._loadContractDetailFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _openTempImportContractFeeModal: function() {
                vc.emit('tempImportRoomFee', 'openImportRoomFeeModal', {
                    roomId: $that.contractDetailFeeInfo.contractId,
                    objType: '7777',
                    roomName: $that.contractDetailFeeInfo.contractName,
                    ownerName: $that.contractDetailFeeInfo.ownerName
                })
            },
            _payContractFee: function(_fee) {
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editContractFee: function(_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payContractFeeHis: function(_fee) {
                _fee.builtUpArea = $that.contractDetailFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteContractFee: function(_fee) {
                vc.emit('deleteFee', 'openDeleteFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _finishContractFee: function(_fee) {
                vc.emit('finishFee', 'openFinishFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _toContractOwePayFee: function() {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + $that.contractDetailFeeInfo.contractId + "&payObjType=7777&contractName=" + $that.contractDetailFeeInfo.contractName);
            },
            _openContractCreateFeeAddModal: function() {
                vc.emit('contractCreateFeeAdd', 'openContractCreateFeeAddModal', {
                    isMore: false,
                    contract: $that.contractDetailFeeInfo
                });
            },
            _getContractAttrValue: function(_attrs, _specCd) {
                let _value = "";
                _attrs.forEach(item => {
                    if (item.specCd == _specCd) {
                        _value = item.value;
                        return;
                    }
                });
                return _value;
            },
            _getContractDeadlineTime: function(_fee) {
                if (_fee.amountOwed == 0 && _fee.endTime == _fee.deadlineTime) {
                    return "-";
                }
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getContractEndTime: function(_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
        }
    });
})(window.vc);