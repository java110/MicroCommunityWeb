(function(vc) {

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
                remark: '',
                toTypes: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addCouponPropertyPool', 'openAddCouponPropertyPoolModal', function() {
                $('#addCouponPropertyPoolModel').modal('show');
            });
        },
        methods: {
            addCouponPropertyPoolValidate() {
                return vc.validate.validate({
                    addCouponPropertyPoolInfo: $that.addCouponPropertyPoolInfo
                }, {
                    'addCouponPropertyPoolInfo.couponName': [{
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
                    'addCouponPropertyPoolInfo.fromType': [{
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
                    'addCouponPropertyPoolInfo.toType': [{
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
                    'addCouponPropertyPoolInfo.stock': [{
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
                    'addCouponPropertyPoolInfo.validityDay': [{
                            limit: "required",
                            param: "",
                            errInfo: "有效期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "有效期不能超过12"
                        },
                    ],
                });
            },
            saveCouponPropertyPoolInfo: function() {
                if (!$that.addCouponPropertyPoolValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                $that.addCouponPropertyPoolInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/couponProperty.saveCouponPropertyPool',
                    JSON.stringify($that.addCouponPropertyPoolInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponPropertyPoolModel').modal('hide');
                            $that.clearAddCouponPropertyPoolInfo();
                            vc.emit('couponPropertyPoolManage', 'listCouponPropertyPool', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddCouponPropertyPoolInfo: function() {
                $that.addCouponPropertyPoolInfo = {
                    couponName: '',
                    fromType: '2002',
                    toType: '',
                    stock: '',
                    validityDay: '',
                    remark: '',
                    toTypes: []

                };
            },
            _addChangeToType: function() {
                if (!$that.addCouponPropertyPoolInfo.toType) {
                    return;
                }

                let _param = {
                        params: {
                            beanName: $that.addCouponPropertyPoolInfo.toType,
                            page: 1,
                            row: 100
                        }
                    }
                    //发送get请求
                vc.http.apiGet('/couponKey.listCouponKey',
                    _param,
                    function(json, res) {
                        let _marketSmsManageInfo = JSON.parse(json);
                        $that.addCouponPropertyPoolInfo.toTypes = _marketSmsManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);