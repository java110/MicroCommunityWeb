(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCouponDetailInfo: {
                detailId: '',
                poolId: '',
                shopId: '',
                couponName: '',
                actualPrice: '',
                buyPrice: '',
                amount: '',
                buyCount: '',
                validityDay: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addCouponDetail', 'openAddCouponDetailModal', function () {
                $('#addCouponDetailModel').modal('show');
            });
        },
        methods: {
            addCouponDetailValidate() {
                return vc.validate.validate({
                    addCouponDetailInfo: vc.component.addCouponDetailInfo
                }, {
                    'addCouponDetailInfo.poolId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "优惠券不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "优惠券不能超过30"
                        },
                    ],
                    'addCouponDetailInfo.shopId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "店铺ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "店铺ID不能超过30"
                        },
                    ],
                    'addCouponDetailInfo.couponName': [
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
                    'addCouponDetailInfo.actualPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "面值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "面值不能超过10"
                        },
                    ],
                    'addCouponDetailInfo.buyPrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "购买价格不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "购买价格不能超过10"
                        },
                    ],
                    'addCouponDetailInfo.amount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "付款金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "付款金额不能超过10"
                        },
                    ],
                    'addCouponDetailInfo.buyCount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "购买数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "购买数量不能超过20"
                        },
                    ],
                    'addCouponDetailInfo.validityDay': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "有效期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "有效期不能超过20"
                        },
                    ]




                });
            },
            saveCouponDetailInfo: function () {
                if (!vc.component.addCouponDetailValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addCouponDetailInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCouponDetailInfo);
                    $('#addCouponDetailModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'couponDetail.saveCouponDetail',
                    JSON.stringify(vc.component.addCouponDetailInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponDetailModel').modal('hide');
                            vc.component.clearAddCouponDetailInfo();
                            vc.emit('couponDetailManage', 'listCouponDetail', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddCouponDetailInfo: function () {
                vc.component.addCouponDetailInfo = {
                    detailId: '',
                    poolId: '',
                    shopId: '',
                    couponName: '',
                    actualPrice: '',
                    buyPrice: '',
                    amount: '',
                    buyCount: '',
                    validityDay: ''

                };
            }
        }
    });

})(window.vc);
