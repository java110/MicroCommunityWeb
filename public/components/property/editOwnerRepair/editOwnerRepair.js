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
                repairSettings: []
            }
        },
        _initMethod: function () {
            vc.component._initEditOwnerRepairInfo();
        },
        _initEvent: function () {
            vc.on('editOwnerRepair', 'notify', function (_param) {
                console.log('notify', _param);
                if (_param.hasOwnProperty('roomId')) {
                    $that.editOwnerRepairInfo.roomId = _param.roomId;
                }
            });
            vc.on('editOwnerRepair', 'openEditOwnerRepairModal', function (_params) {
                vc.component.refreshEditOwnerRepairInfo();
                $('#editOwnerRepairModel').modal('show');
                vc.copyObject(_params, vc.component.editOwnerRepairInfo);
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
                    'editOwnerRepairInfo.roomId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "房屋ID不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "房屋ID错误"
                        },
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
                            return;
                        }
                        vc.toast(json);
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

                }
            },
            _initEditOwnerRepairInfo: function () {
                //vc.component.editOwnerRepairInfo.startTime = vc.dateFormat(new Date().getTime());
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
            _listEditRepairSettings: function (_page, _rows) {

                var param = {
                    params: {
                        page: _page,
                        row: _rows,
                        communityId: vc.getCurrentCommunity().communityId
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
            }
        }
    });

})(window.vc, window.vc.component);
