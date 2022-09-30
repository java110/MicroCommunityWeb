(function(vc, vm) {

    vc.extends({
        data: {
            editCommunitySpacePersonInfo: {
                cspId: '',
                spaceId: '',
                personName: '',
                personTel: '',
                appointmentTime: '',
                receivableAmount: '',
                receivedAmount: '',
                payWay: '',
                state: '',
                remark: '',
                spaces: [],
            }
        },
        _initMethod: function() {
            vc.initDate('editAppointmentDate', function(_value) {
                $that.editCommunitySpacePersonInfo.appointmentDate = _value;
            });
            vc.initHourMinute('editAppointmentTime', function(_value) {
                $that.editCommunitySpacePersonInfo.appointmentTime = _value;
            });
        },
        _initEvent: function() {
            vc.on('editCommunitySpacePerson', 'openEditCommunitySpacePersonModal', function(_params) {
                vc.component.refreshEditCommunitySpacePersonInfo();
                $that._listEditCommunitySpacePersonCommunitySpaces();
                $('#editCommunitySpacePersonModel').modal('show');
                vc.copyObject(_params, vc.component.editCommunitySpacePersonInfo);
                vc.component.editCommunitySpacePersonInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCommunitySpacePersonValidate: function() {
                return vc.validate.validate({
                    editCommunitySpacePersonInfo: vc.component.editCommunitySpacePersonInfo
                }, {
                    'editCommunitySpacePersonInfo.cspId': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "预约ID不能超过30"
                        },
                    ],
                    'editCommunitySpacePersonInfo.spaceId': [{
                            limit: "required",
                            param: "",
                            errInfo: "场地ID不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "场地ID不能超过30"
                        },
                    ],
                    'editCommunitySpacePersonInfo.personName': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约人不能超过64"
                        },
                    ],
                    'editCommunitySpacePersonInfo.personTel': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "预约电话不能超过11"
                        },
                    ],
                    'editCommunitySpacePersonInfo.appointmentTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "预约时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约时间不能超过64"
                        },
                    ],
                    'editCommunitySpacePersonInfo.receivableAmount': [{
                            limit: "required",
                            param: "",
                            errInfo: "应收金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "应收金额不能超过10"
                        },
                    ],
                    'editCommunitySpacePersonInfo.receivedAmount': [{
                            limit: "required",
                            param: "",
                            errInfo: "实收金额不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "实收金额不能超过10"
                        },
                    ],
                    'editCommunitySpacePersonInfo.payWay': [{
                            limit: "required",
                            param: "",
                            errInfo: "支付方式不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "支付方式不能超过12"
                        },
                    ],
                    'editCommunitySpacePersonInfo.state': [{
                            limit: "required",
                            param: "",
                            errInfo: "state不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "state不能超过12"
                        },
                    ],
                    'editCommunitySpacePersonInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "remark不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "remark不能超过512"
                        },
                    ],
                    'editCommunitySpacePersonInfo.cspId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editCommunitySpacePerson: function() {
                if (!vc.component.editCommunitySpacePersonValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/communitySpace.updateCommunitySpacePerson',
                    JSON.stringify(vc.component.editCommunitySpacePersonInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunitySpacePersonModel').modal('hide');
                            vc.emit('communitySpacePersonManage', 'listCommunitySpacePerson', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditCommunitySpacePersonInfo: function() {
                vc.component.editCommunitySpacePersonInfo = {
                    cspId: '',
                    spaceId: '',
                    personName: '',
                    personTel: '',
                    appointmentTime: '',
                    receivableAmount: '',
                    receivedAmount: '',
                    payWay: '',
                    state: '',
                    remark: '',
                    spaces: [],
                }
            },
            _listEditCommunitySpacePersonCommunitySpaces: function(_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId
                    }
                };
                //发送get请求
                vc.http.apiGet('/communitySpace.listCommunitySpace',
                    param,
                    function(json, res) {
                        let _communitySpaceManageInfo = JSON.parse(json);
                        vc.component.editCommunitySpacePersonInfo.spaces = _communitySpaceManageInfo.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });

})(window.vc, window.vc.component);