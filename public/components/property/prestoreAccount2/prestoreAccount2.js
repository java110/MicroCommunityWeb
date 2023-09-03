(function (vc) {
    vc.extends({
        data: {
            prestoreAccount2Info: {
                tel: '',
                ownerId: '',
                owners: [],
                amount: '',
                remark: '',
                receivedAmount: '',
                redepositAmount: '',
                totalAmount: '',
                acctType: '',
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('prestoreAccount2', 'openAddModal', function () {
                $('#prestoreAccount2Model').modal('show');
            });

            vc.on('prestoreAccount2', 'openAddModalWithParams', function (_param) {
                vc.component.prestoreAccount2Info.acctType = _param.acctType;
                vc.component.prestoreAccount2Info.amount = _param.redepositAmount;
                vc.component.prestoreAccount2Info.redepositAmount = _param.redepositAmount;
                vc.component.prestoreAccount2Info.receivedAmount = _param.receivedAmount;
                vc.component.prestoreAccount2Info.totalAmount = (parseFloat(_param.receivedAmount) - parseFloat(_param.redepositAmount)).toFixed(2);
                vc.component.prestoreAccount2Info.ownerId = _param.objId;
                $('#prestoreAccount2Model').modal('show');
            });
        },
        methods: {
            prestoreAccount2Validate() {
                return vc.validate.validate({
                    prestoreAccount2Info: vc.component.prestoreAccount2Info
                }, {
                    'prestoreAccount2Info.amount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "金额不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "金额格式错误"
                        },
                    ],
                    'prestoreAccount2Info.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注长度不能超过200位"
                        }
                    ]
                });
            },
            savePrestoreAccount2Info: function () {
                if (!vc.component.prestoreAccount2Validate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.prestoreAccount2Info.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/account/ownerPrestoreAccount',
                    JSON.stringify(vc.component.prestoreAccount2Info),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#prestoreAccount2Model').modal('hide');
                            vc.component.clearPrestoreAccount2Info();
                            vc.emit('payFeeUserAccount', 'refresh', {});
                            vc.toast('预存成功');
                            return;
                        }
                        vc.toast(_json.msg);
                        // vc.component.prestoreAccount2Info.errorInfo = _json.msg;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.component.prestoreAccount2Info.errorInfo = errInfo;
                    });
            },
            _computedAmount: function(){
                let amount = vc.component.prestoreAccount2Info.receivedAmount - vc.component.prestoreAccount2Info.totalAmount;
                amount = amount.toFixed(2);
                vc.component.prestoreAccount2Info.amount = amount < 0 ? 0 : amount;
            },
            clearPrestoreAccount2Info: function () {
                vc.component.prestoreAccount2Info = {
                    tel: '',
                    ownerId: '',
                    owners: [],
                    amount: '',
                    remark: '',
                    receivedAmount: '',
                    redepositAmount: '',
                    totalAmount: '',
                };
            },
        }
    });
})(window.vc);