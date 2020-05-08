(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            purchaseApproversInfo: {
                flowComponent: 'purchaseApprovers',
                staffId: '',
                staffName: '',
            }
        },
        watch: {
            purchaseApproversInfo: {
                deep: true,
                handler: function () {
                    vc.component.savePurchaseApprovers();
                }
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
            vc.on("purchaseApprovers", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.purchaseApproversInfo.staffId = _param.staffId;
                    vc.component.purchaseApproversInfo.staffName = _param.staffName;
                }
            });
        },
        methods: {
            purchaseApproversValidate: function () {
                return vc.validate.validate({
                    purchaseApproversInfo: vc.component.purchaseApproversInfo
                }, {
                    'purchaseApproversInfo.staffId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "员工信息不正确"
                        },
                    ],
                    'purchaseApproversInfo.staffName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工名称不能为空"
                        }
                    ]
                });
            },
            savePurchaseApprovers: function () {
                if (vc.component.purchaseApproversValidate()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.purchaseApproversInfo);
                    return;
                }
            }
        }
    });

})(window.vc);