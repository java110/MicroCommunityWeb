(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPayFeeQrcodeInfo: {
                pfqId: '',
                qrcodeName: '',
                queryWay: '',
                smsValidate: '',
                customFee: '',
                preFee: '',
                content: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addPayFeeQrcode', 'openAddPayFeeQrcodeModal', function () {
                $('#addPayFeeQrcodeModel').modal('show');
            });
        },
        methods: {
            addPayFeeQrcodeValidate() {
                return vc.validate.validate({
                    addPayFeeQrcodeInfo: $that.addPayFeeQrcodeInfo
                }, {
                    'addPayFeeQrcodeInfo.qrcodeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "名称不能超过128"
                        },
                    ],
                    'addPayFeeQrcodeInfo.queryWay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "查询方式不能超过12"
                        },
                    ],
                    'addPayFeeQrcodeInfo.smsValidate': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "验证不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "验证不能超过12"
                        },
                    ],
                    'addPayFeeQrcodeInfo.customFee': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "自定义缴费不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "自定义缴费不能超过12"
                        },
                    ],
                    'addPayFeeQrcodeInfo.preFee': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预交费不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "预交费不能超过12"
                        },
                    ],
                    'addPayFeeQrcodeInfo.content': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "提示内容不能为空"
                        },
                    ],
                });
            },
            savePayFeeQrcodeInfo: function () {
                if (!$that.addPayFeeQrcodeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                $that.addPayFeeQrcodeInfo.communityId = vc.getCurrentCommunity().communityId;
            

                vc.http.apiPost(
                    '/payFeeQrcode.savePayFeeQrcode',
                    JSON.stringify($that.addPayFeeQrcodeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPayFeeQrcodeModel').modal('hide');
                            $that.clearAddPayFeeQrcodeInfo();
                            vc.emit('payFeeQrcode', 'listPayFeeQrcode', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddPayFeeQrcodeInfo: function () {
                $that.addPayFeeQrcodeInfo = {
                    qrcodeName: '',
                    queryWay: '',
                    smsValidate: '',
                    customFee: '',
                    preFee: '',
                    content: '',

                };
            }
        }
    });

})(window.vc);
