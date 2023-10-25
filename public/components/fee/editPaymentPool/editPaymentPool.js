(function (vc, vm) {

    vc.extends({
        data: {
            editPaymentPoolInfo: {
                ppId: '',
                paymentName: '',
                paymentTypes: [],
                paymentType: '',
                certPath: '',
                state: '',
                remark: '',
                paymentKeys: [],
                payType: '',
                feeConfigs: [],
                configIds: []
            }
        },
        _initMethod: function () {
            vc.getDict('payment_key', 'payment_type', function (_data) {
                $that.editPaymentPoolInfo.paymentTypes = _data;
            });
        },
        _initEvent: function () {
            vc.on('editPaymentPool', 'openEditPaymentPoolModal', function (_params) {
                $that.refreshEditPaymentPoolInfo();
                $that._loadEditConfigs();
                $('#editPaymentPoolModel').modal('show');
                vc.copyObject(_params, $that.editPaymentPoolInfo);
                $that._editChangeToType();


                if ($that.editPaymentPoolInfo.certPath) {
                    vc.emit('editPaymentPool', 'uploadFile', 'notifyVedio', $that.editPaymentPoolInfo.certPath)
                }
            });

            vc.on('editPaymentPool', 'notifyCert', function (_param) {
                $that.editPaymentPoolInfo.certPath = _param.realFileName;
            })
        },
        methods: {
            editPaymentPoolValidate: function () {
                return vc.validate.validate({
                    editPaymentPoolInfo: $that.editPaymentPoolInfo
                }, {
                    'editPaymentPoolInfo.paymentName': [
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
                    'editPaymentPoolInfo.paymentType': [
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
                    'editPaymentPoolInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "使用说明不能超过512"
                        },
                    ],
                    'editPaymentPoolInfo.ppId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editPaymentPool: function () {
                if (!$that.editPaymentPoolValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.editPaymentPoolInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/payment.updatePaymentPool',
                    JSON.stringify($that.editPaymentPoolInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPaymentPoolModel').modal('hide');
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
            refreshEditPaymentPoolInfo: function () {
                let _paymentTypes = $that.editPaymentPoolInfo.paymentTypes;
                $that.editPaymentPoolInfo = {
                    ppId: '',
                    paymentName: '',
                    paymentType: '',
                    paymentTypes: _paymentTypes,
                    certPath: '',
                    state: '',
                    remark: '',
                    paymentKeys: [],
                    payType: '',
                    feeConfigs: [],
                    configIds: []
                }
            },
            _editChangeToType: function () {
                if (!$that.editPaymentPoolInfo.paymentType) {
                    return;
                }
                let _param = {
                    params: {
                        paymentType: $that.editPaymentPoolInfo.paymentType,
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
                        $that.editPaymentPoolInfo.paymentKeys = _json.data;
                        //todo 查询 支付信息
                        $that._editLoadPaymentData();
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _loadEditConfigs: function () {
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
                        $that.editPaymentPoolInfo.feeConfigs = _json.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _editLoadPaymentData: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ppId: $that.editPaymentPoolInfo.ppId
                    }
                };
                $that.editPaymentPool.configIds = [];
                //发送get请求
                vc.http.apiGet('/payment.listPaymentPool',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let _values = _json.data[0].values;
                        _values.forEach(_value => {
                            $that.editPaymentPoolInfo.paymentKeys.forEach(_key =>{
                                if(_value.columnKey == _key.columnKey){
                                    _key.columnValue = _value.columnValue;
                                }
                            })
                        });

                        let _configs = _json.data[0].configs;
                        if(!_configs){
                            return;
                        }
                        _configs.forEach(_config =>{
                            $that.editPaymentPoolInfo.configIds.push(_config.configId);
                        })

                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc, window.$that);
