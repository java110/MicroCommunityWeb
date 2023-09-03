(function(vc, vm) {

    vc.extends({
        data: {
            parkingAreaControlTempCarAuthConfirmInfo: {
                carNum: '',
                authId: '',
                machineName: '',
                areaNum: '',
                remark: '',
                msg: '',
                state: '',
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('parkingAreaControlTempCarAuthConfirm', 'notify', function(_data) {
                if (_data.action != 'TEMP_CAR_AUTH') {
                    return;
                }
                $that.refreshParkingAreaControlTempCarAuthConfirmInfo();
                $('#parkingAreaControlTempCarAuthConfirmModel').modal('show');
                // = _params;
                vc.copyObject(_data.body, $that.parkingAreaControlTempCarAuthConfirmInfo);
                $that.parkingAreaControlTempCarAuthConfirmInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on('parkingAreaControlTempCarAuthConfirm', 'open', function(_data) {

                $that.refreshParkingAreaControlTempCarAuthConfirmInfo();
                $('#parkingAreaControlTempCarAuthConfirmModel').modal('show');
                // = _params;
                vc.copyObject(_data, $that.parkingAreaControlTempCarAuthConfirmInfo);
                $that.parkingAreaControlTempCarAuthConfirmInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {

            _doConfirm: function(_state) {
                $that.parkingAreaControlTempCarAuthConfirmInfo.state = _state;
                let _msg = $that.parkingAreaControlTempCarAuthConfirmInfo.msg;
                if(!_msg){
                    if(_state == 'C' ){
                        $that.parkingAreaControlTempCarAuthConfirmInfo.msg = "允许通行"
                    }else{
                        $that.parkingAreaControlTempCarAuthConfirmInfo.msg = "禁止通行"
                    }
                }
                
                vc.http.apiPost(
                    '/machine.tempCarAuth',
                    JSON.stringify($that.parkingAreaControlTempCarAuthConfirmInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _data = JSON.parse(json);
                        if (_data.code != 0) {
                            vc.toast(_data.msg);
                        } else {
                            $('#parkingAreaControlTempCarAuthConfirmModel').modal('hide');
                            $that.refreshParkingAreaControlTempCarAuthConfirmInfo();
                            vc.toast(_data.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshParkingAreaControlTempCarAuthConfirmInfo: function() {
                let _payTypes = $that.parkingAreaControlTempCarAuthConfirmInfo.payTypes;
                $that.parkingAreaControlTempCarAuthConfirmInfo = {
                    carNum: '',
                    authId: '',
                    machineName: '',
                    areaNum: '',
                    remark: '',
                    msg: '',
                    state: '',
                }
            },
        }
    });

})(window.vc, window.$that);