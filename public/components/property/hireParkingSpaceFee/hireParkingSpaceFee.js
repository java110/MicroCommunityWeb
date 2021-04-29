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
            hireParkingSpaceFeeInfo: {
                flowComponent: 'hireParkingSpaceFee',
                cycles: "",
                receivableAmount: "0.00",
                receivedAmount: "0.00",
                additionalAmount: '0.00',
                sellOrHire: "H",
                typeCd: '',
                feeConfigs: [],
                configId:''
            }
        },
        watch: {
            hireParkingSpaceFeeInfo: {
                deep: true,
                handler: function () {
                    //console.log("hireParkingSpaceFeeInfo 被调用")
                    vc.component.saveHireParkingSpaceFee();
                }
            },
            "hireParkingSpaceFeeInfo.cycles": {//深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    vc.component.computeReceivableAmount(val);
                },
                deep: true
            }


        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('hireParkingSpaceFee', 'onIndex', function (_index) {
                vc.component.hireParkingSpaceFeeInfo.index = _index;
            });

            vc.on('hireParkingSpaceFee', 'parkingSpaceInfo', function (_parkingSpaceInfo) {
                vc.component.hireParkingSpaceFeeInfo.typeCd = _parkingSpaceInfo.typeCd;
                vc.component._loadFireParkingSpaceFee();
            });

        },
        methods: {
            hireParkingSpaceFeeValidate: function () {
                return vc.validate.validate({
                    hireParkingSpaceFeeInfo: vc.component.hireParkingSpaceFeeInfo
                }, {

                    'hireParkingSpaceFeeInfo.cycles': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "缴费周期不能为空"
                        }
                    ],
                    'hireParkingSpaceFeeInfo.receivedAmount': [
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
            saveHireParkingSpaceFee: function () {
                if (vc.component.hireParkingSpaceFeeValidate()) {
                    //侦听回传
                    vc.emit($props.callBackComponent, $props.callBackFunction, vc.component.hireParkingSpaceFeeInfo);
                    return;
                }
            },
            _loadFireParkingSpaceFee: function () {
                //
                var param = {
                    params: {
                        communityId: vc.getCurrentCommunity().communityId,
                        typeCd: vc.component.hireParkingSpaceFeeInfo.typeCd,
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
                            $that.hireParkingSpaceFeeInfo.feeConfigs = configFee;
                           
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
                vc.component.hireParkingSpaceFeeInfo.receivableAmount = (parseFloat(vc.component.hireParkingSpaceFeeInfo.additionalAmount) * parseFloat(_cycles)).toFixed(2);
                vc.component.hireParkingSpaceFeeInfo.receivedAmount = vc.component.hireParkingSpaceFeeInfo.receivableAmount;
            },
            _changeFeeConfig:function(){
                $that.hireParkingSpaceFeeInfo.feeConfigs.forEach(function(_item){
                    if(_item.configId == $that.hireParkingSpaceFeeInfo.configId){
                        vc.component.hireParkingSpaceFeeInfo.additionalAmount = _item.additionalAmount;
                    }
                })
                //重新算费
                vc.component.computeReceivableAmount(vc.component.hireParkingSpaceFeeInfo.cycles);
            }

        }
    });

})(window.vc);