/**
业主详情页面
 **/
(function (vc) {
    vc.extends({
        data: {
            feeDetailInfo: {
                configId: '',
                feeTypeCdName: '',
                feeName: '',
                feeFlagName: '',
                startTime: '',
                endTime: '',
                computingFormulaName: '',
                squarePrice: '',
                additionalAmount: '0.00',
                isDefault: '',
                billTypeName: '',
                paymentCycle: '',
                paymentCd: '',
                computingFormulaText: '',
                deductFrom: '',
                payOnline: 'Y',
                scale: '1',
                decimalPlace: '2',
                units: '元',
                _currentTab: 'feeConfigDetailHis',
                needBack: false,
            }
        },
        _initMethod: function () {
            $that.feeDetailInfo.configId = vc.getParam('configId');
            if (!vc.notNull($that.feeDetailInfo.configId)) {
                return;
            }
            vc.component._loadFeeDetailInfo();

        },
        _initEvent: function () {
            vc.on('feeDetail', 'listCarData', function (_info) {
                //vc.component._loadFeeDetailInfo();
                $that.changeTab($that.feeDetailInfo._currentTab);
            });
        },
        methods: {
            _loadFeeDetailInfo: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        configId: $that.feeDetailInfo.configId,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs',
                    param,
                    function (json) {
                        let _feeConfig = JSON.parse(json);
                        // 员工列表 和 岗位列表匹配
                        vc.copyObject(_feeConfig.feeConfigs[0], $that.feeDetailInfo);
                        $that.changeTab($that.feeDetailInfo._currentTab);
                    },
                    function () {
                        console.log('请求失败处理');
                    }
                );
            },
            changeTab: function (_tab) {
                $that.feeDetailInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', {
                    configId: $that.feeDetailInfo.configId,
                });
            },
            _openEditOwnerCar: function () {
                vc.emit('editCar', 'openEditCar', $that.feeDetailInfo);
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
        }
    });
})(window.vc);