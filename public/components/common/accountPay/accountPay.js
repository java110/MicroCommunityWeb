(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            accountPayInfo: {
                accountBank: {
                    personName: '',
                    bankName: '',
                    bankCode: ''
                },
                state: '',
                remark: ''
            }
        },
        watch: {
            "accountPayInfo.state": {//深度监听，可监听到对象、数组的变化
                handler(val, oldVal) {
                    if (vc.notNull(val) && vc.component.accountPayInfo.state == '1100') {
                        vc.component.accountPayInfo.remark = "同意";
                    } else {
                        vc.component.accountPayInfo.remark = "";
                    }
                },
                deep: true
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('accountPay', 'accountPayModel', function (param) {
                console.log(param);
                vc.component.accountPayInfo.accountBank.personName = param._accountBank[0].personName;
                vc.component.accountPayInfo.accountBank.bankName = param._accountBank[0].bankName;
                vc.component.accountPayInfo.accountBank.bankCode = param._accountBank[0].bankCode;
                $('#accountPayModel').modal('show');
            });
        },
        methods: {
            accountPayValidate() {
                return vc.validate.validate({
                    accountPayInfo: vc.component.accountPayInfo
                }, {
                    'accountPayInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审核状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "审核状态错误"
                        },
                    ],
                    'accountPayInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "原因内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "原因内容不能超过200"
                        },
                    ]
                });
            },
            _accountPaySubmit: function () {
                if (!vc.component.accountPayValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    let _accountPayInfo = {
                        state: vc.component.accountPayInfo.state,
                        remark: vc.component.accountPayInfo.remark
                    };
                    if (_accountPayInfo.state == '1200') {
                        _accountPayInfo.remark = '拒绝:' + _accountPayInfo.remark;
                    }
                    vc.emit($props.callBackListener, $props.callBackFunction, _accountPayInfo);
                    $('#accountPayModel').modal('hide');
                    vc.component.clearAddBasePrivilegeInfo();
                    return;
                }
            },
            clearAddBasePrivilegeInfo: function () {
                vc.component.accountPayInfo = {
                    accountBank: {
                        personName: '',
                        bankName: '',
                        bankCode: ''
                    },
                    state: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc);
