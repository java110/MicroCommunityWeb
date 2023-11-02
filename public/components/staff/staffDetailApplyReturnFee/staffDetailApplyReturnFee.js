/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            staffDetailApplyReturnFeeInfo: {
                returnPayFees: [],
                staffId: '',
                state: '',
                returnPayFeeStates: []
            }
        },
        _initMethod: function () {
            vc.getDict('return_pay_fee', "state", function (_data) {
                vc.component.staffDetailApplyReturnFeeInfo.returnPayFeeStates = _data;
            });
        },
        _initEvent: function () {
            vc.on('staffDetailApplyReturnFee', 'switch', function (_data) {
                $that.staffDetailApplyReturnFeeInfo.staffId = _data.staffId;
                $that._loadStaffDetailApplyReturnFeeData(DEFAULT_PAGE, DEFAULT_ROWS)
            });
            vc.on('staffDetailApplyReturnFee', 'paginationPlus', 'page_event',
                function (_currentPage) {
                    vc.component._loadStaffDetailApplyReturnFeeData(_currentPage, DEFAULT_ROWS);
                });
            vc.on('staffDetailApplyReturnFee', 'notify', function (_data) {
                $that._loadStaffDetailApplyReturnFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            })
        },
        methods: {
            _loadStaffDetailApplyReturnFeeData: function (_page, _row) {
                let param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        applyPersonId: $that.staffDetailApplyReturnFeeInfo.staffId,
                        state: $that.staffDetailApplyReturnFeeInfo.state,
                        page: _page,
                        row: _row
                    }
                };
                //发送get请求
                vc.http.apiGet('/returnPayFee.listReturnPayFees',
                    param,
                    function (json) {
                        let _returnPayFeeManageInfo = JSON.parse(json);
                        if (_returnPayFeeManageInfo.returnPayFees != null && _returnPayFeeManageInfo.returnPayFees.length > 0) {
                            _returnPayFeeManageInfo.returnPayFees.forEach(item => {
                                if (item.feeAccountDetailDtoList != null && item.feeAccountDetailDtoList.length > 0) {
                                    item.feeAccountDetailDtoList.forEach(item2 => {
                                        if (item2.state == '1001' || item2.state == '1003') { //无抵扣或积分抵扣
                                            return;
                                        } else {
                                            item.receivedAmount = (parseFloat(item.receivedAmount) - parseFloat(item2.amount)).toFixed(2);
                                        }
                                    })
                                }
                            });
                        }
                        vc.component.staffDetailApplyReturnFeeInfo.returnPayFees = _returnPayFeeManageInfo.returnPayFees;
                        vc.emit('staffDetailApplyReturnFee', 'paginationPlus', 'init', {
                            total: _returnPayFeeManageInfo.records,
                            dataCount: _returnPayFeeManageInfo.total,
                            currentPage: _page
                        });
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询
            _qureyStaffDetailApplyReturnFee: function () {
                $that._loadStaffDetailApplyReturnFeeData(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            _toReturnFeeDetail: function (_payFee) {
                vc.jumpToPage('/#/pages/property/propertyFee?feeId=' + _payFee.feeId);
            }
        }
    });
})(window.vc);