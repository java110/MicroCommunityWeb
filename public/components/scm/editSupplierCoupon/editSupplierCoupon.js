(function (vc, vm) {

    vc.extends({
        data: {
            editSupplierCouponInfo: {
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
            vc.on('editSupplierCoupon', 'openEditSupplierCouponModal', function (_params) {
                vc.component.refreshEditSupplierCouponInfo();
                $('#editSupplierCouponModel').modal('show');
                vc.copyObject(_params, vc.component.editSupplierCouponInfo);
            });
        },
        methods: {
            editSupplierCouponValidate: function () {
                return vc.validate.validate({
                    editSupplierCouponInfo: vc.component.editSupplierCouponInfo
                }, {
                    'editSupplierCouponInfo.name': [
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
                    'editSupplierCouponInfo.supplierId': [
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
                    'editSupplierCouponInfo.businessKey': [
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
                    'editSupplierCouponInfo.valuePrice': [
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
                    'editSupplierCouponInfo.remark': [
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
                    'editSupplierCouponInfo.couponId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editSupplierCoupon: function () {
                if (!vc.component.editSupplierCouponValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/supplierCoupon.updateSupplierCoupon',
                    JSON.stringify(vc.component.editSupplierCouponInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editSupplierCouponModel').modal('hide');
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
            refreshEditSupplierCouponInfo: function () {
                vc.component.editSupplierCouponInfo = {
                    couponId: '',
                    name: '',
                    supplierId: '',
                    businessKey: '',
                    valuePrice: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
