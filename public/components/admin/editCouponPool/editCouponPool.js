(function(vc, vm) {

    vc.extends({
        data: {
            editCouponPoolInfo: {
                poolId: '',
                couponType: '',
                couponName: '',
                actualPrice: '',
                buyPrice: '',
                couponStock: '',
                validityDay: '',
                seq: '',
                state: ''

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editCouponPool', 'openEditCouponPoolModal', function(_params) {
                vc.component.refreshEditCouponPoolInfo();
                $('#editCouponPoolModel').modal('show');
                vc.copyObject(_params, vc.component.editCouponPoolInfo);
            });
        },
        methods: {
            editCouponPoolValidate: function() {
                return vc.validate.validate({
                    editCouponPoolInfo: vc.component.editCouponPoolInfo
                }, {
                    'editCouponPoolInfo.poolId': [{
                            limit: "required",
                            param: "",
                            errInfo: "池ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "池ID不能超过30"
                        },
                    ],
                    'editCouponPoolInfo.couponType': [{
                            limit: "required",
                            param: "",
                            errInfo: "优惠券类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "优惠券类型不能超过12"
                        },
                    ],
                    'editCouponPoolInfo.couponName': [{
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
                    'editCouponPoolInfo.actualPrice': [{
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
                    'editCouponPoolInfo.buyPrice': [{
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
                    'editCouponPoolInfo.couponStock': [{
                            limit: "required",
                            param: "",
                            errInfo: "数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "数量不能超过20"
                        },
                    ],
                    'editCouponPoolInfo.validityDay': [{
                            limit: "required",
                            param: "",
                            errInfo: "有效期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "20",
                            errInfo: "有效期不能超过20"
                        },
                    ],
                    'editCouponPoolInfo.seq': [{
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "排序不能超过11"
                        },
                    ]

                });
            },
            editCouponPool: function() {
                if (!vc.component.editCouponPoolValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'couponPool.updateCouponPool',
                    JSON.stringify(vc.component.editCouponPoolInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCouponPoolModel').modal('hide');
                            vc.emit('couponPoolManage', 'listCouponPool', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditCouponPoolInfo: function() {
                vc.component.editCouponPoolInfo = {
                    poolId: '',
                    couponType: '',
                    couponName: '',
                    actualPrice: '',
                    buyPrice: '',
                    couponStock: '',
                    validityDay: '',
                    seq: '',
                    state: ''

                }
            }
        }
    });

})(window.vc, window.vc.component);