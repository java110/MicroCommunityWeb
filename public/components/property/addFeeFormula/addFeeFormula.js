(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeFormulaInfo: {
                formulaId: '',
                formulaValue: '',
                formulaDesc: '',
                price: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addFeeFormula', 'openAddFeeFormulaModal', function () {
                $('#addFeeFormulaModel').modal('show');
            });
        },
        methods: {
            addFeeFormulaValidate() {
                return vc.validate.validate({
                    addFeeFormulaInfo: vc.component.addFeeFormulaInfo
                }, {
                    'addFeeFormulaInfo.formulaValue': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "公式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "公式太复杂"
                        }
                    ],
                    'addFeeFormulaInfo.price': [
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
                    'addFeeFormulaInfo.formulaDesc': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述太长"
                        }
                    ],
                });
            },
            saveFeeFormulaInfo: function () {
                if (!vc.component.addFeeFormulaValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addFeeFormulaInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeFormulaInfo);
                    $('#addFeeFormulaModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/feeFormula/saveFeeFormula',
                    JSON.stringify(vc.component.addFeeFormulaInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeFormulaModel').modal('hide');
                            vc.component.clearAddFeeFormulaInfo();
                            vc.emit('feeFormulaManage', 'listFeeFormula', {});
                            vc.toast("添加成功");
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
            clearAddFeeFormulaInfo: function () {
                vc.component.addFeeFormulaInfo = {
                    formulaValue: '',
                    formulaDesc: '',
                    price: ''
                };
            }
        }
    });
})(window.vc);
