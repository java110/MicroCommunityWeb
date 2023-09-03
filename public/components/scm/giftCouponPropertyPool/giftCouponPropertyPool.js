(function (vc) {

    vc.extends({
        data: {
            giftCouponPropertyPoolInfo: {
                cppId: '',
                couponName: '',
                giftCount: '',
                tel: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('giftCouponPropertyPool', 'openGiftCouponPropertyPoolModal', function (_coupon) {
                vc.copyObject(_coupon, $that.giftCouponPropertyPoolInfo);
                $('#giftCouponPropertyPoolModel').modal('show');
            });
        },
        methods: {
            giftCouponPropertyPoolValidate() {
                return vc.validate.validate({
                    giftCouponPropertyPoolInfo: vc.component.giftCouponPropertyPoolInfo
                }, {
                    'giftCouponPropertyPoolInfo.cppId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "优惠券不能为空"
                        },
                    ],
                    'giftCouponPropertyPoolInfo.giftCount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "数量不能为空"
                        }
                    ],
                    'giftCouponPropertyPoolInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业主手机号不能为空"
                        }
                    ],
                });
            },
            _giftCouponPropertyPoolInfo: function () {
                if (!vc.component.giftCouponPropertyPoolValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.giftCouponPropertyPoolInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/couponProperty.giftCouponProperty',
                    JSON.stringify(vc.component.giftCouponPropertyPoolInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#giftCouponPropertyPoolModel').modal('hide');
                            vc.component.clearGiftCouponPropertyPoolInfo();
                            vc.emit('couponPropertyPoolManage', 'listCouponPropertyPool', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearGiftCouponPropertyPoolInfo: function () {
                vc.component.giftCouponPropertyPoolInfo = {
                    cppId: '',
                    couponName: '',
                    giftCount: '',
                    tel: '',

                };
            },
        }
    });

})(window.vc);
