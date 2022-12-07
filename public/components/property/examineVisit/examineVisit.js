(function (vc, vm) {
    vc.extends({
        data: {
            examineVisitInfo: {
                vId: '',
                vName: '',
                visitGender: '',
                phoneNumber: '',
                visitTime: '',
                departureTime: '',
                visitCase: '',
                state: '',
                flag: '1',
                stateRemark: '',
                carNum: '',
                freeTime: '',
                ownerId: '',
                ownerName: '',
                psId: '',
                reasonType: '',
                recordState: '',
                stateName: '',
                userId: '',
                communityId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('examineVisit', 'openExamineVisitModel', function (_params) {
                vc.component.refreshExamineVisitInfo();
                $('#examineVisitModel').modal('show');
                vc.copyObject(_params, vc.component.examineVisitInfo);
                vc.component.examineVisitInfo.state = "";
                vc.component.examineVisitInfo.flag = "1";
            });
        },
        methods: {
            examineVisitValidate: function () {
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
                        }
                    ]
                });
            },
            examineVisit: function () {
                if (!vc.component.examineVisitValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/visit.updateVisit',
                    JSON.stringify(vc.component.examineVisitInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (res.status == 200 && _json.code != 404 && _json.code != 5010) {
                            //关闭model
                            $('#examineVisitModel').modal('hide');
                            vc.emit('visitManage', 'listVisit', {});
                            vc.toast("审核成功");
                            return;
                        } else if (_json.code == 5010) {
                            //关闭model
                            $('#examineVisitModel').modal('hide');
                            vc.emit('visitManage', 'listVisit', {});
                            vc.toast(_json.msg);
                            return;
                        } else {
                            vc.toast(_json.msg);
                            vc.component.examineVisitInfo.state = '0';
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshExamineVisitInfo: function () {
                vc.component.examineVisitInfo = {
                    vId: '',
                    vName: '',
                    visitGender: '',
                    phoneNumber: '',
                    visitTime: '',
                    departureTime: '',
                    visitCase: '',
                    state: '',
                    flag: '1',
                    stateRemark: '',
                    carNum: '',
                    freeTime: '',
                    ownerId: '',
                    ownerName: '',
                    psId: '',
                    reasonType: '',
                    recordState: '',
                    stateName: '',
                    userId: '',
                    communityId: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
