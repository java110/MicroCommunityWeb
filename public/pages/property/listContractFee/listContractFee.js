(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            listContractFeeInfo: {
                fees: [],
                contractName: '',
                contractId: '',
                total: 0,
                records: 1,
                builtUpArea: 0.00,
                contractCode: '',
                ownerName: '',
                contractType: '',
                hireOwnerFee: '0',
                urlOwnerId: ''
            }
        },
        _initMethod: function () {
            if (vc.notNull(vc.getParam("contractId"))) {
                $that.listContractFeeInfo.contractName = vc.getParam('contractCode')
                $that.listContractFeeInfo.contractId = vc.getParam('contractId');
                $that._listContract($that.listContractFeeInfo.contractId);
            }
            if (vc.notNull(vc.getParam('ownerId'))) {
                $that.listContractFeeInfo.urlOwnerId = vc.getParam("ownerId");
            }
            vc.component._loadListContractFeeInfo(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent: function () {
            vc.on('listContractFee', 'notify', function (_param) {
                vc.component._loadListContractFeeInfo(DEFAULT_PAGE, DEFAULT_ROWS);
            });
            vc.on('pagination', 'page_event',
                function (_currentPage) {
                    vc.component._loadListContractFeeInfo(_currentPage, DEFAULT_ROWS);
                });
        },
        methods: {
            _loadListContractFeeInfo: function (_page, _row) {
                var param = {
                    params: {
                        page: _page,
                        row: _row,
                        communityId: vc.getCurrentCommunity().communityId,
                        payerObjId: vc.component.listContractFeeInfo.contractId,
                        ownerId: $that.listContractFeeInfo.urlOwnerId
                    }
                };
                //发送get请求
                vc.http.apiGet('/fee.listFee',
                    param,
                    function (json) {
                        var _feeConfigInfo = JSON.parse(json);
                        vc.component.listContractFeeInfo.total = _feeConfigInfo.total;
                        vc.component.listContractFeeInfo.records = _feeConfigInfo.records;
                        vc.component.listContractFeeInfo.fees = _feeConfigInfo.fees;
                        vc.emit('pagination', 'init', {
                            total: _feeConfigInfo.records,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            _openTempImportContractFeeModal: function () {
                vc.emit('tempImportRoomFee', 'openImportRoomFeeModal', {
                    roomId: $that.listContractFeeInfo.contractId,
                    objType: '7777',
                    roomName: $that.listContractFeeInfo.contractName,
                    ownerName: $that.listContractFeeInfo.ownerName
                })
            },
            _payFee: function (_fee) {
                vc.jumpToPage('/#/pages/property/payFeeOrder?feeId=' + _fee.feeId);
            },
            _editFee: function (_fee) {
                vc.emit('editFee', 'openEditFeeModal', _fee);
            },
            _payFeeHis: function (_fee) {
                _fee.builtUpArea = $that.listContractFeeInfo.builtUpArea;
                vc.jumpToPage('/#/pages/property/propertyFee?' + vc.objToGetParam(_fee));
            },
            _deleteFee: function (_fee) {
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
            _finishFee: function (_fee) {
                vc.emit('finishFee', 'openFinishFeeModal', {
                    communityId: vc.getCurrentCommunity().communityId,
                    feeId: _fee.feeId
                });
            },
            _refreshListContractFeeInfo: function () {
                vc.component.listContractFeeInfo._currentFeeConfigName = "";
            },
            _goBack: function () {
                vc.goBack();
            },
            _toOwnerPayFee: function () {
                vc.jumpToPage('/#/pages/property/owePayFeeOrder?payObjId=' + $that.listContractFeeInfo.contractId +
                    "&payObjType=7777&contractName=" + $that.listContractFeeInfo.contractName);
            },
            _openRoomCreateFeeAddModal: function () {
                vc.emit('contractCreateFeeAdd', 'openContractCreateFeeAddModal', {
                    isMore: false,
                    contract: $that.listContractFeeInfo
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
                return vc.dateSubOneDay(_fee.startTime, _fee.deadlineTime, _fee.feeFlag);
            },
            _getEndTime: function (_fee) {
                if (_fee.state == '2009001') {
                    return "-";
                }
                return vc.dateFormat(_fee.endTime);
            },
            _listContract: function (contractId) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        contractId: contractId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/contract/queryContract',
                    param,
                    function (json, res) {
                        let listRoomData = JSON.parse(json);
                        if (listRoomData.total < 1) {
                            return;
                        }
                        vc.copyObject(listRoomData.data[0], $that.listContractFeeInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc);