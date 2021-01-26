(function (vc, vm) {
    vc.extends({
        data: {
            editOwnerRepairInfo: {
                repairId: '',
                repairType: '',
                repairName: '',
                tel: '',
                roomId: '',
                roomName: '',
                appointmentTime: '',
                context: '',
                repairSettings: [],
                repairObjType: '',
                repairObjId: '',
                repairObjName: ''
            }
        },
        _initMethod: function () {
            vc.component._initEditOwnerRepairInfo();
        },
        _initEvent: function () {
            vc.on('editOwnerRepair', 'notify', function (_param) {
                console.log('notify', _param);
                let _repairObjType = $that.editOwnerRepairInfo.repairObjType;
                if (_param.hasOwnProperty("floorId") && _repairObjType == '002') {
                    vc.component.editOwnerRepairInfo.repairObjId = _param.floorId;
                    vc.component.editOwnerRepairInfo.repairObjName = _param.floorName;
                }
                if (_param.hasOwnProperty("unitId") && _repairObjType == '003') {
                    vc.component.editOwnerRepairInfo.repairObjId = _param.unitId;
                    vc.component.editOwnerRepairInfo.repairObjName = _param.unitName;
                }
                if (_param.hasOwnProperty("roomId") && _repairObjType == '004') {
                    vc.component.editOwnerRepairInfo.repairObjId = _param.roomId;
                    vc.component.editOwnerRepairInfo.repairObjName = _param.name;
                }
            });
            vc.on('editOwnerRepair', 'openEditOwnerRepairModal', function (_params) {
                vc.component.refreshEditOwnerRepairInfo();
                vc.copyObject(_params, vc.component.editOwnerRepairInfo);
                $that._changeEditRepairObjType();
                $('#editOwnerRepairModel').modal('show');
                vc.component.editOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editOwnerRepairValidate: function () {
                return vc.validate.validate({
                    editOwnerRepairInfo: vc.component.editOwnerRepairInfo
                }, {
                    'editOwnerRepairInfo.repairType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修类型不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "报修类型错误"
                        },
                    ],
                    'editOwnerRepairInfo.repairName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修人不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "报修人名称必须在2至50字符之间"
                        },
                    ],
                    'editOwnerRepairInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系方式不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系方式格式不正确"
                        },
                    ],
                    'editOwnerRepairInfo.repairObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修对象不能为空"
                        }
                    ],
                    'editOwnerRepairInfo.appointmentTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "预约时间格式错误"
                        },
                    ],
                    'editOwnerRepairInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2000",
                            errInfo: "报修内容不能超过2000"
                        },
                    ],
                    'editOwnerRepairInfo.repairId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修ID不能为空"
                        }]
                });
            },
            editOwnerRepair: function () {
                let _repairObjType = $that.editOwnerRepairInfo.repairObjType;
                if (_repairObjType == '001') {
                    vc.component.editOwnerRepairInfo.repairObjId = vc.getCurrentCommunity().communityId;
                    vc.component.editOwnerRepairInfo.repairObjName = vc.getCurrentCommunity().name;
                }
                if (!vc.component.editOwnerRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'editOwnerRepair',
                    'update',
                    JSON.stringify(vc.component.editOwnerRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editOwnerRepairModel').modal('hide');
                            vc.emit('ownerRepairManage', 'listOwnerRepair', {});
                            vc.toast("修改成功");
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditOwnerRepairInfo: function () {
                vc.component.editOwnerRepairInfo = {
                    repairId: '',
                    repairType: '',
                    repairName: '',
                    tel: '',
                    roomId: '',
                    roomName: '',
                    appointmentTime: '',
                    context: '',
                    repairSettings: [],
                    repairObjType: '',
                    repairObjId: '',
                    repairObjName: ''
                }
                vc.emit('addOwnerRepair', 'roomSelect2', 'clearRoom', {});
                vc.emit('addOwnerRepair', 'unitSelect2', 'clearUnit', {});
                vc.emit('addOwnerRepair', 'floorSelect2', 'clearFloor', {});
            },
            _initEditOwnerRepairInfo: function () {
                $('.editAppointmentTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editAppointmentTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editAppointmentTime").val();
                        vc.component.editOwnerRepairInfo.appointmentTime = value;
                    });
                //加载报修类型
                $that._listEditRepairSettings(1, 50);
            },
            _listEditRepairSettings: function (_page, _rows, _publicArea) {
                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId,
                        publicArea: _publicArea
                    }
                };
                //发送get请求
                vc.http.apiGet('repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.editOwnerRepairInfo.repairSettings = _repairSettingManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeEditRepairObjType: function () {
                let _publicArea = "T";
                let _repairObjType = $that.editOwnerRepairInfo.repairObjType;
                if (_repairObjType == '004') {
                    _publicArea = "F";
                }
                //加载报修类型
                $that._listEditRepairSettings(1, 50, _publicArea);
            }
        }
    });
})(window.vc, window.vc.component);
