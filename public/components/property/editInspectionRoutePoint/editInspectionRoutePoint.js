(function (vc, vm) {
    vc.extends({
        data: {
            editInspectionRoutePointInfo: {
                communityId: '',
                inspectionId: '',
                irpRelId: '',
                inspectionName: '',
                inspectionRouteId: '',
                pointEndTime: '',
                pointObjId: '',
                pointObjName: '',
                pointObjType: '',
                pointStartTime: '',
                pointTypeName: '',
                remark: '',
                sortNumber: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editInspectionRoutePoint', 'openEditInspectionRoutePointModal',
                function (_params) {
                    vc.component._initEditInspectionRoutePointDateInfo();
                    console.log(_params);
                    vc.component.refresheditInspectionRoutePointInfo();
                    $('#editInspectionRoutePointModel').modal('show');
                    vc.copyObject(_params, vc.component.editInspectionRoutePointInfo);
                    vc.component.editInspectionRoutePointInfo.communityId = vc.getCurrentCommunity().communityId;
                });
        },
        methods: {
            _initEditInspectionRoutePointDateInfo: function () {
                $('.editInspectionRoutePointStartTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    initTime: true,
                    startView: 'day',
                    autoClose: 1,
                    todayBtn: true

                });
                $('.editInspectionRoutePointStartTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editInspectionRoutePointStartTime").val();
                        vc.component.editInspectionRoutePointInfo.pointStartTime = value;
                    });
                $('.editInspectionRoutePointEndTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'hh:ii',
                    initTime: true,
                    startView: 'day',
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editInspectionRoutePointEndTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editInspectionRoutePointEndTime").val();
                        vc.component.editInspectionRoutePointInfo.pointEndTime = value;
                    });
            },
            editInspectionRoutePointValidate: function () {
                return vc.validate.validate({
                        editInspectionRoutePointInfo: vc.component.editInspectionRoutePointInfo
                    },
                    {
                        'editInspectionRoutePointInfo.pointStartTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                        ],
                        'editInspectionRoutePointInfo.pointEndTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                        ],
                        'editInspectionRoutePointInfo.sortNumber': [{
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        }
                        ]
                    });
            },
            editInspectionRoutePoint: function () {
                // if (!vc.component.editInspectionRoutePointValidate()) {
                //     vc.toast(vc.validate.errInfo);
                //     return;
                // }
                vc.http.post('editInspectionRoutePointRel', 'update', JSON.stringify(vc.component.editInspectionRoutePointInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            $('#editInspectionRoutePointModel').modal('hide');
                            vc.emit('inspectionRoutePointManage', 'listInspectionPoint', vc.component.editInspectionRoutePointInfo);
                            return;
                        }
                        vc.toast(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refresheditInspectionRoutePointInfo: function () {
                vc.component.editInspectionRoutePointInfo = {
                    communityId: '',
                    inspectionId: '',
                    irpRelId: '',
                    inspectionName: '',
                    inspectionRouteId: '',
                    pointEndTime: '',
                    pointObjId: '',
                    pointObjName: '',
                    pointObjType: '',
                    pointStartTime: '',
                    pointTypeName: '',
                    remark: '',
                    sortNumber: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);