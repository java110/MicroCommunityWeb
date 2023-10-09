(function (vc, vm) {

    vc.extends({
        data: {
            editOwnerInvoiceInfo: {
                oiId: '',
                ownerId:'',
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
            vc.on('editOwnerInvoice', 'openEditOwnerInvoiceModal', function (_params) {
                $that.refreshEditOwnerInvoiceInfo();
                $('#editOwnerInvoiceModel').modal('show');
                vc.copyObject(_params, $that.editOwnerInvoiceInfo);
                $that.editOwnerInvoiceInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editOwnerInvoiceValidate: function () {
                return vc.validate.validate({
                    editOwnerInvoiceInfo: $that.editOwnerInvoiceInfo
                }, {
                    'editOwnerInvoiceInfo.ownerName': [
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
                    'editOwnerInvoiceInfo.invoiceType': [
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
                    'editOwnerInvoiceInfo.invoiceName': [
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
                    'editOwnerInvoiceInfo.invoiceNum': [
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
                    'editOwnerInvoiceInfo.invoiceAddress': [
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
                    'editOwnerInvoiceInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        },
                    ],
                    'editOwnerInvoiceInfo.oiId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editOwnerInvoice: function () {
                if (!$that.editOwnerInvoiceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/invoice.updateOwnerInvoice',
                    JSON.stringify($that.editOwnerInvoiceInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editOwnerInvoiceModel').modal('hide');
                            vc.emit('ownerInvoice', 'listOwnerInvoice', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditOwnerInvoiceInfo: function () {
                $that.editOwnerInvoiceInfo = {
                    oiId: '',
                    ownerName: '',
                    invoiceType: '',
                    invoiceName: '',
                    invoiceNum: '',
                    invoiceAddress: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.$that);
