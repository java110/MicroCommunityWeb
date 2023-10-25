(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addPaymentPoolInfo: {
                ppId: '',
                paymentName: '',
                paymentType: '',
                certPath: '',
                state: 'Y',
                remark: '',
                paymentTypes: [],
                paymentKeys: [],
                payType: '1001',
                feeConfigs: [],
                configIds: []
            }
        },
        _initMethod: function () {

            vc.getDict('payment_key', 'payment_type', function (_data) {
                $that.addPaymentPoolInfo.paymentTypes = _data;
            })

        },
        _initEvent: function () {
            vc.on('addPaymentPool', 'openAddPaymentPoolModal', function () {
                $that._loadAddConfigs();
                $('#addPaymentPoolModel').modal('show');
            });
            vc.on('addPaymentPool', 'notifyCert', function (_param) {
                $that.addPaymentPoolInfo.certPath = _param.realFileName;
            })
        },
        methods: {
            addPaymentPoolValidate() {
                return vc.validate.validate({
                    addPaymentPoolInfo: $that.addPaymentPoolInfo
                }, {
                    'addPaymentPoolInfo.paymentName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "名称不能超过64"
                        },
                    ],
                    'addPaymentPoolInfo.paymentType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "支付厂家不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "支付厂家不能超过64"
                        },
                    ],
                    'addPaymentPoolInfo.certPath': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "证书地址不能超过512"
                        },
                    ],
                    'addPaymentPoolInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "使用说明不能超过512"
                        },
                    ],
                });
            },
            savePaymentPoolInfo: function () {
                if (!$that.addPaymentPoolValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                $that.addPaymentPoolInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/payment.savePaymentPool',
                    JSON.stringify($that.addPaymentPoolInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addPaymentPoolModel').modal('hide');
                            $that.clearAddPaymentPoolInfo();
                            vc.emit('paymentPool', 'listPaymentPool', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddPaymentPoolInfo: function () {
                let _paymentTypes = $that.addPaymentPoolInfo.paymentTypes;
                $that.addPaymentPoolInfo = {
                    paymentName: '',
                    paymentType: '',
                    paymentTypes: _paymentTypes,
                    paymentKeys: [],
                    certPath: '',
                    state: 'Y',
                    remark: '',
                    payType: '1001',
                    feeConfigs: [],
                    configIds: []
                };

                vc.emit('addPaymentPool', 'uploadFile', 'clearVedio', {})
            },
            _addChangeToType: function () {
                if (!$that.addPaymentPoolInfo.paymentType) {
                    return;
                }
                let _param = {
                    params: {
                        paymentType: $that.addPaymentPoolInfo.paymentType,
                        page: 1,
                        
                        row: 100
                    }
                }
                //发送get请求
                vc.http.apiGet('/payment.listPaymentKey',
                    _param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        _json.data.forEach(item => {
                            item.columnValue = '';
                        })
                        $that.addPaymentPoolInfo.paymentKeys = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadAddConfigs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        isDefault: 'F',
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.addPaymentPoolInfo.feeConfigs = _json.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

        }
    });

})(window.vc);
