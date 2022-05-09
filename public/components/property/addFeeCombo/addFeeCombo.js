(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeComboInfo: {
                comboId: '',
                comboName: '',
                remark: '',
                configs: [],
                configIds: []

            }
        },
        watch: {
            'addFeeComboInfo.configs': function() { //'goodList'是我要渲染的对象，也就是我要等到它渲染完才能调用函数
                this.$nextTick(function() {
                    $('#configIds').selectpicker({
                        title: '选填，请选择费用项',
                        styleBase: 'form-control',
                        width: 'auto'
                    });

                    $('#configIds').selectpicker('refresh');
                })
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addFeeCombo', 'openAddFeeComboModal', function () {
                $that._listFeeConfigs();
                $('#addFeeComboModel').modal('show');
            });
        },
        methods: {
            addFeeComboValidate() {
                return vc.validate.validate({
                    addFeeComboInfo: vc.component.addFeeComboInfo
                }, {
                    'addFeeComboInfo.comboName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "套餐名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "套餐名称不能超过30"
                        },
                    ],




                });
            },
            saveFeeComboInfo: function () {
                if (!vc.component.addFeeComboValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addFeeComboInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeComboInfo);
                    $('#addFeeComboModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/feeCombo.saveFeeCombo',
                    JSON.stringify(vc.component.addFeeComboInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeComboModel').modal('hide');
                            vc.component.clearAddFeeComboInfo();
                            vc.emit('feeComboManage', 'listFeeCombo', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddFeeComboInfo: function () {
                vc.component.addFeeComboInfo = {
                    comboName: '',
                    remark: '',
                    configs: [],
                    configIds: []
                };
            },
            _listFeeConfigs: function() {
                var param = {
                    params: {
                        page:1,
                        row:500,
                        communityId:vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        vc.component.addFeeComboInfo.configs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });

})(window.vc);
