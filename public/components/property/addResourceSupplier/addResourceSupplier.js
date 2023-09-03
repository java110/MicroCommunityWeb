(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addResourceSupplierInfo: {
                rs_id: '',
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
            vc.on('addResourceSupplier', 'openAddResourceSupplierModal', function () {
                $('#addResourceSupplierModel').modal('show');
            });
        },
        methods: {
            addResourceSupplierValidate() {
                return vc.validate.validate({
                    addResourceSupplierInfo: vc.component.addResourceSupplierInfo
                }, {
                    'addResourceSupplierInfo.supplierName': [
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
                    'addResourceSupplierInfo.address': [
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
                    'addResourceSupplierInfo.tel': [
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
                    'addResourceSupplierInfo.contactName': [
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
                    'addResourceSupplierInfo.accountBank': [
                        {
                            limit: "maxLength",
                            param: "150",
                            errInfo: "供应商开户行太长"
                        },
                    ],
                    'addResourceSupplierInfo.bankAccountNumber': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "供应商开户行账号太长"
                        },
                    ],
                    'addResourceSupplierInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ]
                });
            },
            saveResourceSupplierInfo: function () {
                if (!vc.component.addResourceSupplierValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addResourceSupplierInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addResourceSupplierInfo);
                    $('#addResourceSupplierModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'resourceSupplier.saveResourceSupplier',
                    JSON.stringify(vc.component.addResourceSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addResourceSupplierModel').modal('hide');
                            vc.component.clearAddResourceSupplierInfo();
                            vc.emit('resourceSupplierManage', 'listResourceSupplier', {});
                            vc.toast("添加成功")
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddResourceSupplierInfo: function () {
                vc.component.addResourceSupplierInfo = {
                    supplierName: '',
                    address: '',
                    tel: '',
                    contactName: '',
                    accountBank: '',
                    bankAccountNumber: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
