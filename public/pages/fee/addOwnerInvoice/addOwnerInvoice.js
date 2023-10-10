(function (vc) {

    vc.extends({
        data: {
            addOwnerInvoiceInfo: {
                oiId: '',
                ownerName: '',
                invoiceType: '',
                invoiceName: '',
                invoiceNum: '',
                invoiceAddress: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addOwnerInvoice', 'chooseOwnerInvoice', function (_owner) {
               vc.copyObject(_owner,$that.addOwnerInvoiceInfo);
                $that._loadFeeDetails();
            });
        },
        methods: {
            addOwnerInvoiceValidate() {
                return vc.validate.validate({
                    addOwnerInvoiceInfo: $that.addOwnerInvoiceInfo
                }, {
                    'addOwnerInvoiceInfo.ownerName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "业主名称不能超过64"
                        },
                    ],
                    'addOwnerInvoiceInfo.invoiceType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "发票类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "发票类型不能超过12"
                        },
                    ],
                    'addOwnerInvoiceInfo.invoiceName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "发票名头不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "发票名头不能超过64"
                        },
                    ],
                    'addOwnerInvoiceInfo.invoiceNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "纳税人识别号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "纳税人识别号不能超过64"
                        },
                    ],
                    'addOwnerInvoiceInfo.invoiceAddress': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "地址、电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "地址、电话不能超过64"
                        },
                    ],
                    'addOwnerInvoiceInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        },
                    ],
                });
            },
            saveOwnerInvoiceInfo: function () {
                if (!$that.addOwnerInvoiceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                $that.addOwnerInvoiceInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/invoice.saveOwnerInvoice',
                    JSON.stringify($that.addOwnerInvoiceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            _openChooseOwner: function () {
                vc.emit('searchOwnerInvoice', 'openSearchOwnerInvoiceModel', {});
            },

        }
    });

})(window.vc);
