(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCouponPoolInfo: {
                poolId: '',
                couponType: '',
                couponName: '',
                actualPrice: '',
                buyPrice: '',
                couponStock: '',
                validityDay: '',
                seq: ''

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addCouponPool', 'openAddCouponPoolModal', function() {
                $('#addCouponPoolModel').modal('show');
            });
        },
        methods: {
            addCouponPoolValidate() {
                return vc.validate.validate({
                    addCouponPoolInfo: vc.component.addCouponPoolInfo
                }, {
                    'addCouponPoolInfo.couponType': [{
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
                    'addCouponPoolInfo.couponName': [{
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
                    'addCouponPoolInfo.actualPrice': [{
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
                    'addCouponPoolInfo.buyPrice': [{
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
                    'addCouponPoolInfo.couponStock': [{
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
                    'addCouponPoolInfo.validityDay': [{
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
                    'addCouponPoolInfo.seq': [{
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
            saveCouponPoolInfo: function() {
                if (!vc.component.addCouponPoolValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addCouponPoolInfo);
                    $('#addCouponPoolModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    'couponPool.saveCouponPool',
                    JSON.stringify(vc.component.addCouponPoolInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponPoolModel').modal('hide');
                            vc.component.clearAddCouponPoolInfo();
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
            clearAddCouponPoolInfo: function() {
                vc.component.addCouponPoolInfo = {
                    couponType: '',
                    couponName: '',
                    actualPrice: '',
                    buyPrice: '',
                    couponStock: '',
                    validityDay: '',
                    seq: ''
                };
            }
        }
    });

})(window.vc);