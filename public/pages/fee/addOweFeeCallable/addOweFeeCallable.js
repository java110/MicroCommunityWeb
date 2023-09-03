(function(vc) {
    vc.extends({
        data: {
            addOweFeeCallableInfo: {
                callableWay: '',
                remark: '',
                communityId: vc.getCurrentCommunity().communityId,
                configIds: [],
                roomId: '',
                roomIds: [],
                feeConfigs: []
            }
        },
        _initMethod: function() {
            vc.emit('selectRooms', 'refreshTree', {});
            $that._listFeeConfigs();
        },
        _initEvent: function() {

            vc.on('addOweFeeCallable', 'notifySelectRooms', function(_selectRooms) {
                let _roomIds = [];
                _selectRooms.forEach(item => {
                    _roomIds.push(item.roomId);
                })
                $that.addOweFeeCallableInfo.roomIds = _roomIds;
            })

        },
        methods: {
            addOweFeeCallableValidate() {
                return vc.validate.validate({
                    addOweFeeCallableInfo: $that.addOweFeeCallableInfo
                }, {
                    'addOweFeeCallableInfo.callableWay': [{
                        limit: "required",
                        param: "",
                        errInfo: "催缴方式不能为空"
                    }, ],
                });
            },
            _saveOweFeeCallable: function() {
                if (!$that.addOweFeeCallableValidate()) {
                    //侦听回传
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/oweFeeCallable.saveOweFeeCallable', JSON.stringify($that.addOweFeeCallableInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _listFeeConfigs: function() {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        isDefault: 'F'
                    }
                };
                //发送get请求
                vc.http.apiGet('/feeConfig.listFeeConfigs', param,
                    function(json, res) {
                        var _feeConfigManageInfo = JSON.parse(json);
                        $that.addOweFeeCallableInfo.feeConfigs = _feeConfigManageInfo.feeConfigs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    });
            },
        }
    });
})(window.vc);