(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addCouponRuleInfo: {
                ruleName: '',
                remark: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addCouponRule', 'openAddCouponRuleModal', function () {
                $('#addCouponRuleModel').modal('show');
            });
        },
        methods: {
            addCouponRuleValidate() {
                return vc.validate.validate({
                    addCouponRuleInfo: vc.component.addCouponRuleInfo
                }, {
                    'addCouponRuleInfo.ruleName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "规则名称不能超过64"
                        },
                    ],
                    'addCouponRuleInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                });
            },
            saveCouponRuleInfo: function () {
                if (!vc.component.addCouponRuleValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addCouponRuleInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/couponRule.saveCouponRule',
                    JSON.stringify(vc.component.addCouponRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addCouponRuleModel').modal('hide');
                            vc.component.clearAddCouponRuleInfo();
                            vc.emit('couponRuleManage', 'listCouponRule', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddCouponRuleInfo: function () {
                vc.component.addCouponRuleInfo = {
                    ruleName: '',
                    remark: '',
                };
            }
        }
    });

})(window.vc);
