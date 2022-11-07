(function (vc, vm) {

    vc.extends({
        data: {
            equipmentAccountInfo:{},
            changeStateEquipmentInfo: {
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
        },
        _initMethod: function () {
            vc.getDict('equipment_account', "importance_level", function (_data) {
                vc.component.equipmentAccountInfo.importanceLevel = _data;
            });
        },
        _initEvent: function () {
            vc.on('changeStateEquipment', 'openChangeStateEquipmentModal', function (_params) {
                vc.component.refreshChangeStateEquipmentValidate();
                $('#changeStateEquipmentModel').modal('show');
                vc.copyObject(_params, vc.component.changeStateEquipmentInfo);
                vc.component.changeStateEquipmentInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            changeStateEquipmentValidate: function () {
                return vc.validate.validate({
                    changeStateEquipmentInfo: vc.component.changeStateEquipmentInfo
                }, {
                    'changeStateEquipmentInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "使用状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "使用状态格式错误"
                        },
                    ],
                    'changeStateEquipmentInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备台账ID不能为空"
                        }]

                });
            },
            chooseEmpEdit(foo) {
                vc.component.changeStateEquipmentInfo.isUseUser = foo;
                vc.emit('selectStaff', 'openStaff', {
                    call: function (_staff) {
                        $that.getUserInfoEdit(_staff);
                    }
                });
                $(".modal-backdrop:last").css("cssText","z-index: 2900!important");
                $("#selectStaffModel").on("hidden.bs.modal", function () {
                    $('body').addClass('modal-open')
                });
            },

            changeStateEquipment: function () {
                if (!vc.component.changeStateEquipmentValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'equipmentAccount.changeStateEquipment',
                    JSON.stringify(vc.component.changeStateEquipmentInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#changeStateEquipmentModel').modal('hide');
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
                vc.component.changeStateEquipmentInfo = {
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
