(function (vc, vm) {
    vc.extends({
        data: {
            editFeeDiscountInfo: {
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
            vc.on('editFeeDiscount', 'openEditFeeDiscountModal', function (_params) {
                vc.component.refreshEditFeeDiscountInfo();
                $('#editFeeDiscountModel').modal('show');
                vc.copyObject(_params, vc.component.editFeeDiscountInfo);
                $that.editFeeDiscountInfo.feeDiscountRuleSpecs = _params.feeDiscountSpecs;
                $that._loadEditFeeDiscountRules();
                vc.component.editFeeDiscountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editFeeDiscountValidate: function () {
                return vc.validate.validate({
                    editFeeDiscountInfo: vc.component.editFeeDiscountInfo
                }, {
                    'editFeeDiscountInfo.discountName': [
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
                    'editFeeDiscountInfo.discountType': [
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
                    'editFeeDiscountInfo.ruleId': [
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
                    'editFeeDiscountInfo.discountDesc': [

                        {
                            limit: "maxLength",
                            param: "500",
                            errInfo: "描述不能超过500位"
                        },
                    ],
                    'editFeeDiscountInfo.discountId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "折扣ID不能为空"
                        }]
                });
            },
            editFeeDiscount: function () {
                if (!vc.component.editFeeDiscountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                let _saveFlag = true;
                if ($that.editFeeDiscountInfo.feeDiscountRuleSpecs != null || $that.editFeeDiscountInfo.feeDiscountRuleSpecs.length > 0) {
                    $that.editFeeDiscountInfo.feeDiscountRuleSpecs.forEach(item => {
                        if (item.specValue == null || item.specValue == '' || item.specValue == undefined) {
                            vc.toast(item.specName + "不能为空！");
                            _saveFlag = false;
                            throw new Error(item.specName + "不能为空！");
                        }
                    });
                }
                if (!_saveFlag) {
                    return;
                }
                vc.http.apiPost(
                    '/feeDiscount/updateFeeDiscount',
                    JSON.stringify(vc.component.editFeeDiscountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeDiscountModel').modal('hide');
                            vc.emit('feeDiscountManage', 'listFeeDiscount', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditFeeDiscountInfo: function () {
                vc.component.editFeeDiscountInfo = {
                    discountId: '',
                    discountName: '',
                    discountType: '',
                    ruleId: '',
                    discountDesc: '',
                    rules: [],
                    feeDiscountRuleSpecs: []
                }
            },
            _loadEditFeeDiscountRules: function () {
                if ($that.editFeeDiscountInfo.discountType == '') {
                    return;
                }
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        discountType: $that.editFeeDiscountInfo.discountType
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeDiscount/queryFeeDiscountRule',
                    param,
                    function (json, res) {
                        var _feeDiscountManageInfo = JSON.parse(json);
                        $that.editFeeDiscountInfo.rules = _feeDiscountManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeEditFeeDiscountRule: function () {
                let _rules = $that.editFeeDiscountInfo.rules;
                _rules.forEach(item => {
                    if (item.ruleId == $that.editFeeDiscountInfo.ruleId) {
                        item.feeDiscountRuleSpecs.forEach(specItem => {
                            specItem.specValue = "";
                        })
                        $that.editFeeDiscountInfo.feeDiscountRuleSpecs = item.feeDiscountRuleSpecs;
                    }
                });
            },
            _changeEditFeeDiscountType: function () {
                $that._loadEditFeeDiscountRules();
            }
        }
    });
})(window.vc, window.vc.component);
