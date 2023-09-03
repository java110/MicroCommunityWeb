(function (vc, vm) {
    vc.extends({
        data: {
            examineVisitCarInfo: {
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
                carState: '',
                carStateName: '',
                userId: '',
                communityId: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('examineVisitCar', 'openExamineVisitCarModel', function (_params) {
                vc.component.refreshExamineVisitCarInfo();
                $('#examineVisitCarModel').modal('show');
                vc.copyObject(_params, vc.component.examineVisitCarInfo);
                vc.component.examineVisitCarInfo.carState = "";
                vc.component.examineVisitCarInfo.flag = "1";
            });
        },
        methods: {
            examineVisitValidate: function () {
                return vc.validate.validate({
                    examineVisitCarInfo: vc.component.examineVisitCarInfo
                }, {
                    'examineVisitCarInfo.vId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客ID不能为空"
                        }
                    ],
                    'examineVisitCarInfo.vName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "访客姓名不能为空"
                        }
                    ],
                    'examineVisitCarInfo.carState': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车辆审核状态不能为空"
                        }
                    ]
                });
            },
            examineVisitCar: function () {
                if (!vc.component.examineVisitValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/visit.examineVisitCar',
                    JSON.stringify(vc.component.examineVisitCarInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (res.status == 200 && _json.code != 404 && _json.code != 5010) {
                            //关闭model
                            $('#examineVisitCarModel').modal('hide');
                            vc.emit('visitManage', 'listVisit', {});
                            vc.toast(_json.msg);
                            return;
                        } else if (_json.code == 5010) {
                            //关闭model
                            $('#examineVisitCarModel').modal('hide');
                            vc.emit('visitManage', 'listVisit', {});
                            vc.toast(_json.msg);
                            return;
                        } else {
                            vc.toast(_json.msg);
                            vc.component.examineVisitCarInfo.carState = '0';
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            refreshExamineVisitCarInfo: function () {
                vc.component.examineVisitCarInfo = {
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
                    carState: '',
                    carStateName: '',
                    userId: '',
                    communityId: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
