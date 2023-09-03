(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addMachineAuthInfo: {
                authId: '',
                machineId: '',
                personId: '',
                startTime: '',
                endTime: '',
                accessControlMachines: [],
                staffs: []
            }
        },
        _initMethod: function () {
            vc.component.listAddMachineStaffs();
            vc.component.listAddAccessControlMachine();
            vc.component._initAddMachineAuthInfo();
        },
        _initEvent: function () {
            vc.on('addMachineAuth', 'openAddMachineAuthModal', function () {
                $('#addMachineAuthModel').modal('show');
            });
        },
        methods: {
            _initAddMachineAuthInfo: function () {
                $('.startTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.startTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".startTime").val();
                        vc.component.addMachineAuthInfo.startTime = value;
                    });
                $('.endTime').datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.endTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".endTime").val();
                        var start = Date.parse(new Date(vc.component.addMachineAuthInfo.startTime))
                        var end = Date.parse(new Date(value))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $(".endTime").val('')
                        } else {
                            vc.component.addMachineAuthInfo.endTime = value;
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control startTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control endTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            addMachineAuthValidate() {
                return vc.validate.validate({
                    addMachineAuthInfo: vc.component.addMachineAuthInfo
                }, {
                    'addMachineAuthInfo.machineId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "设备不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "设备格式错误"
                        }
                    ],
                    'addMachineAuthInfo.personId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "员工不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "员工名称太长"
                        }
                    ],
                    'addMachineAuthInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "开始时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "开始时间格式错误"
                        }
                    ],
                    'addMachineAuthInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "结束时间不能为空"
                        },
                        {
                            limit: "datetime",
                            param: "",
                            errInfo: "结束时间格式错误"
                        }
                    ]
                });
            },
            saveMachineAuthInfo: function () {
                if (!vc.component.addMachineAuthValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addMachineAuthInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addMachineAuthInfo);
                    $('#addMachineAuthModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    'machineAuth.saveMachineAuth',
                    JSON.stringify(vc.component.addMachineAuthInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addMachineAuthModel').modal('hide');
                            vc.component.clearAddMachineAuthInfo();
                            vc.emit('machineAuthManage', 'listMachineAuth', {});
                            vc.toast("添加成功");
                            vc.component.listAddMachineStaffs();
                            vc.component.listAddAccessControlMachine();
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
            //查询门禁设备
            listAddAccessControlMachine: function () {
                var param = {
                    params: {
                        page: 1,
                        row: 100,
                        machineTypeCd: '9999',
                        communityId: vc.getCurrentCommunity().communityId,
                        domain: 'ACCESS_CONTROL'
                    }
                };
                //发送get请求
                vc.http.apiGet('/machine.listMachines',
                    param,
                    function (json) {
                        var _listAccessControlMachine = JSON.parse(json);
                        vc.component.addMachineAuthInfo.accessControlMachines = _listAccessControlMachine.machines;
                    }, function () {
                        console.log('请求失败处理');
                    }
                );
            },
            //查询员工信息
            listAddMachineStaffs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1000,
                        orgLevel: '2'
                    }
                };
                //发送get请求
                vc.http.apiGet('/query.staff.infos',
                    param,
                    function (json, res) {
                        var _listMachineStaffs = JSON.parse(json);
                        vc.component.addMachineAuthInfo.staffs = _listMachineStaffs.staffs;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            clearAddMachineAuthInfo: function () {
                vc.component.addMachineAuthInfo = {
                    machineId: '',
                    personId: '',
                    startTime: '',
                    endTime: '',
                    accessControlMachines: [],
                    staffs: []
                };
            }
        }
    });
})(window.vc);
