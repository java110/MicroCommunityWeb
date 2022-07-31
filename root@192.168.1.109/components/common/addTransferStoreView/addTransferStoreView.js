(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addTransferStoreInfo: {
                flowComponent: 'addTransferStoreView',
                description: '',
                endUserName: '',
                endUserTel: '',
                staffId: '',
                staffName: '',
                resOrderType: '',
                index: ''
            }
        },
        watch: {
            addTransferStoreInfo: {
                deep: true,
                handler: function () {
                    vc.component.saveAddComplainInfo();
                }
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

            vc.on("addTransferStoreInfo", "notify", function (_param) {
                if (_param.hasOwnProperty("staffId")) {
                    vc.component.addTransferStoreInfo.staffId = _param.staffId;
                    vc.component.addTransferStoreInfo.staffName = _param.staffName;
                }
            });

            vc.on('addTransferStoreInfo', 'onIndex', function (_index) {
                vc.component.addTransferStoreInfo.index = _index;
            });
        },
        methods: {
            addComplainValidate: function () {
                return vc.validate.validate({
                    addTransferStoreInfo: vc.component.addTransferStoreInfo
                }, {
                    'addTransferStoreInfo.description': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "转赠说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "转赠说明不能超过200位"
                        },
                    ],
                    // 'addTransferStoreInfo.endUserName': [
                    //     {
                    //         limit: "required",
                    //         param: "",
                    //         errInfo: "联系人不能为空"
                    //     },
                    //     {
                    //         limit: "maxLength",
                    //         param: "50",
                    //         errInfo: "联系人不能超过50位"
                    //     },
                    // ],
                    // 'addTransferStoreInfo.endUserTel': [
                    //     {
                    //         limit: "required",
                    //         param: "",
                    //         errInfo: "联系电话不能为空"
                    //     },
                    //     {
                    //         limit: "phone",
                    //         param: "",
                    //         errInfo: "不是有效手机号"
                    //     },
                    // ]

                });
            },
            saveAddComplainInfo: function () {
                if (vc.component.addComplainValidate()) {
                    //侦听回传
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addTransferStoreInfo);
                    return;
                }
            }
        }
    });

})(window.vc);
