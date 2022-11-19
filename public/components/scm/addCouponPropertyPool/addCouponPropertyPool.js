(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCouponPropertyPoolInfo: {
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
            vc.on('addCouponPropertyPool', 'openAddCouponPropertyPoolModal', function () {
                $('#addCouponPropertyPoolModel').modal('show');
            });
        },
        methods: {
            addCouponPropertyPoolValidate() {
                return vc.validate.validate({
                    addCouponPropertyPoolInfo: vc.component.addCouponPropertyPoolInfo
                }, {
                    'addCouponPropertyPoolInfo.couponName': [
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
                    'addCouponPropertyPoolInfo.fromType': [
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
                    'addCouponPropertyPoolInfo.toType': [
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
                    'addCouponPropertyPoolInfo.stock': [
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
                    'addCouponPropertyPoolInfo.validityDay': [
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




                });
            },
            saveCouponPropertyPoolInfo: function () {
                if (!vc.component.addCouponPropertyPoolValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addCouponPropertyPoolInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/couponProperty.saveCouponPropertyPool',
                    JSON.stringify(vc.component.addCouponPropertyPoolInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponPropertyPoolModel').modal('hide');
                            vc.component.clearAddCouponPropertyPoolInfo();
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
            clearAddCouponPropertyPoolInfo: function () {
                vc.component.addCouponPropertyPoolInfo = {
                    couponName: '',
                    fromType: '2002',
                    toType: '',
                    stock: '',
                    validityDay: '',

                };
            }
        }
    });

})(window.vc);
