(function(vc) {

    vc.extends({
        data: {
            settingMeterMachineReadInfo: {
                readDay: '',
                readHours: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('settingMeterMachineRead', 'openSettingMeterMachineReadModal', function() {

                $('#settingMeterMachineReadModel').modal('show');
            });
        },
        methods: {
            _settingRead: function() {


                vc.component.settingMeterMachineReadInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/meterMachine.settingMeterMachineRead',
                    JSON.stringify(vc.component.settingMeterMachineReadInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#settingMeterMachineReadModel').modal('hide');
                            vc.component.clearSettingMeterMachineReadInfo();
                            vc.emit('meterMachineManage', 'listMeterMachine', {});

                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearSettingMeterMachineReadInfo: function() {
                vc.component.settingMeterMachineReadInfo = {
                    readDay: '',
                    readHours: '',
                };
            },



        }
    });

})(window.vc);