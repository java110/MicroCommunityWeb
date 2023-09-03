(function (vc) {
    vc.extends({
        data: {
            notepadOwnerRepairInfo: {
                repairId: '',
                repairType: '',
                repairName: '',
                tel: '',
                appointmentTime: '',
                context: '',
                repairObjType: '004',
                repairObjId: '',
                repairObjName: '',
                repairChannel: 'T',
                noteId: '',
                repairSettings: []
            }
        },
        _initMethod: function () {
            vc.component._initAddOwnerRepairInfo();
        },
        _initEvent: function () {
            vc.on('notepadOwnerRepair', 'openAddOwnerRepairModal', function (_ownerInfo) {
                console.log($that.notepadOwnerRepairInfo);
                $that.notepadOwnerRepairInfo.repairObjName = _ownerInfo.roomName;
                $that.notepadOwnerRepairInfo.repairObjId = _ownerInfo.roomId;
                $that.notepadOwnerRepairInfo.tel = _ownerInfo.link;
                $that.notepadOwnerRepairInfo.repairName = _ownerInfo.objName;
                $that.notepadOwnerRepairInfo.context = _ownerInfo.title;
                $that.notepadOwnerRepairInfo.noteId = _ownerInfo.noteId;
                $that._listRepairSettings(1, 50, 'F');
                $('#notepadOwnerRepairModel').modal('show');
            });
        },
        methods: {
            notepadOwnerRepairValidate() {
                return vc.validate.validate({
                    notepadOwnerRepairInfo: vc.component.notepadOwnerRepairInfo
                }, {
                    'notepadOwnerRepairInfo.repairType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修类型不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "报修类型错误"
                        }
                    ],
                    'notepadOwnerRepairInfo.repairName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修人不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "报修人名称必须在2至10字符之间"
                        }
                    ],
                    'notepadOwnerRepairInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系方式不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系方式格式不正确"
                        }
                    ],
                    'notepadOwnerRepairInfo.repairObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修对象不能为空"
                        }
                    ],
                    'notepadOwnerRepairInfo.appointmentTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "预约时间格式错误"
                        }
                    ],
                    'notepadOwnerRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2000",
                            errInfo: "报修内容不能超过2000"
                        }
                    ],
                });
            },
            saveOwnerRepairInfo: function () {
                if (!vc.component.notepadOwnerRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.notepadOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                vc.http.apiPost(
                    '/ownerRepair.saveOwnerRepair',
                    JSON.stringify(vc.component.notepadOwnerRepairInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (JSON.parse(json).code == 5010) {
                            vc.toast(JSON.parse(json).msg);
                        } else if (res.status == 200) {
                            //关闭model
                            $('#notepadOwnerRepairModel').modal('hide');
                            vc.component.clearAddOwnerRepairInfo();
                            vc.emit('simplifyNotepadManage', 'listNotepad', {});
                            vc.emit('notepadManage', 'listNotepad', {});
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    }
                );
            },
            clearAddOwnerRepairInfo: function () {
                // let _repairSettings = vc.component.notepadOwnerRepairInfo.repairSettings;
                vc.component.notepadOwnerRepairInfo = {
                    repairType: '',
                    repairName: '',
                    tel: '',
                    appointmentTime: '',
                    context: '',
                    repairObjType: '',
                    repairObjId: '',
                    repairObjName: '',
                    repairChannel: 'T',
                    repairSettings: [],
                    noteId: ''
                };
            },
            _initAddOwnerRepairInfo: function () {
                vc.component.notepadOwnerRepairInfo.appointmentTime = vc.dateTimeFormat(new Date().getTime());
                $('.addAppointmentTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.addAppointmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".addAppointmentTime").val();
                        vc.component.notepadOwnerRepairInfo.appointmentTime = value;
                    });
            },
            _listRepairSettings: function (_page, _rows, _publicArea) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        publicArea: _publicArea
                    }
                };
                //发送get请求
                vc.http.apiGet('/repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.notepadOwnerRepairInfo.repairSettings = _repairSettingManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });
})(window.vc);