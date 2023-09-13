(function (vc, vm) {

    vc.extends({
        data: {
            editPayFeeQrcodeInfo: {
                pfqId: '',
                qrcodeName: '',
                queryWay: '',
                smsValidate: '',
                customFee: '',
                preFee: 'OFF',
                content: '',
                qrCodeUrl:'',
                state:'ON',
                feeType:''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editPayFeeQrcode', 'openEditPayFeeQrcodeModal', function (_params) {
                $that.refreshEditPayFeeQrcodeInfo();
                $('#editPayFeeQrcodeModel').modal('show');
                vc.copyObject(_params, $that.editPayFeeQrcodeInfo);
                $that.editPayFeeQrcodeInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editPayFeeQrcodeValidate: function () {
                return vc.validate.validate({
                    editPayFeeQrcodeInfo: $that.editPayFeeQrcodeInfo
                }, {
                    'editPayFeeQrcodeInfo.qrcodeName': [
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
                    'editPayFeeQrcodeInfo.queryWay': [
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
                    'editPayFeeQrcodeInfo.smsValidate': [
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
                    'editPayFeeQrcodeInfo.customFee': [
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
                    'editPayFeeQrcodeInfo.preFee': [
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
                    'editPayFeeQrcodeInfo.content': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "提示内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "提示内容不能超过512"
                        },
                    ],
                    'editPayFeeQrcodeInfo.pfqId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editPayFeeQrcode: function () {
                if (!$that.editPayFeeQrcodeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/payFeeQrcode.updatePayFeeQrcode',
                    JSON.stringify($that.editPayFeeQrcodeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPayFeeQrcodeModel').modal('hide');
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
            refreshEditPayFeeQrcodeInfo: function () {
                $that.editPayFeeQrcodeInfo = {
                    pfqId: '',
                    qrcodeName: '',
                    queryWay: '',
                    smsValidate: '',
                    customFee: '',
                    preFee: 'OFF',
                    content: '',
                    qrCodeUrl:'',
                    state:'ON',
                    feeType:''
                }
            }
        }
    });

})(window.vc, window.$that);
