(function (vc, vm) {

    vc.extends({
        data: {
            editCouponDetailInfo: {
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
            vc.on('editCouponDetail', 'openEditCouponDetailModal', function (_params) {
                vc.component.refreshEditCouponDetailInfo();
                $('#editCouponDetailModel').modal('show');
                vc.copyObject(_params, vc.component.editCouponDetailInfo);
                vc.component.editCouponDetailInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCouponDetailValidate: function () {
                return vc.validate.validate({
                    editCouponDetailInfo: vc.component.editCouponDetailInfo
                }, {
                    'editCouponDetailInfo.detailId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "记录ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "记录ID不能超过30"
                        },
                    ],
                    'editCouponDetailInfo.poolId': [
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
                    'editCouponDetailInfo.shopId': [
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
                    'editCouponDetailInfo.couponName': [
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
                    'editCouponDetailInfo.actualPrice': [
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
                    'editCouponDetailInfo.buyPrice': [
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
                    'editCouponDetailInfo.amount': [
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
                    'editCouponDetailInfo.buyCount': [
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
                    'editCouponDetailInfo.validityDay': [
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
            editCouponDetail: function () {
                if (!vc.component.editCouponDetailValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'couponDetail.updateCouponDetail',
                    JSON.stringify(vc.component.editCouponDetailInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCouponDetailModel').modal('hide');
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
            refreshEditCouponDetailInfo: function () {
                vc.component.editCouponDetailInfo = {
                    detailId: '',
                    detailId: '',
                    poolId: '',
                    shopId: '',
                    couponName: '',
                    actualPrice: '',
                    buyPrice: '',
                    amount: '',
                    buyCount: '',
                    validityDay: '',
                    primary: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
