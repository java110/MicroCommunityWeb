(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addFeeComboMemberInfo: {
                feeConfigs: [],
                feeTypeCd: '',
                feeTypeCds: [],
                configId: '',
                comboId: ''
            }
        },
        _initMethod: function () {
            vc.getDict('pay_fee_config', "fee_type_cd", function (_data) {
                $that.addFeeComboMemberInfo.feeTypeCds = _data;
            });
        },
        _initEvent: function () {
            vc.on('addFeeComboMember', 'openAddFeeComboMemberModal', function (_param) {
                vc.copyObject(_param, $that.addFeeComboMemberInfo);
                $('#addFeeComboMemberModel').modal('show');
            });
        },
        methods: {
            addFeeComboMemberValidate() {
                return vc.validate.validate({
                    addFeeComboMemberInfo: vc.component.addFeeComboMemberInfo
                }, {
                    'addFeeComboMemberInfo.configId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "费用项不能为空"
                        }
                    ],
                });
            },
            saveFeeComboInfo: function () {
                if (!vc.component.addFeeComboMemberValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addFeeComboMemberInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addFeeComboMemberInfo);
                    $('#addFeeComboMemberModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/feeComboMember.saveFeeComboMember',
                    JSON.stringify(vc.component.addFeeComboMemberInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addFeeComboMemberModel').modal('hide');
                            vc.component.clearAddFeeComboInfo();
                            vc.emit('feeComboMemberManage', 'listFeeComboMember', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddFeeComboInfo: function () {
                let _feeTypeCds = $that.addFeeComboMemberInfo.feeTypeCds;
                vc.component.addFeeComboMemberInfo = {
                    feeConfigs: [],
                    feeTypeCd: '',
                    feeTypeCds: _feeTypeCds,
                    configId: '',
                    comboId: '',
                };
            },
            _changeFeeTypeCdX: function (_feeTypeCd) {
                $that.addFeeComboMemberInfo.configId = '';
                var param = {
                    params: {
                        page: 1,
                        row: 500,
                        communityId: vc.getCurrentCommunity().communityId,
                        feeTypeCd: _feeTypeCd,
                        isDefault: 'F',
                        valid: '1'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function (json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.addFeeComboMemberInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);