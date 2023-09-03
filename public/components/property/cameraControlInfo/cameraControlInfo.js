/**
 入驻小区
 **/
(function (vc) {
    vc.extends({
        data: {
            cameraControlInfo: {
                machineCode: '',
                machineVersion: '',
                machineName: '',
                machineTypeCd: '',
                machineIp: '',
                machineMac: '',
                machineId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('cameraControlInfo', 'notify', function (_data) {
                $that.refreshCameraControlInfo();
                vc.copyObject(_data._machine, $that.cameraControlInfo);
            });

        },
        methods: {
            refreshCameraControlInfo: function () {
                vc.component.cameraControlInfo = {
                    machineCode: '',
                    machineVersion: '',
                    machineName: '',
                    machineTypeCd: '',
                    machineIp: '',
                    machineMac: '',
                    machineId: ''
                }
            }
        }
    });
})(window.vc);