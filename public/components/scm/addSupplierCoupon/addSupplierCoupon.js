(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addSupplierCouponInfo: {
                couponId: '',
                name: '',
                supplierId: '',
                businessKey: '',
                valuePrice: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addSupplierCoupon', 'openAddSupplierCouponModal', function (_param) {
                vc.copyObject(_param,$that.addSupplierCouponInfo);
                $('#addSupplierCouponModel').modal('show');
            });
        },
        methods: {
            addSupplierCouponValidate() {
                return vc.validate.validate({
                    addSupplierCouponInfo: vc.component.addSupplierCouponInfo
                }, {
                    'addSupplierCouponInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'addSupplierCouponInfo.supplierId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "供应商不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "供应商不能超过30"
                        },
                    ],
                    
                    'addSupplierCouponInfo.businessKey': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业务ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "业务ID不能超过30"
                        },
                    ],
                    'addSupplierCouponInfo.valuePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "售价不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "售价不能超过10"
                        },
                    ],
                    'addSupplierCouponInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "1024",
                            errInfo: "备注'不能超过1024"
                        },
                    ],




                });
            },
            saveSupplierCouponInfo: function () {
                if (!vc.component.addSupplierCouponValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.http.apiPost(
                    '/supplierCoupon.saveSupplierCoupon',
                    JSON.stringify(vc.component.addSupplierCouponInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addSupplierCouponModel').modal('hide');
                            vc.component.clearAddSupplierCouponInfo();
                            vc.emit('supplierCoupon', 'listSupplierCoupon', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddSupplierCouponInfo: function () {
                vc.component.addSupplierCouponInfo = {
                    name: '',
                    supplierId: '',
                    businessKey: '',
                    valuePrice: '',
                    remark: '',

                };
            }
        }
    });

})(window.vc);
