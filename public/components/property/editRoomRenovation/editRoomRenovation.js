(function (vc, vm) {

    vc.extends({
        data: {
            editRoomRenovationInfo: {
                rId: '',
                roomName: '',
                personName: '',
                personTel: '',
                startTime: '',
                endTime: '',
                remark: '',
                state: '',
                isViolation: 'N',
                violationDesc: '',
                roomId:''
            }
        },
        _initMethod: function () {
            vc.initDate('editStartTime', function (_startTime) {
                $that.editRoomRenovationInfo.startTime = _startTime;
            });
            vc.initDate('editEndTime', function (_endTime) {
                $that.editRoomRenovationInfo.endTime = _endTime;
                let start = Date.parse(new Date($that.editRoomRenovationInfo.startTime))
                let end = Date.parse(new Date($that.editRoomRenovationInfo.endTime))
                if (start - end >= 0) {
                    vc.toast("结束时间必须大于开始时间")
                    $that.editRoomRenovationInfo.endTime = '';
                }
            });
        },
        _initEvent: function () {
            vc.on('editRoomRenovation', 'openEditRoomRenovationModal', function (_params) {
                vc.component.refreshEditRoomRenovationInfo();
                $('#editRoomRenovationModel').modal('show');
                vc.copyObject(_params, vc.component.editRoomRenovationInfo);
                $that.editRoomRenovationInfo.startTime = vc.dateFormat(_params.startTime);
                $that.editRoomRenovationInfo.endTime = vc.dateFormat(_params.endTime);
                vc.component.editRoomRenovationInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editRoomRenovationValidate: function () {
                return vc.validate.validate({
                    editRoomRenovationInfo: vc.component.editRoomRenovationInfo
                }, {
                    'editRoomRenovationInfo.roomName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "房屋格式错误"
                        },
                    ],
                    'editRoomRenovationInfo.personName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "联系人格式错误"
                        },
                    ],
                    'editRoomRenovationInfo.personTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "联系电话错误"
                        },
                    ],
                    'editRoomRenovationInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "装修时间错误"
                        },
                    ],
                    'editRoomRenovationInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "date",
                            param: "",
                            errInfo: "结束时间错误"
                        },
                    ],
                    'editRoomRenovationInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注太长"
                        },
                    ],
                    'editRoomRenovationInfo.rId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "装修ID不能为空"
                        }]

                });
            },
            editRoomRenovation: function () {
                if (!vc.component.editRoomRenovationValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/roomRenovation/updateRoomRenovation',
                    JSON.stringify(vc.component.editRoomRenovationInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editRoomRenovationModel').modal('hide');
                            vc.emit('roomRenovationManage', 'listRoomRenovation', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditRoomRenovationInfo: function () {
                vc.component.editRoomRenovationInfo = {
                    rId: '',
                    roomName: '',
                    personName: '',
                    personTel: '',
                    startTime: '',
                    endTime: '',
                    remark: '',
                    state: '',
                    isViolation: 'N',
                    violationDesc: '',
                    roomId:''
                }
            }
        }
    });

})(window.vc, window.vc.component);
