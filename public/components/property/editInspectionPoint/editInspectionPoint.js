(function (vc, vm) {

    vc.extends({
        data: {
            editInspectionPointInfo: {
                inspectionId: '',
                pointObjId: '',
                pointObjType: '',
                pointObjName: '',
                inspectionName: '',
                communityId: '',
                remark: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editInspectionPoint', 'openEditInspectionPointModal', function (_params) {
                vc.component.refreshEditInspectionPointInfo();
                $('#editInspectionPointModel').modal('show');
                vc.copyObject(_params, vc.component.editInspectionPointInfo);
                //传输数据到machineSelect2组件
                if ($that.editInspectionPointInfo.pointObjType == '1001') { //设备时设置
                    vc.emit('editInspectionPoint', 'machineSelect2', 'setMachine', {
                        machineId: vc.component.editInspectionPointInfo.pointObjId,
                        machineName: vc.component.editInspectionPointInfo.pointObjName,
                    });
                }

                vc.component.editInspectionPointInfo.communityId = vc.getCurrentCommunity().communityId;
            });

            vc.on("editInspectionPointInfo", "notify", function (_param) {
                if (_param.hasOwnProperty("machineId") && $that.editInspectionPointInfo.pointObjType == '1001') {
                    vc.component.editInspectionPointInfo.pointObjId = _param.machineId;
                    vc.component.editInspectionPointInfo.pointObjName = _param.machineName;
                }
            });
        },
        methods: {
            editInspectionPointValidate: function () {
                return vc.validate.validate({
                    editInspectionPointInfo: vc.component.editInspectionPointInfo
                }, {
                    'editInspectionPointInfo.inspectionName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检点名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "巡检点名称不能超过100位"
                        },
                    ],
                    'editInspectionPointInfo.pointObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "位置信息不能为空"
                        },
                    ],
                    'editInspectionPointInfo.pointObjType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检类型不能为空"
                        },
                    ],
                    'editInspectionPointInfo.pointObjName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检位置不能为空"
                        },
                    ],
                    'editInspectionPointInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注信息不能超过200位"
                        },
                    ],
                    'editInspectionPointInfo.inspectionId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检点ID不能为空"
                        }]

                });
            },
            editInspectionPoint: function () {
                if ($that.editInspectionPointInfo.pointObjType == '2002') {
                    $that.editInspectionPointInfo.pointObjId = '-1';
                }
                if (!vc.component.editInspectionPointValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.post(
                    'editInspectionPoint',
                    'update',
                    JSON.stringify(vc.component.editInspectionPointInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editInspectionPointModel').modal('hide');
                            vc.emit('inspectionPointManage', 'listInspectionPoint', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);
                    });
            },
            refreshEditInspectionPointInfo: function () {
                vc.component.editInspectionPointInfo = {
                    inspectionId: '',
                    pointObjId: '',
                    pointObjType: '',
                    pointObjName: '',
                    inspectionName: '',
                    communityId: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
