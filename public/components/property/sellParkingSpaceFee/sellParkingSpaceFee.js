/**
    出租车辆费用
**/
(function (vc) {

    vc.extends({
        propTypes: {
            callBackComponent: vc.propTypes.string,
            callBackFunction: vc.propTypes.string
        },
        data: {
            sellParkingSpaceFeeInfo: {
                configId: "",
                cycles: "",
                flowComponent: 'sellParkingSpaceFee',
                receivableAmount: "0.00",
                receivedAmount: "0.00",
                additionalAmount: '0.00',
                sellOrHire: "S",
                typeCd: '',
                feeConfigs: [],
                flowComponentShow: false
            }
        },
        watch: {
            sellParkingSpaceFeeInfo: {
                deep: true,
                handler: function () {
                    //console.log("hireParkingSpaceFeeInfo 被调用")
                    vc.component.saveSellParkingSpaceFee();

                }
            },
            "sellParkingSpaceFeeInfo.cycles": {//深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    vc.component.computeReceivableAmount(val);
                },
                deep: true
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('sellParkingSpaceFee', 'onIndex', function (_index) {
                vc.component.sellParkingSpaceFeeInfo.index = _index;
            });

            vc.on('sellParkingSpaceFee', 'flowComponentShow', function (_flowComponentShow) {
                vc.component.sellParkingSpaceFeeInfo.flowComponentShow = _flowComponentShow;
            });

            vc.on('sellParkingSpaceFee', 'callBackParkingSpaceInfo', function (_info) {
                vc.component.saveSellParkingSpaceFee();
            });

            vc.on('sellParkingSpaceFee', 'parkingSpaceInfo', function (_parkingSpaceInfo) {
                vc.component.sellParkingSpaceFeeInfo.typeCd = _parkingSpaceInfo.typeCd;
                vc.component._loadFireParkingSpaceFee();
            });

        },
        methods: {
            sellParkingSpaceFeeValidate: function () {
                return vc.validate.validate({
                    sellParkingSpaceFeeInfo: vc.component.sellParkingSpaceFeeInfo
                }, {
                    'sellParkingSpaceFeeInfo.receivedAmount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "实收金额不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "实收金额格式错误，如3.00"
                        }
                    ]
                });
            },
            saveSellParkingSpaceFee: function () {
                if (vc.component.sellParkingSpaceFeeValidate() && vc.component.sellParkingSpaceFeeInfo.flowComponentShow) {
                    //侦听回传
                    vc.emit($props.callBackComponent, $props.callBackFunction, vc.component.sellParkingSpaceFeeInfo);
                    return;
                }
            },
            _loadFireParkingSpaceFee: function () {
                //
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        typeCd: vc.component.sellParkingSpaceFeeInfo.typeCd,
                        page: 1,
                        row: 50
                    }
                };
                vc.http.get(
                    'hireParkingSpaceFee',
                    'loadSellParkingSpaceConfigData',
                    param,
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            var configFee = JSON.parse(json);
                            $that.sellParkingSpaceFeeInfo.feeConfigs = configFee;

                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });

            },
            computeReceivableAmount: function (_cycles) {
                if (_cycles == null || _cycles == "" || _cycles == undefined) {
                    _cycles = "0.00";
                }
                vc.component.sellParkingSpaceFeeInfo.receivableAmount = (parseFloat(vc.component.sellParkingSpaceFeeInfo.additionalAmount) * parseFloat(_cycles)).toFixed(2);
                vc.component.sellParkingSpaceFeeInfo.receivedAmount = vc.component.sellParkingSpaceFeeInfo.receivableAmount;
            },
            _changeFeeConfig: function () {
                $that.sellParkingSpaceFeeInfo.feeConfigs.forEach(function (_item) {
                    if (_item.configId == $that.sellParkingSpaceFeeInfo.configId) {
                        vc.component.sellParkingSpaceFeeInfo.additionalAmount = _item.additionalAmount;
                    }
                })
                //重新算费
                vc.component.computeReceivableAmount(vc.component.sellParkingSpaceFeeInfo.cycles);
            }
        }
    });

})(window.vc);