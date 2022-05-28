(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            createFeeByComboInfo: {
                feeConfigs: [],
                selectConfigIds: [],
                communityId: vc.getCurrentCommunity().communityId,
                payerObjId: '',
                payerObjName: '',
                payerObjType: '',
                comboId: ''
            }
        },
        _initMethod: function () {
            let _payerObjId = vc.getParam('payerObjId');
            let _payerObjType = vc.getParam('payerObjType');
            let _payerObjName = vc.getParam('payerObjName');
            $that.createFeeByComboInfo.payerObjId = _payerObjId;
            $that.createFeeByComboInfo.payerObjType = _payerObjType;
            $that.createFeeByComboInfo.payerObjName = _payerObjName;
        },
        _initEvent: function () {
            vc.on('createFeeByCombo', 'chooseFeeCombo', function (_feeCombo) {
                $that.createFeeByComboInfo.comboId = _feeCombo.comboId;
                $that._listFeeComboMembers(_feeCombo);
            })
        },
        methods: {
            _chooseFeeCombo: function () {
                vc.emit('chooseFeeCombo', 'openChooseFeeComboModel', {});
            },

            _listFeeComboMembers: function (_feeCombo) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        comboId: _feeCombo.comboId
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeComboMember.listFeeComboMember',
                    param,
                    function (json, res) {
                        let _feeComboMemberManageInfo = JSON.parse(json);
                        $that.createFeeByComboInfo.selectConfigIds = [];
                        _feeComboMemberManageInfo.data.forEach(config => {
                            config.startTime = '';
                            config.endTime = '',
                            $that.createFeeByComboInfo.selectConfigIds.push(config.configId);
                        })
                        vc.component.createFeeByComboInfo.feeConfigs = _feeComboMemberManageInfo.data;
                        $that.$forceUpdate();
                        setTimeout(() => {
                            _feeComboMemberManageInfo.data.forEach(config => {
                                vc.initDate('startTime' + config.configId, function (_value) {
                                    config.startTime = _value;
                                })

                                vc.initDate('endTime' + config.configId, function (_value) {
                                    config.endTime = _value;
                                })
                            })
                        }, 1000)


                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _createFee: function () {
                let _fees = [];
                $that.createFeeByComboInfo.selectConfigIds.forEach(function (_item) {
                    $that.createFeeByComboInfo.feeConfigs.forEach(function (_batchFeeItem) {
                        if (_item == _batchFeeItem.configId) {
                            _fees.push(_batchFeeItem);
                        }
                    })
                })
                if (_fees.length < 1) {
                    vc.toast('未选中要创建的费用套餐');
                    return;
                }
                let _data = {
                    communityId: vc.getCurrentCommunity().communityId,
                    configs: _fees,
                    payerObjId: $that.createFeeByComboInfo.payerObjId,
                    payerObjName: $that.createFeeByComboInfo.payerObjName,
                    payerObjType: $that.createFeeByComboInfo.payerObjType,
                    comboId: $that.createFeeByComboInfo.comboId
                }
                vc.http.apiPost(
                    '/fee.createFeeByCombo',
                    JSON.stringify(_data), {
                    emulateJSON: true
                },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);
                        if (_json.code == 0) {
                            vc.goBack();
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _back: function () {
                $('#payFeeResult').modal("hide");
                vc.getBack();
            },
            checkAll: function (e) {
                var checkObj = document.querySelectorAll('.checkItem'); // 获取所有checkbox项
                if (e.target.checked) { // 判定全选checkbox的勾选状态
                    for (var i = 0; i < checkObj.length; i++) {
                        if (!checkObj[i].checked) { // 将未勾选的checkbox选项push到绑定数组中
                            vc.component.createFeeByComboInfo.selectConfigIds.push(checkObj[i].value);
                        }
                    }
                } else { // 如果是去掉全选则清空checkbox选项绑定数组
                    vc.component.createFeeByComboInfo.selectConfigIds = [];
                }
            },
            _goBack:function(){
                vc.goBack();
            }
        }
    });
})(window.vc);