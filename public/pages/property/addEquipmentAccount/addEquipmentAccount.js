(function (vc) {

    vc.extends({
        data: {
            addEquipmentAccountInfo: {
                machineId: '',
                machineName: '',
                machineCode: '',
                brand: '',
                model: '',
                typeId: '',
                locationDetail: '',
                locationObjId: '',
                locationObjName: '',
                firstEnableTime: '',
                warrantyDeadline: '',
                usefulLife: '',
                importanceLevel: '',
                importanceLevels:[],
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
                useStatus:[]
            },
        },
        _initMethod: function () {

            $that.addEquipmentAccountInfo.typeId = vc.getParam('typeId');
            vc.getDict('equipment_account', "importance_level", function (_data) {
                vc.component.addEquipmentAccountInfo.importanceLevels = _data;
            });
            vc.getDict('equipment_account', "state", function (_data) {
                vc.component.addEquipmentAccountInfo.useStatus = _data;
            });
            vc.component._initAddEquipmentAccountInfo();
        },
        _initEvent: function () {
            
        },
        methods: {
            _initAddEquipmentAccountInfo: function () {
                $('.addFirstEnableTime').datetimepicker({
                    minView: "month",
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addFirstEnableTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addFirstEnableTime").val();
                        vc.component.addEquipmentAccountInfo.firstEnableTime = value;
                    });
                $('.addWarrantyDeadlineE').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd',
                    initTime: true,
                    minView: 'month',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addWarrantyDeadlineE').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addWarrantyDeadlineE").val();
                        vc.component.addEquipmentAccountInfo.warrantyDeadline = value;
                    });
            },

            addEquipmentAccountValidate() {
                return vc.validate.validate({
                    addEquipmentAccountInfo: vc.component.addEquipmentAccountInfo
                }, {
                    'addEquipmentAccountInfo.machineName': [
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
                    'addEquipmentAccountInfo.machineCode': [
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
                    'addEquipmentAccountInfo.brand': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备品牌不能超过32"
                        },
                    ],
                    'addEquipmentAccountInfo.model': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "设备型号不能超过32"
                        },
                    ],
                    'addEquipmentAccountInfo.locationDetail': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "位置详情不能超过150"
                        },
                    ],
                    'addEquipmentAccountInfo.firstEnableTime': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "首次启用时间不能超过150"
                        },
                    ],
                    'addEquipmentAccountInfo.warrantyDeadline': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "保修截止日期不能超过150"
                        },
                    ],
                    'addEquipmentAccountInfo.importanceLevel': [
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
                    'addEquipmentAccountInfo.state': [
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
                    'addEquipmentAccountInfo.purchasePrice': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "采购价格不能超过8"
                        },
                    ],
                    'addEquipmentAccountInfo.netWorth': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "资产净值不能超过8"
                        },
                    ],
                    'addEquipmentAccountInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        },
                    ],
                });
            },
            saveEquipmentAccountInfo: function () {
                if (!vc.component.addEquipmentAccountValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addEquipmentAccountInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/equipmentAccount.saveEquipmentAccount',
                    JSON.stringify(vc.component.addEquipmentAccountInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        vc.toast(_json.msg);

                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
        }
    });

})(window.vc);
