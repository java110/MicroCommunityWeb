(function (vc, vm) {

    vc.extends({
        data: {
            viewEquipmentAccountInfo: {
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

        },
        _initEvent: function () {
            vc.on('viewEquipmentAccount', 'openViewEquipmentAccountModal', function (_params) {
                vc.component.refreshViewEquipmentAccountInfo();
                $('#viewEquipmentAccountModel').modal('show');
                vc.copyObject(_params, vc.component.viewEquipmentAccountInfo);
                vc.component.viewEquipmentAccountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            viewEquipmentAccountValidate: function () {
                return vc.validate.validate({
                    viewEquipmentAccountInfo: vc.component.viewEquipmentAccountInfo
                }, {
                    'viewEquipmentAccountInfo.machineName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "设备名称不能超过64"
                        },
                    ],
                    'viewEquipmentAccountInfo.machineCode': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备编码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "设备编码不能超过64"
                        },
                    ],
                    'viewEquipmentAccountInfo.brand': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备品牌不能超过32"
                        },
                    ],
                    'viewEquipmentAccountInfo.model': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备型号不能超过32"
                        },
                    ],
                    'viewEquipmentAccountInfo.locationDetail': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "位置详情不能超过150"
                        },
                    ],
                    'viewEquipmentAccountInfo.firstEnableTime': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "首次启用时间不能超过150"
                        },
                    ],
                    'viewEquipmentAccountInfo.warrantyDeadline': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "保修截止日期不能超过150"
                        },
                    ],
                    'viewEquipmentAccountInfo.usefulLife': [
                        {
                            limit: "num",
                            param: "11",
                            errInfo: "请填写使用年限不能超过10"
                        },
                    ],
                    'viewEquipmentAccountInfo.importanceLevel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "重要等级不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "重要等级格式错误"
                        },
                    ],
                    'viewEquipmentAccountInfo.state': [
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
                    'viewEquipmentAccountInfo.purchasePrice': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "采购价格不能超过8"
                        },
                    ],
                    'viewEquipmentAccountInfo.netWorth': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "资产净值不能超过8"
                        },
                    ],
                    'viewEquipmentAccountInfo.useOrgOd': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "使用部门不能超过64"
                        },
                    ],
                    'viewEquipmentAccountInfo.useUserId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "使用人不能超过64"
                        },
                    ],
                    'viewEquipmentAccountInfo.chargeOrgId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "责任部门不能超过64"
                        },
                    ],
                    'viewEquipmentAccountInfo.chargeUseId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "责任人不能超过64"
                        },
                    ],
                    'viewEquipmentAccountInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        },
                    ],
                    'viewEquipmentAccountInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备台账ID不能为空"
                        }]

                });
            },
            viewEquipmentAccount: function () {
                if (!vc.component.viewEquipmentAccountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'equipmentAccount.updateEquipmentAccount',
                    JSON.stringify(vc.component.viewEquipmentAccountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#viewEquipmentAccountModel').modal('hide');
                            vc.emit('equipmentAccountManage', 'listEquipmentAccount', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshViewEquipmentAccountInfo: function () {
                vc.component.viewEquipmentAccountInfo = {
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
