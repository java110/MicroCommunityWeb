(function (vc, vm) {
    vc.extends({
        data: {
            editClassesInfo: {
                classesId: '',
                name: '',
                remark: '',
                times: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editClasses', 'openEditClassesModal', function (_params) {
                vc.component.refreshEditClassesInfo();
                $('#editClassesModel').modal('show');
                vc.copyObject(_params, vc.component.editClassesInfo);
            });
        },
        methods: {
            editClassesValidate: function () {
                return vc.validate.validate({
                    editClassesInfo: vc.component.editClassesInfo
                }, {
                    'editClassesInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班次名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "班次名称不能超过100"
                        }
                    ],
                    'editClassesInfo.remark': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "备注说明不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注说明不能超过200"
                        }
                    ],
                    'editClassesInfo.classesId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editClasses: function () {
                if (!vc.component.editClassesValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/classes.updateClasses',
                    JSON.stringify(vc.component.editClassesInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editClassesModel').modal('hide');
                            vc.emit('classesManage', 'listClasses', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            refreshEditClassesInfo: function () {
                vc.component.editClassesInfo = {
                    classesId: '',
                    name: '',
                    remark: '',
                    times: []
                }
            },
            _addEditTimes: function () {
                $that.editClassesInfo.times.push(
                    {
                        id: vc.uuid(),
                        startTime: '',
                        endTime: ''
                    }
                )
            },
            _deleteEditTimes: function (_time) {
                let _times = $that.editClassesInfo.times;
                for (let _timeIndex = 0; _timeIndex < _times.length; _timeIndex++) {
                    if (_time.id == _times[_timeIndex].id) {
                        _times.splice(_timeIndex, 1);
                    }
                }
            }
        }
    });
})(window.vc, window.vc.component);
