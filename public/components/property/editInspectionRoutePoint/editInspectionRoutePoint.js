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
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editInspectionRoutePointStartTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editInspectionRoutePointEndTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editInspectionRoutePointValidate: function () {
                return vc.validate.validate({
                    editInspectionRoutePointInfo: vc.component.editInspectionRoutePointInfo
                }, {
                    'editInspectionRoutePointInfo.pointStartTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        }
                    ],
                    'editInspectionRoutePointInfo.pointEndTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        }
                    ],
                    'editInspectionRoutePointInfo.sortNumber': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        }, {
                            limit: "num",
                            param: "",
                            errInfo: "顺序必须是数字"
                        }
                    ]
                });
            },
            editInspectionRoutePoint: function () {
                if (!vc.component.editInspectionRoutePointValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('/inspectionRoute.updateInspectionRoutePointRel', JSON.stringify(vc.component.editInspectionRoutePointInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editInspectionRoutePointModel').modal('hide');
                            vc.emit('inspectionRoutePointManage', 'listInspectionPoint', vc.component.editInspectionRoutePointInfo);
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
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