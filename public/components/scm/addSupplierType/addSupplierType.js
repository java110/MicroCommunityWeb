(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addSupplierTypeInfo: {
                stId: '',
                typeCd: '',
                typeName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addSupplierType', 'openAddSupplierTypeModal', function () {
                $('#addSupplierTypeModel').modal('show');
            });
        },
        methods: {
            addSupplierTypeValidate() {
                return vc.validate.validate({
                    addSupplierTypeInfo: vc.component.addSupplierTypeInfo
                }, {
                    'addSupplierTypeInfo.typeCd': [
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
                    'addSupplierTypeInfo.typeName': [
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
                    'addSupplierTypeInfo.remark': [
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
                });
            },
            saveSupplierTypeInfo: function () {
                if (!vc.component.addSupplierTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.http.apiPost(
                    '/supplierType.saveSupplierType',
                    JSON.stringify(vc.component.addSupplierTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addSupplierTypeModel').modal('hide');
                            vc.component.clearAddSupplierTypeInfo();
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
            clearAddSupplierTypeInfo: function () {
                vc.component.addSupplierTypeInfo = {
                    typeCd: '',
                    typeName: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
