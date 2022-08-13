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
                pointObjTypes: [],
                pointObjName: '',
                inspectionName: '',
                remark: '',
                items: [],
                itemId: '',
                nfcCode: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            //与字典表关联
            vc.getDict('inspection_point', "point_obj_type", function (_data) {
                vc.component.addInspectionPointInfo.pointObjTypes = _data;
            });
            vc.on('addInspectionPoint', 'openAddInspectionPointModal', function () {
                $that._listAddInspectionItems();
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
                    'addInspectionPointInfo.inspectionName': [{
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
                    'addInspectionPointInfo.pointObjType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检类型不能为空"
                        }
                    ],
                    'addInspectionPointInfo.itemId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检项目不能为空"
                        }
                    ],
                    'addInspectionPointInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注信息不能超过200位"
                        }
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
                if ($that.addInspectionPointInfo.pointObjType == '1001' && !vc.validate.required($that.addInspectionPointInfo.pointObjId)) {
                    vc.toast("巡检设备不能为空");
                    return;
                }
                if ($that.addInspectionPointInfo.pointObjType == '2002' && !vc.validate.required($that.addInspectionPointInfo.pointObjName)) {
                    vc.toast("巡检位置不能为空");
                    return;
                }
                vc.component.addInspectionPointInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addInspectionPointInfo);
                    $('#addInspectionPointModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/inspectionPoint.saveInspectionPoint',
                    JSON.stringify(vc.component.addInspectionPointInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addInspectionPointModel').modal('hide');
                            vc.component.clearAddInspectionPointInfo();
                            vc.emit('addInspectionPoint', 'machineSelect2', 'setMachine', {
                                machineId: '',
                                machineName: '必填，请选择设备',
                            });
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
            _listAddInspectionItems: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/inspectionItem.listInspectionItem',
                    param,
                    function (json, res) {
                        let _inspectionItemManageInfo = JSON.parse(json);
                        vc.component.addInspectionPointInfo.items = _inspectionItemManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _pointObjTypeChange: function () {
                let type = vc.component.addInspectionPointInfo.pointObjType;
                vc.component.addInspectionPointInfo.pointObjId = '';
                vc.component.addInspectionPointInfo.pointObjName = '';
                if (type == '1001') {
                    vc.emit('addInspectionPoint', 'machineSelect2', 'setMachine', {
                        machineId: vc.component.addInspectionPointInfo.pointObjId,
                        machineName: '必填，请选择设备',
                    });
                }
            },
            clearAddInspectionPointInfo: function () {
                //与字典表关联
                vc.getDict('inspection_point', "point_obj_type", function (_data) {
                    vc.component.addInspectionPointInfo.pointObjTypes = _data;
                });
                vc.component.addInspectionPointInfo = {
                    inspectionId: '',
                    pointObjId: '',
                    pointObjType: '',
                    pointObjName: '',
                    inspectionName: '',
                    remark: '',
                    items: [],
                    itemId: '',
                    nfcCode: ''
                };
            }
        }
    });
})(window.vc);