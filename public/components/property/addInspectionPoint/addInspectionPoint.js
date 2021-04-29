(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addInspectionPointInfo: {
                inspectionId: '',
                pointObjId: '',
                pointObjType: '',
                pointObjName: '',
                inspectionName: '',
                remark: ''
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addInspectionPoint', 'openAddInspectionPointModal', function () {
                $('#addInspectionPointModel').modal('show');
            });
            vc.on("addInspectionPointInfo", "notify", function (_param) {
                if (_param.hasOwnProperty("machineId") && $that.addInspectionPointInfo.pointObjType == '1001') {
                    vc.component.addInspectionPointInfo.pointObjId = _param.machineId;
                    vc.component.addInspectionPointInfo.pointObjName = _param.machineName;
                }
            });
        },
        methods: {
            addInspectionPointValidate() {
                return vc.validate.validate({
                    addInspectionPointInfo: vc.component.addInspectionPointInfo
                }, {
                    'addInspectionPointInfo.inspectionName': [
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
                    'addInspectionPointInfo.pointObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "位置信息不能为空"
                        },
                    ],
                    'addInspectionPointInfo.pointObjType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检类型不能为空"
                        },
                    ],
                    'addInspectionPointInfo.pointObjName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检位置不能为空"
                        },
                    ],
                    'addInspectionPointInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注信息不能超过200位"
                        },
                    ],

                });
            },
            saveInspectionPointInfo: function () {

                if ($that.addInspectionPointInfo.pointObjType == '2002') {
                    $that.addInspectionPointInfo.pointObjId = '-1';
                }
                if (!vc.component.addInspectionPointValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addInspectionPointInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addInspectionPointInfo);
                    $('#addInspectionPointModel').modal('hide');
                    return;
                }

                vc.http.post(
                    'addInspectionPoint',
                    'save',
                    JSON.stringify(vc.component.addInspectionPointInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addInspectionPointModel').modal('hide');
                            vc.component.clearAddInspectionPointInfo();
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
            clearAddInspectionPointInfo: function () {
                vc.component.addInspectionPointInfo = {
                    inspectionId: '',
                    pointObjId: '',
                    pointObjType: '',
                    pointObjName: '',
                    inspectionName: '',
                    remark: ''

                };
            }
        }
    });

})(window.vc);
