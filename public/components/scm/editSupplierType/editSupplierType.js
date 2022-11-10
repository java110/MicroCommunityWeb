(function (vc, vm) {

    vc.extends({
        data: {
            editSupplierTypeInfo: {
                stId: '',
                typeCd: '',
                typeName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editSupplierType', 'openEditSupplierTypeModal', function (_params) {
                vc.component.refreshEditSupplierTypeInfo();
                $('#editSupplierTypeModel').modal('show');
                vc.copyObject(_params, vc.component.editSupplierTypeInfo);
            });
        },
        methods: {
            editSupplierTypeValidate: function () {
                return vc.validate.validate({
                    editSupplierTypeInfo: vc.component.editSupplierTypeInfo
                }, {
                    'editSupplierTypeInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "32",
                            errInfo: "类型编码不能超过32"
                        },
                    ],
                    'editSupplierTypeInfo.typeName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "255",
                            errInfo: "类型名称不能超过255"
                        },
                    ],
                    'editSupplierTypeInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                    'editSupplierTypeInfo.stId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editSupplierType: function () {
                if (!vc.component.editSupplierTypeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/supplierType.updateSupplierType',
                    JSON.stringify(vc.component.editSupplierTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editSupplierTypeModel').modal('hide');
                            vc.emit('supplierTypeManage', 'listSupplierType', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditSupplierTypeInfo: function () {
                vc.component.editSupplierTypeInfo = {
                    stId: '',
                    typeCd: '',
                    typeName: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
