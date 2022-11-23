(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCouponRuleCppsInfo: {
                crcId: '',
                cppId: '',
                quantity: '',
                ruleId:'',
                couponPropertyPools:[]
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addCouponRuleCpps', 'openAddCouponRuleCppsModal', function (_rule) {
                vc.copyObject(_rule,$that.addCouponRuleCppsInfo);
                $that._listAddCouponPropertyPools();
                $('#addCouponRuleCppsModel').modal('show');
            });
        },
        methods: {
            addCouponRuleCppsValidate() {
                return vc.validate.validate({
                    addCouponRuleCppsInfo: vc.component.addCouponRuleCppsInfo
                }, {
                    'addCouponRuleCppsInfo.cppId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "优惠券不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "优惠券不能超过64"
                        },
                    ],
                    'addCouponRuleCppsInfo.quantity': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "赠送数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "赠送数量不能超过30"
                        },
                    ],
                });
            },
            saveCouponRuleCppsInfo: function () {
                if (!vc.component.addCouponRuleCppsValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addCouponRuleCppsInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/couponRule.saveCouponRuleCpps',
                    JSON.stringify(vc.component.addCouponRuleCppsInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponRuleCppsModel').modal('hide');
                            vc.component.clearAddCouponRuleCppsInfo();
                            vc.emit('couponRuleCppsManage', 'listCouponRuleCpps', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            _listAddCouponPropertyPools: function (_page, _rows) {
                let param = {
                    params: {
                        page:1,
                        row:100,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };

                //发送get请求
                vc.http.apiGet('/couponProperty.listCouponPropertyPool',
                    param,
                    function (json, res) {
                        var _couponPropertyPoolManageInfo = JSON.parse(json);
                        vc.component.addCouponRuleCppsInfo.couponPropertyPools = _couponPropertyPoolManageInfo.data;
                       
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddCouponRuleCppsInfo: function () {
                vc.component.addCouponRuleCppsInfo = {
                    cppId: '',
                    quantity: '',
                    ruleId:'',
                    couponPropertyPools:[]

                };
            }
        }
    });

})(window.vc);
