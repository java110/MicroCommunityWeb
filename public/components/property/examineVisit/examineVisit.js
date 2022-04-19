(function (vc, vm) {
    vc.extends({
        data: {
            examineVisitInfo: {
                stateRemark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('examineVisit', 'openExamineVisitModel', function (_params) {
                vc.component.refreshExamineAppInfo();
                $('#examineAppModel').modal('show');
                vc.component.examineVisitInfo = _params;
            });
        },
        methods: {
            examineAppValidate: function () {
                return vc.validate.validate({
                    examineVisitInfo: vc.component.examineVisitInfo
                }, {
                    'examineVisitInfo.vId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客ID不能为空"
                        }
                    ],
                    'examineVisitInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'examineVisitInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "审核状态不能为空"
                        },
                    ]
                });
            },
            examineVisit: function () {
                if (!vc.component.examineAppValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.post(
                    'editVisit',
                    'update',
                    JSON.stringify(vc.component.examineVisitInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            $('#examineAppModel').modal('hide');
                            vc.emit('appManage', 'listApp', {});
                            vc.toast("审核成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshExamineAppInfo: function () {
                vc.component.examineVisitInfo = {
                    vId: '',
                    vName: '',
                    visitGender: '',
                    phoneNumber: '',
                    visitTime: '',
                    departureTime: '',
                    visitCase: '',
                    state: '',
                    stateRemark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
