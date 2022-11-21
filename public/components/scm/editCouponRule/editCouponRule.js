(function (vc, vm) {

    vc.extends({
        data: {
            editCouponRuleInfo: {
                ruleId: '',
                ruleName: '',
                remark: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editCouponRule', 'openEditCouponRuleModal', function (_params) {
                vc.component.refreshEditCouponRuleInfo();
                $('#editCouponRuleModel').modal('show');
                vc.copyObject(_params, vc.component.editCouponRuleInfo);
                vc.component.editCouponRuleInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCouponRuleValidate: function () {
                return vc.validate.validate({
                    editCouponRuleInfo: vc.component.editCouponRuleInfo
                }, {
                    'editCouponRuleInfo.ruleName': [
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
                    'editCouponRuleInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                    'editCouponRuleInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editCouponRule: function () {
                if (!vc.component.editCouponRuleValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/couponRule.updateCouponRule',
                    JSON.stringify(vc.component.editCouponRuleInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCouponRuleModel').modal('hide');
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
            refreshEditCouponRuleInfo: function () {
                vc.component.editCouponRuleInfo = {
                    ruleId: '',
                    ruleName: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
