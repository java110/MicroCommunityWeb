(function (vc, vm) {

    vc.extends({
        data: {
            moveEquipmentInfo: {
                machineId: '',
                locationDetail: '',
                state: '',
                locationObjId: '',
                locationObjName: '',
                stateName: '',
                remark: '',
            }
        },
        _initMethod: function () {
            vc.getDict('equipment_account', "importance_level", function (_data) {
                vc.component.equipmentAccountInfo.importanceLevel = _data;
            });
        },
        _initEvent: function () {
            vc.on('moveEquipment', 'openMoveEquipmentModal', function (_params) {
                vc.component.refreshChangeStateEquipmentValidate();
                $('#moveEquipmentModel').modal('show');
                vc.copyObject(_params, vc.component.moveEquipmentInfo);
                vc.component.moveEquipmentInfo.communityId = vc.getCurrentCommunity().communityId;
            });
            vc.on('moveEquipment', 'switchMoveSpace', function(_sapce) {
                vc.component.moveEquipmentInfo.locationObjId = _sapce.id;
                vc.component.moveEquipmentInfo.locationObjName = _sapce.text;
            });
        },
        methods: {
            moveEquipmentValidate: function () {
                return vc.validate.validate({
                    moveEquipmentInfo: vc.component.moveEquipmentInfo
                }, {
                    'moveEquipmentInfo.locationObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "空间位置不能为空"
                        }
                    ],
                    'moveEquipmentInfo.locationObjName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "空间位置不能为空"
                        }
                    ],

                    'moveEquipmentInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备台账ID不能为空"
                        }]

                });
            },
            moveEquipment: function () {
                if (!vc.component.moveEquipmentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'equipmentAccount.moveEquipment',
                    JSON.stringify(vc.component.moveEquipmentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#moveEquipmentModel').modal('hide');
                            vc.emit('equipmentAccount', 'listEquipmentAccounts', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshChangeStateEquipmentValidate: function () {
                vc.component.moveEquipmentInfo = {
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
                    stateName: '',
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

                }
            }
        }
    });

})(window.vc, window.vc.component);
