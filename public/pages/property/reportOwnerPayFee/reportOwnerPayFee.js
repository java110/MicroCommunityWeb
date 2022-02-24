/**
 入驻小区
 **/
(function(vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            reportOwnerPayFeeInfo: {
                ownerPayFees: [],
                total: 0,
                records: 1,
                moreCondition: false,
                feeTypeCds: [],
                feeConfigDtos: [],
                conditions: {
                    feeTypeCd: '',
                    configId: '',
                    roomName: '',
                    ownerName: '',
                    pfYear: new Date().getFullYear()
                }
            }
        },
        _initMethod: function() {
            vc.component._listOwnerPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            //关联字典表费用类型
            vc.getDict('pay_fee_config', "fee_type_cd", function(_data) {
                vc.component.reportOwnerPayFeeInfo.feeTypeCds = _data;
            });
        },
        _initEvent: function() {
            vc.on('pagination', 'page_event', function(_currentPage) {
                vc.component._listOwnerPayFees(_currentPage, DEFAULT_ROWS);
            });
        },
        methods: {

            //查询
            _queryMethod: function() {
                vc.component._listOwnerPayFees(DEFAULT_PAGE, DEFAULT_ROWS);
            },
            //查询方法
            _listOwnerPayFees: function(_page, _rows) {
                vc.component.reportOwnerPayFeeInfo.conditions.page = _page;
                vc.component.reportOwnerPayFeeInfo.conditions.row = _rows;
                vc.component.reportOwnerPayFeeInfo.conditions.communityId = vc.getCurrentCommunity().communityId;
                var param = {
                    params: vc.component.reportOwnerPayFeeInfo.conditions
                };
                //发送get请求
                vc.http.apiGet('/reportOwnerPayFee/queryReportOwnerPayFee',
                    param,
                    function(json, res) {
                        var _reportOwnerPayFeeInfo = JSON.parse(json);
                        vc.component.reportOwnerPayFeeInfo.total = _reportOwnerPayFeeInfo.total;
                        vc.component.reportOwnerPayFeeInfo.records = _reportOwnerPayFeeInfo.records;
                        vc.component.reportOwnerPayFeeInfo.ownerPayFees = _reportOwnerPayFeeInfo.data;

                        vc.emit('pagination', 'init', {
                            total: vc.component.reportOwnerPayFeeInfo.records,
                            currentPage: _page,
                            dataCount: vc.component.reportOwnerPayFeeInfo.total
                        });
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _moreCondition: function() {
                if (vc.component.reportOwnerPayFeeInfo.moreCondition) {
                    vc.component.reportOwnerPayFeeInfo.moreCondition = false;
                } else {
                    vc.component.reportOwnerPayFeeInfo.moreCondition = true;
                }
            },
            _getAmountByMonth: function(_fee, month) {
                let _amount = 0;
                if (!_fee.hasOwnProperty('reportOwnerPayFeeDtos')) {
                    return _amount;
                }

                let _reportOwnerPayFeeDtos = _fee.reportOwnerPayFeeDtos;
                if (_reportOwnerPayFeeDtos.length == 0) {
                    return _amount;
                }

                _reportOwnerPayFeeDtos.forEach(item => {
                    if (item.pfMonth == month) {
                        _amount = item.amount;
                        return;
                    }
                });

                return _amount;
            },
            _getTotalAmount: function(_fee) {
                let _amount = 0;
                if (!_fee.hasOwnProperty('reportOwnerPayFeeDtos')) {
                    return _amount;
                }

                let _reportOwnerPayFeeDtos = _fee.reportOwnerPayFeeDtos;
                if (_reportOwnerPayFeeDtos.length == 0) {
                    return _amount;
                }

                _reportOwnerPayFeeDtos.forEach(item => {
                    _amount += parseInt(item.amount);
                });

                return _amount.toFixed(2);
            },
            _getReceivableTotalAmount: function(_fee) {
                let _amount = 0;
                if (!_fee.hasOwnProperty('reportOwnerPayFeeDtos')) {
                    return _amount;
                }

                let _reportOwnerPayFeeDtos = _fee.reportOwnerPayFeeDtos;
                if (_reportOwnerPayFeeDtos.length == 0) {
                    return _amount;
                }

                let _now = new Date();
                let _month = _now.getMonth() + 1;

                _reportOwnerPayFeeDtos.forEach(item => {
                    if (parseInt(item.pfMonth) <= _month) {
                        _amount += parseInt(item.amount);
                    }
                });

                return _amount.toFixed(2);
            },
            _getCollectTotalAmount: function(_fee) {
                let _amount = 0;
                if (!_fee.hasOwnProperty('reportOwnerPayFeeDtos')) {
                    return _amount;
                }

                let _reportOwnerPayFeeDtos = _fee.reportOwnerPayFeeDtos;
                if (_reportOwnerPayFeeDtos.length == 0) {
                    return _amount;
                }

                let _now = new Date();
                let _month = _now.getMonth() + 1;

                _reportOwnerPayFeeDtos.forEach(item => {
                    if (parseInt(item.pfMonth) > _month) {
                        _amount += parseInt(item.amount);
                    }
                });

                return _amount.toFixed(2);
            },
            _changeReporficientFeeTypeCd: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 50,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: $that.reportOwnerPayFeeInfo.conditions.feeTypeCd,
                        isDefault: '',
                        feeFlag: '',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.get('roomCreateFeeAdd', 'list', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        let _feeConfigs = _feeConfigManageInfo.feeConfigs
                        vc.component.reportOwnerPayFeeInfo.feeConfigDtos = _feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });
})(window.vc);