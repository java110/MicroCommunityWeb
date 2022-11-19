(function (vc, vm) {

    vc.extends({
        data: {
            editCouponPropertyPoolInfo: {
                cppId: '',
                couponName: '',
                fromType: '2002',
                toType: '',
                stock: '',
                validityDay: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editCouponPropertyPool', 'openEditCouponPropertyPoolModal', function (_params) {
                vc.component.refreshEditCouponPropertyPoolInfo();
                $('#editCouponPropertyPoolModel').modal('show');
                vc.copyObject(_params, vc.component.editCouponPropertyPoolInfo);
                vc.component.editCouponPropertyPoolInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCouponPropertyPoolValidate: function () {
                return vc.validate.validate({
                    editCouponPropertyPoolInfo: vc.component.editCouponPropertyPoolInfo
                }, {
                    'editCouponPropertyPoolInfo.couponName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "优惠券名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "优惠券名称不能超过64"
                        },
                    ],
                    'editCouponPropertyPoolInfo.fromType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "来自方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "来自方式不能超过12"
                        },
                    ],
                    'editCouponPropertyPoolInfo.toType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "用途不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "用途不能超过12"
                        },
                    ],
                    'editCouponPropertyPoolInfo.stock': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "数量不能超过12"
                        },
                    ],
                    'editCouponPropertyPoolInfo.validityDay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有效期'不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "有效期'不能超过12"
                        },
                    ],
                    'editCouponPropertyPoolInfo.cppId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editCouponPropertyPool: function () {
                if (!vc.component.editCouponPropertyPoolValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/couponProperty.updateCouponPropertyPool',
                    JSON.stringify(vc.component.editCouponPropertyPoolInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCouponPropertyPoolModel').modal('hide');
                            vc.emit('couponPropertyPoolManage', 'listCouponPropertyPool', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditCouponPropertyPoolInfo: function () {
                vc.component.editCouponPropertyPoolInfo = {
                    cppId: '',
                    couponName: '',
                    fromType: '2002',
                    toType: '',
                    stock: '',
                    validityDay: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
