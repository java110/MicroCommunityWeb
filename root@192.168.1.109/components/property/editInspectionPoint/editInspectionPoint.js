(function(vc, vm) {
    vc.extends({
        data: {
            editInspectionPointInfo: {
                inspectionId: '',
                pointObjId: '',
                pointObjType: '',
                pointObjTypes: [],
                pointObjName: '',
                inspectionName: '',
                communityId: '',
                remark: '',
                items: [],
                itemId: '',
                nfcCode: ''
            }
        },
        _initMethod: function() {},
        _initEvent: function() {
            vc.on('editInspectionPoint', 'openEditInspectionPointModal', function(_params) {
                vc.component.refreshEditInspectionPointInfo();
                //与字典表关联
                vc.getDict('inspection_point', "point_obj_type", function(_data) {
                    vc.component.editInspectionPointInfo.pointObjTypes = _data;
                });
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
                $that._listEditInspectionItems();
            });
            vc.on("editInspectionPointInfo", "notify", function(_param) {
                if (_param.hasOwnProperty("machineId") && $that.editInspectionPointInfo.pointObjType == '1001') {
                    vc.component.editInspectionPointInfo.pointObjId = _param.machineId;
                    vc.component.editInspectionPointInfo.pointObjName = _param.machineName;
                }
            });
        },
        methods: {
            editInspectionPointValidate: function() {
                return vc.validate.validate({
                    editInspectionPointInfo: vc.component.editInspectionPointInfo
                }, {
                    'editInspectionPointInfo.inspectionName': [{
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
                    'editInspectionPointInfo.pointObjId': [{
                        limit: "required",
                        param: "",
                        errInfo: "位置信息不能为空"
                    }, ],
                    'editInspectionPointInfo.pointObjType': [{
                        limit: "required",
                        param: "",
                        errInfo: "巡检类型不能为空"
                    }, ],
                    'editInspectionPointInfo.pointObjName': [{
                        limit: "required",
                        param: "",
                        errInfo: "巡检位置不能为空"
                    }, ],
                    'editInspectionPointInfo.itemId': [{
                        limit: "required",
                        param: "",
                        errInfo: "巡检项目不能为空"
                    }, ],
                    'editInspectionPointInfo.remark': [{
                        limit: "maxLength",
                        param: "200",
                        errInfo: "备注信息不能超过200位"
                    }, ],
                    'editInspectionPointInfo.inspectionId': [{
                        limit: "required",
                        param: "",
                        errInfo: "巡检点ID不能为空"
                    }]
                });
            },
            _pointObjTypeChange: function(){
                let type = vc.component.editInspectionPointInfo.pointObjType;
                vc.component.editInspectionPointInfo.pointObjId = '';
                vc.component.editInspectionPointInfo.pointObjName = '';
                if (type == '1001') {
                    vc.emit('editInspectionPoint', 'machineSelect2', 'setMachine', {
                        machineId: vc.component.editInspectionPointInfo.pointObjId,
                        machineName: '必填，请选择设备',
                    });
                }
            },
            editInspectionPoint: function() {
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
                    JSON.stringify(vc.component.editInspectionPointInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editInspectionPointModel').modal('hide');
                            vc.emit('inspectionPointManage', 'listInspectionPoint', {});
                            return;
                        }
                        vc.toast(json);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _listEditInspectionItems: function(_page, _rows) {
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
                    function(json, res) {
                        let _inspectionItemManageInfo = JSON.parse(json);

                        vc.component.editInspectionPointInfo.items = _inspectionItemManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            refreshEditInspectionPointInfo: function() {
                vc.component.editInspectionPointInfo = {
                    inspectionId: '',
                    pointObjId: '',
                    pointObjType: '',
                    pointObjTypes: [],
                    pointObjName: '',
                    inspectionName: '',
                    communityId: '',
                    remark: '',
                    items: [],
                    itemId: '',
                    nfcCode: ''
                }
            },
        }
    });
})(window.vc, window.vc.component);