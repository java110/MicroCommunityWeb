(function (vc, vm) {
    vc.extends({
        data: {
            editFeeFormulaInfo: {
                formulaId: '',
                formulaValue: '',
                formulaDesc: '',
                price: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editFeeFormula', 'openEditFeeFormulaModal', function (_params) {
                vc.component.refreshEditFeeFormulaInfo();
                $('#editFeeFormulaModel').modal('show');
                vc.copyObject(_params, vc.component.editFeeFormulaInfo);
                vc.component.editFeeFormulaInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editFeeFormulaValidate: function () {
                return vc.validate.validate({
                    editFeeFormulaInfo: vc.component.editFeeFormulaInfo
                }, {
                    'editFeeFormulaInfo.formulaValue': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "公式太复杂"
                        },
                    ],
                    'editFeeFormulaInfo.price': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "单价不能为空"
                        },
                        {
                            limit: "moneyModulus",
                            param: "",
                            errInfo: "单价填写有误，如1.5000"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "单价必须是数字"
                        }
                    ],
                    'editFeeFormulaInfo.formulaDesc': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述太长"
                        },
                    ],
                    'editFeeFormulaInfo.formulaId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公式ID不能为空"
                        }]
                });
            },
            editFeeFormula: function () {
                if (!vc.component.editFeeFormulaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/feeFormula/updateFeeFormula',
                    JSON.stringify(vc.component.editFeeFormulaInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editFeeFormulaModel').modal('hide');
                            vc.emit('feeFormulaManage', 'listFeeFormula', {});
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
            refreshEditFeeFormulaInfo: function () {
                vc.component.editFeeFormulaInfo = {
                    formulaId: '',
                    formulaValue: '',
                    formulaDesc: '',
                    price: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
