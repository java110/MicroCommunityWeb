(function (vc) {

    vc.extends({
        data: {
            addAttendanceClassesStaffInfo: {
                csId: '',
                classesId: '',
                staffId:'',
                staffName: '',
                photo:''

            }
        },
        _initMethod: function () {
            $that.addAttendanceClassesStaffInfo.classesId = vc.getParam('classesId');
        },
        _initEvent: function () {
            vc.on("addAttendanceClassesStaff", "notifyUploadImage", function (_param) {
                if(_param.length > 0){
                    vc.component.addAttendanceClassesStaffInfo.photo = _param[0].url;
                }
            });
        },
        methods: {
            addAttendanceClassesStaffValidate() {
                return vc.validate.validate({
                    addAttendanceClassesStaffInfo: vc.component.addAttendanceClassesStaffInfo
                }, {
                    'addAttendanceClassesStaffInfo.classesId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "班次ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "班次ID不能超过64"
                        },
                    ],
                    'addAttendanceClassesStaffInfo.staffName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "员工名称不能超过200"
                        },
                    ],
                });
            },
            saveAttendanceClassesStaffInfo: function () {
                if (!vc.component.addAttendanceClassesStaffValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAttendanceClassesStaffInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/attendanceClasses.saveAttendanceClassesStaff',
                    JSON.stringify(vc.component.addAttendanceClassesStaffInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAttendanceClassesStaffModel').modal('hide');
                            vc.goBack();
                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            chooseStaff: function() {
                vc.emit('selectStaff', 'openStaff', $that.addAttendanceClassesStaffInfo);
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });

})(window.vc);
