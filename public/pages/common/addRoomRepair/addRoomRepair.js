(function (vc) {
    vc.extends({
        data: {
            addRoomRepairInfo: {
                repairId: '',
                repairType: '',
                repairName: '',
                tel: '',
                appointmentTime: '',
                context: '',
                repairObjType: '004',
                repairObjId: '',
                repairObjName: '',
                repairSettings: []
            }
        },
        _initMethod: function () {
            vc.component._initAddOwnerRepairInfo();
            $that._listRepairSettings(1, 50, 'F')
            $that.addRoomRepairInfo.repairObjId = vc.getParam('roomId')
            $that.addRoomRepairInfo.repairObjName = vc.getParam('roomName')


        },
        _initEvent: function () {

        },
        methods: {
            addOwnerRepairValidate() {
                return vc.validate.validate({
                    addRoomRepairInfo: vc.component.addRoomRepairInfo
                }, {
                    'addRoomRepairInfo.repairType': [
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
                    'addRoomRepairInfo.repairName': [
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
                    'addRoomRepairInfo.tel': [
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
                    'addRoomRepairInfo.repairObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修对象不能为空"
                        }
                    ],
                    'addRoomRepairInfo.appointmentTime': [
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
                    'addRoomRepairInfo.context': [
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
                });
            },
            saveOwnerRepairInfo: function () {
                if (!vc.component.addOwnerRepairValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addRoomRepairInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/ownerRepair.saveOwnerRepair',
                    JSON.stringify(vc.component.addRoomRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $that._goBack();
                            return;
                        }
                        vc.toast(json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            _initAddOwnerRepairInfo: function () {
                vc.component.addRoomRepairInfo.appointmentTime = vc.dateTimeFormat(new Date().getTime());
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
                        vc.component.addRoomRepairInfo.appointmentTime = value;
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
                vc.http.apiGet('repair.listRepairSettings',
                    param,
                    function (json, res) {
                        var _repairSettingManageInfo = JSON.parse(json);
                        vc.component.addRoomRepairInfo.repairSettings = _repairSettingManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _goBack: function () {
                vc.goBack();
            }
        }
    });
})(window.vc);
