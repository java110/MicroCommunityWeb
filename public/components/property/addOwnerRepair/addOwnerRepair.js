(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addOwnerRepairInfo: {
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
            vc.component._initAddOwnerRepairInfo();
        },
        _initEvent: function () {
            vc.on('addOwnerRepair', 'notify', function (_param) {
                console.log('notify', _param);
                if (_param.hasOwnProperty('roomId')) {
                    $that.addOwnerRepairInfo.roomId = _param.roomId;
                }
            });
            vc.on('addOwnerRepair', 'openAddOwnerRepairModal', function (_ownerInfo) {
                $('#addOwnerRepairModel').modal('show');
            });
        },
        methods: {
            addOwnerRepairValidate() {
                return vc.validate.validate({
                    addOwnerRepairInfo: vc.component.addOwnerRepairInfo
                }, {
                    'addOwnerRepairInfo.repairType': [
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
                    'addOwnerRepairInfo.repairName': [
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
                    'addOwnerRepairInfo.tel': [
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
                    'addOwnerRepairInfo.roomId': [
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
                    'addOwnerRepairInfo.appointmentTime': [
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
                    'addOwnerRepairInfo.context': [
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

                vc.component.addOwnerRepairInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addOwnerRepairInfo);
                    $('#addOwnerRepairModel').modal('hide');
                    return;
                }

                vc.http.post(
                    'addOwnerRepair',
                    'save',
                    JSON.stringify(vc.component.addOwnerRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#addOwnerRepairModel').modal('hide');
                            vc.component.clearAddOwnerRepairInfo();
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
            clearAddOwnerRepairInfo: function () {
                let _repairSettings = vc.component.addOwnerRepairInfo.repairSettings;
                vc.component.addOwnerRepairInfo = {
                    repairType: '',
                    repairName: '',
                    tel: '',
                    roomId: '',
                    appointmentTime: '',
                    context: '',
                    repairSettings: _repairSettings
                };
            },
            _initAddOwnerRepairInfo: function () {
                vc.component.addOwnerRepairInfo.appointmentTime = vc.dateFormat(new Date().getTime());
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
                        vc.component.addOwnerRepairInfo.appointmentTime = value;
                    });

                //加载报修类型
                $that._listRepairSettings(1, 50);



            },
            _listRepairSettings: function (_page, _rows) {


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
                        vc.component.addOwnerRepairInfo.repairSettings = _repairSettingManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            }
        }
    });

})(window.vc);
