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
                appointmentTime: '',
                context: '',
                repairObjType: '',
                repairObjId: '',
                repairObjName: '',
                repairChannel: 'T',
                repairSettings: []
            }
        },
        _initMethod: function () {
            vc.component._initAddOwnerRepairInfo();
        },
        _initEvent: function () {
            vc.on('addOwnerRepair', 'notify', function (_param) {
                console.log('notify', _param);
                let _repairObjType = $that.addOwnerRepairInfo.repairObjType;
                if (_param.hasOwnProperty("floorId") && _repairObjType == '002') {
                    vc.component.addOwnerRepairInfo.repairObjId = _param.floorId;
                    vc.component.addOwnerRepairInfo.repairObjName = _param.name;
                }
                if (_param.hasOwnProperty("unitId") && _repairObjType == '003') {
                    vc.component.addOwnerRepairInfo.repairObjId = _param.unitId;
                    vc.component.addOwnerRepairInfo.repairObjName = _param.name;
                }
                if (_param.hasOwnProperty("roomId") && _repairObjType == '004') {
                    vc.component.addOwnerRepairInfo.repairObjId = _param.roomId;
                    vc.component.addOwnerRepairInfo.repairObjName = _param.name;
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
                            param: "2,10",
                            errInfo: "报修人名称必须在2至10字符之间"
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
                    'addOwnerRepairInfo.repairObjId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "报修对象不能为空"
                        }
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
                let _repairObjType = $that.addOwnerRepairInfo.repairObjType;
                if (_repairObjType == '001') {
                    vc.component.addOwnerRepairInfo.repairObjId = vc.getCurrentCommunity().communityId;
                    vc.component.addOwnerRepairInfo.repairObjName = vc.getCurrentCommunity().name;
                }
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
                vc.http.apiPost(
                    '/ownerRepair.saveOwnerRepair',
                    JSON.stringify(vc.component.addOwnerRepairInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (JSON.parse(json).code == 5010) {
                            vc.toast(JSON.parse(json).msg);
                        } else if (res.status == 200) {
                            //关闭model
                            $('#addOwnerRepairModel').modal('hide');
                            vc.component.clearAddOwnerRepairInfo();
                            vc.emit('ownerRepairManage', 'listOwnerRepair', {});
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddOwnerRepairInfo: function () {
                // let _repairSettings = vc.component.addOwnerRepairInfo.repairSettings;
                vc.component.addOwnerRepairInfo = {
                    repairType: '',
                    repairName: '',
                    tel: '',
                    appointmentTime: '',
                    context: '',
                    repairObjType: '',
                    repairObjId: '',
                    repairObjName: '',
                    repairChannel: 'T',
                    repairSettings: []
                };
                vc.emit('addOwnerRepair', 'roomSelect2', 'clearRoom', {});
                vc.emit('addOwnerRepair', 'unitSelect2', 'clearUnit', {});
                vc.emit('addOwnerRepair', 'floorSelect2', 'clearFloor', {});
            },
            _initAddOwnerRepairInfo: function () {
                vc.component.addOwnerRepairInfo.appointmentTime = vc.dateTimeFormat(new Date().getTime());
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
                        vc.component.addOwnerRepairInfo.repairSettings = _repairSettingManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _changeRepairObjType: function () {
                let _publicArea = "T";
                let _repairObjType = $that.addOwnerRepairInfo.repairObjType;
                if (_repairObjType == '004') {
                    _publicArea = "F";
                }
                vc.component.addOwnerRepairInfo.repairObjId = '';
                vc.component.addOwnerRepairInfo.repairObjName = '';
                vc.component.addOwnerRepairInfo.repairType = '';
                //加载报修类型
                $that._listRepairSettings(1, 50, _publicArea);
            }
        }
    });
})(window.vc);
