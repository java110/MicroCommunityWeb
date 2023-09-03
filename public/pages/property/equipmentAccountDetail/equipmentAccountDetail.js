(function(vc) {
    vc.extends({
        data: {
            equipmentAccountDetail: {
                machineId: '',
                machineName: '',
                machineCode: '',
                brand: '',
                model: '',
                locationDetail: '',
                firstEnableTime: '',
                warrantyDeadline: '',
                usefulLife: '',
                importanceLevel: '',
                state: '',
                stateName:'',
                levelName:'',
                purchasePrice: '',
                netWorth: '',
                useOrgId: "",
                useOrgName: "",
                useUserId: "",
                useUserName: "",
                useUseTel: "",
                chargeOrgId: "",
                chargeOrgName: "",
                chargeOrgTel: "",
                chargeUseId: "",
                chargeUseName: "",
                remark: '',
                elogs:[]
            }
        },
        _initMethod: function() {
            let machineId = vc.getParam('machineId');
            if (!vc.notNull(machineId)) {
                vc.toast('非法操作');
                vc.jumpToPage('/#/pages/property/equipmentAccount');
                return;
            }
            $that.equipmentAccountDetail.machineId = machineId;
            $that._listEquipmentDetail()
        },
        _initEvent: function() {},
        methods: {
            _listEquipmentDetail: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineId: $that.equipmentAccountDetail.machineId
                    }
                };
                //发送get请求
                vc.http.apiGet('equipmentAccount.listEquipmentAccount',
                param,
                function (json, res) {
                    var _equipmentAccountManageInfo = JSON.parse(json);
                        let _repairs = _equipmentAccountManageInfo.data;
                        if (_repairs.length < 1) {
                            vc.toast("数据异常");
                            vc.jumpToPage('/#/pages/property/equipmentAccount');
                            return;
                        }
                        vc.copyObject(_repairs[0], $that.equipmentAccountDetail);
                        //查询设备操作日志
                        $that._loadEquipmentLogs();
                 
                },
                function (errInfo, error) {
                    console.log('请求失败处理');
                }
            );
            },
            _loadEquipmentLogs: function() {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                        machineId: $that.equipmentAccountDetail.machineId
                    }
                };
                //发送get请求
                vc.http.apiGet('equipmentOperatingLog.listEquipmentOperatingLog',
                    param,
                    function(json, res) {
                        var _repairPoolManageInfo = JSON.parse(json);
                        let _repairs = _repairPoolManageInfo.data;
                        $that.equipmentAccountDetail.elogs = _repairs;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function() {
                vc.goBack()
            },
            openFile: function(_photo) {
                vc.emit('viewImage', 'showImage', {
                    url: _photo.url
                });
            },
            /**
             * 新增打印功能，跳转打印页面
             */
            _printEquipmentDetail: function() {
                window.open("/print.html#/pages/property/printEquipmentAccountLabel?machineId=" + $that.equipmentAccountDetail.machineId)
            },
        }
    });
})(window.vc);