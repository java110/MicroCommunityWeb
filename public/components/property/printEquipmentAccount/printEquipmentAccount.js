(function (vc, vm) {

    vc.extends({
        data: {
            printEquipmentAccountInfo: {
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
            vc.on('printEquipmentAccount', 'openPrintEquipmentAccountModal', function (_params) {
                vc.component.refreshPrintEquipmentAccountInfo();
                $('#printEquipmentAccountModel').modal('show');
                vc.copyObject(_params, vc.component.printEquipmentAccountInfo);
                vc.component.printEquipmentAccountInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            printEquipmentAccountValidate: function () {
                return vc.validate.validate({
                    printEquipmentAccountInfo: vc.component.printEquipmentAccountInfo
                }, {
                    'printEquipmentAccountInfo.machineName': [
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
                    'printEquipmentAccountInfo.machineCode': [
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
                    'printEquipmentAccountInfo.brand': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备品牌不能超过32"
                        },
                    ],
                    'printEquipmentAccountInfo.model': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备型号不能超过32"
                        },
                    ],
                    'printEquipmentAccountInfo.locationDetail': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "位置详情不能超过150"
                        },
                    ],
                    'printEquipmentAccountInfo.firstEnableTime': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "首次启用时间不能超过150"
                        },
                    ],
                    'printEquipmentAccountInfo.warrantyDeadline': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "保修截止日期不能超过150"
                        },
                    ],
                    'printEquipmentAccountInfo.usefulLife': [
                        {
                            limit: "num",
                            param: "11",
                            errInfo: "请填写使用年限不能超过10"
                        },
                    ],
                    'printEquipmentAccountInfo.importanceLevel': [
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
                    'printEquipmentAccountInfo.state': [
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
                    'printEquipmentAccountInfo.purchasePrice': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "采购价格不能超过8"
                        },
                    ],
                    'printEquipmentAccountInfo.netWorth': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "资产净值不能超过8"
                        },
                    ],
                    'printEquipmentAccountInfo.useOrgOd': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "使用部门不能超过64"
                        },
                    ],
                    'printEquipmentAccountInfo.useUserId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "使用人不能超过64"
                        },
                    ],
                    'printEquipmentAccountInfo.chargeOrgId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "责任部门不能超过64"
                        },
                    ],
                    'printEquipmentAccountInfo.chargeUseId': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "责任人不能超过64"
                        },
                    ],
                    'printEquipmentAccountInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        },
                    ],
                    'printEquipmentAccountInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备台账ID不能为空"
                        }]

                });
            },
            /**
             * 新增打印功能，跳转打印页面
             */
            printEquipmentAccount: function () {
                window.open("/print.html#/pages/property/printEquipmentAccountLabel?machineId=" + $that.printEquipmentAccountInfo.machineId)
            },
            refreshPrintEquipmentAccountInfo: function () {
                vc.component.printEquipmentAccountInfo = {
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
