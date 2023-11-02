(function (vc) {
    vc.extends({
        data: {
            feeRemindInfo: {
                _currentTab: 'reportPrePaymentFee',
                feeConfigs: [],
                moreCondition: false,
                conditions: {
                    objName: '',
                    configId: '',
                    ownerName: '',
                    link: '',
                    communityId: vc.getCurrentCommunity().communityId
                }
            }
        },
        _initMethod: function () {
            $that._listFeeConfigs();
            vc.component.changeTab($that.feeRemindInfo._currentTab);
        },
        _initEvent: function () {
            vc.on("indexContext", "_queryIndexContextData", function (_param) {
            });
        },
        methods: {
            changeTab: function (_tab) {
                $that.feeRemindInfo._currentTab = _tab;
                vc.emit(_tab, 'switch', $that.feeRemindInfo.conditions)
            },
            _queryMethod: function () {
                vc.component.changeTab($that.feeRemindInfo._currentTab);
            },
            _listFeeConfigs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        isDefault: 'F'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _feeConfigManageInfo = JSON.parse(json);
                        $that.feeRemindInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
            _moreCondition: function () {
                if (vc.component.feeRemindInfo.moreCondition) {
                    vc.component.feeRemindInfo.moreCondition = false;
                } else {
                    vc.component.feeRemindInfo.moreCondition = true;
                }
            }
        }
    })
})(window.vc);