(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeDiscountInfo: {
                discountId: '',
                discountName: '',
                discountType: '',
                ruleId: '',
                discountDesc: '',
                rules: [],
                feeDiscountRuleSpecs: []

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addFeeDiscount', 'openAddFeeDiscountModal', function () {

                $('#addFeeDiscountModel').modal('show');
            });
        },
        methods: {
            addFeeDiscountValidate() {
                return vc.validate.validate({
                    addFeeDiscountInfo: vc.component.addFeeDiscountInfo
                }, {
                    'addFeeDiscountInfo.discountName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "折扣名称不能超过256位"
                        },
                    ],
                    'addFeeDiscountInfo.discountType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "折扣类型格式错误"
                        },
                    ],
                    'addFeeDiscountInfo.ruleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规则不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "规则不是有效数字"
                        },
                    ],
                    'addFeeDiscountInfo.discountDesc': [
                       
                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "描述不能超过500位"
                        },
                    ],




                });
            },
            saveFeeDiscountInfo: function () {
                if (!vc.component.addFeeDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addFeeDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeDiscountInfo);
                    $('#addFeeDiscountModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/feeDiscount/saveFeeDiscount',
                    JSON.stringify(vc.component.addFeeDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeDiscountModel').modal('hide');
                            vc.component.clearAddFeeDiscountInfo();
                            vc.emit('feeDiscountManage', 'listFeeDiscount', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddFeeDiscountInfo: function () {
                vc.component.addFeeDiscountInfo = {
                    discountName: '',
                    discountType: '',
                    ruleId: '',
                    discountDesc: '',
                    rules: [],
                    feeDiscountRuleSpecs: []
                };
            },
            _loadAddFeeDiscountRules: function () {

                if ($that.addFeeDiscountInfo.discountType == '') {
                    return;
                }

                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        discountType: $that.addFeeDiscountInfo.discountType
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscountRule',
                    param,
                    function (json, res) {
                        var _feeDiscountManageInfo = JSON.parse(json);
                        $that.addFeeDiscountInfo.rules = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeAddFeeDiscountRule: function () {
                let _rules = $that.addFeeDiscountInfo.rules;
                _rules.forEach(item => {
                    if (item.ruleId == $that.addFeeDiscountInfo.ruleId) {
                        item.feeDiscountRuleSpecs.forEach(specItem => {
                            specItem.specValue = "";
                        })
                        $that.addFeeDiscountInfo.feeDiscountRuleSpecs = item.feeDiscountRuleSpecs;

                    }
                });
            },
            _changeAddFeeDiscountType: function () {
                $that._loadAddFeeDiscountRules();
            }
        }
    });

})(window.vc);
