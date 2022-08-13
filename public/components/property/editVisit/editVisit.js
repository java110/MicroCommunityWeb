(function (vc, vm) {
    vc.extends({
        data: {
            editVisitInfo: {}
        },
        _initMethod: function () {
            vc.component._initEditDate();
        },
        _initEvent: function () {
            vc.on('editVisit', 'openEditVisitModel', function (_params) {
                console.log("这里")
                console.log(_params)
                vc.component.refreshEditAppInfo();
                $('#editAppModel').modal('show');
                vc.component.editVisitInfo = _params;
            });
        },
        methods: {
            _initEditDate: function () {
                $(".editVisitTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $(".editDepartureTime").datetimepicker({
                    language: 'zh-CN',
                    fontAwesome: 'fa',
                    format: 'yyyy-mm-dd hh:ii:ss',
                    initTime: true,
                    initialDate: new Date(),
                    autoClose: 1,
                    todayBtn: true
                });
                $('.editVisitTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editVisitTime").val();
                        vc.component.editVisitInfo.visitTime = value;
                    });
                $('.editDepartureTime').datetimepicker()
                    .on('changeDate', function (ev) {
                        var value = $(".editDepartureTime").val();
                        vc.component.editVisitInfo.departureTime = value;
                        let start = Date.parse(new Date($that.editVisitInfo.visitTime))
                        let end = Date.parse(new Date($that.editVisitInfo.departureTime))
                        if (start - end >= 0) {
                            vc.toast("结束时间必须大于开始时间")
                            $that.editVisitInfo.departureTime = '';
                        }
                    });
                //防止多次点击时间插件失去焦点
                document.getElementsByClassName('form-control editVisitTime')[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }

                document.getElementsByClassName("form-control editDepartureTime")[0].addEventListener('click', myfunc)

                function myfunc(e) {
                    e.currentTarget.blur();
                }
            },
            editAppValidate: function () {
                return vc.validate.validate({
                    editVisitInfo: vc.component.editVisitInfo
                }, {
                    'editVisitInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'editVisitInfo.visitGender': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客性别不能为空"
                        },
                    ],
                    'editVisitInfo.phoneNumber': [
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "访客联系方式不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "访客联系方式必须是数字"
                        }
                    ],
                    'editVisitInfo.visitTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客来访时间不能为空"
                        },
                    ],
                    'editVisitInfo.departureTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客离开时间不能为空"
                        },
                    ],
                    'editVisitInfo.visitCase': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客到访原因不能为空"
                        },
                    ]
                });
            },
            editVisit: function () {
                if (!vc.component.editAppValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/visit.updateVisit',
                    JSON.stringify(vc.component.editVisitInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editAppModel').modal('hide');
                            vc.emit('appManage', 'listApp', {});
                            vc.toast("修改成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshEditAppInfo: function () {
                vc.component.editAppInfo = {
                    vName: '',
                    visitGender: '',
                    phoneNumber: '',
                    visitTime: '',
                    departureTime: '',
                    visitCase: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
