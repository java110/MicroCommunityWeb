(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addScheduleClassesStaffInfo: {
             
                scheduleId: '',
            
                staffs: []

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addScheduleClassesStaff', 'openAddScheduleClassesStaffModal', function (_param) {
                vc.copyObject(_param,$that.addScheduleClassesStaffInfo);
                vc.emit('selectStaffs', 'setStaffs',$that.addScheduleClassesStaffInfo.staffs);
                $('#addScheduleClassesStaffModel').modal('show');
            });
        },
        methods: {
            addScheduleClassesStaffValidate() {
                return vc.validate.validate({
                    addScheduleClassesStaffInfo: vc.component.addScheduleClassesStaffInfo
                }, {
                    'addScheduleClassesStaffInfo.scheduleId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排班ID不能为空"
                        },
                    ],
                });
            },
            saveScheduleClassesStaffInfo: function () {
                if (!vc.component.addScheduleClassesStaffValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/scheduleClasses.saveScheduleClassesStaff',
                    JSON.stringify(vc.component.addScheduleClassesStaffInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addScheduleClassesStaffModel').modal('hide');
                            vc.component.clearAddScheduleClassesStaffInfo();
                            vc.emit('scheduleClassesStaffManage', 'listScheduleClassesStaff', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddScheduleClassesStaffInfo: function () {
                vc.component.addScheduleClassesStaffInfo = {
                    scheduleId: '',
                    staffs: []
                };
            }
        }
    });

})(window.vc);
