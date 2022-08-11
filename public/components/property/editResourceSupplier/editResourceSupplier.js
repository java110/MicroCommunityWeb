(function (vc, vm) {
    vc.extends({
        data: {
            editResourceSupplierInfo: {
                rsId: '',
                supplierName: '',
                address: '',
                tel: '',
                contactName: '',
                accountBank: '',
                bankAccountNumber: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editResourceSupplier', 'openEditResourceSupplierModal', function (_params) {
                vc.component.refreshEditResourceSupplierInfo();
                $('#editResourceSupplierModel').modal('show');
                vc.copyObject(_params, vc.component.editResourceSupplierInfo);
                vc.component.editResourceSupplierInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editResourceSupplierValidate: function () {
                return vc.validate.validate({
                    editResourceSupplierInfo: vc.component.editResourceSupplierInfo
                }, {
                    'editResourceSupplierInfo.supplierName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "供应商名称太长"
                        },
                    ],
                    'editResourceSupplierInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "供应商地址太长"
                        },
                    ],
                    'editResourceSupplierInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商联系方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "手机号格式错误"
                        },
                        {
                            limit: "minLength",
                            param: "11",
                            errInfo: "手机号格式错误"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "手机号格式错误"
                        },
                    ],
                    'editResourceSupplierInfo.contactName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人姓名不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "供应商联系人姓名太长"
                        },
                    ],
                    'editResourceSupplierInfo.accountBank': [
                        {
                            limit: "maxLength",
                            param: "150",
                            errInfo: "供应商开户行太长"
                        },
                    ],
                    'editResourceSupplierInfo.bankAccountNumber': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "供应商开户行账号太长"
                        },
                    ],
                    'editResourceSupplierInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],
                    'editResourceSupplierInfo.rsId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商编号不能为空"
                        }
                    ]
                });
            },
            editResourceSupplier: function () {
                if (!vc.component.editResourceSupplierValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'resourceSupplier.updateResourceSupplier',
                    JSON.stringify(vc.component.editResourceSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editResourceSupplierModel').modal('hide');
                            vc.emit('resourceSupplierManage', 'listResourceSupplier', {});
                            vc.toast("修改成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditResourceSupplierInfo: function () {
                vc.component.editResourceSupplierInfo = {
                    rsId: '',
                    supplierName: '',
                    address: '',
                    tel: '',
                    contactName: '',
                    accountBank: '',
                    bankAccountNumber: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
