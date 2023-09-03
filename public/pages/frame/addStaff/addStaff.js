(function (vc) {
    vc.extends({
        data: {
            addStaffInfo: {
                orgId: '',
                orgName: '',
                username: '',
                sex: '',
                email: '',
                tel: '',
                address: '',
                relCd: '',
                relCds: [],
                photo: ''
            }
        },
        _initMethod: function () {
            vc.getDict('u_org_staff_rel', "rel_cd", function (_data) {
                vc.component.addStaffInfo.relCds = _data;
            });
        },
        _initEvent: function () {
            vc.on('addStaff', 'notifyUploadCoverImage', function (data) {
                if (data.length > 0) {
                    $that.addStaffInfo.photo = data[0].fileId;
                }
            });
            vc.on('addStaff', 'switchOrg', function (_org) {
                $that.addStaffInfo.orgId = _org.orgId;
                $that.addStaffInfo.orgName = _org.allOrgName;
            });
        },
        methods: {
            addStaffValidate() {
                return vc.validate.validate({
                    addStaffInfo: vc.component.addStaffInfo
                }, {
                    'addStaffInfo.username': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工名称不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "2,10",
                            errInfo: "员工名称长度必须在2位至10位"
                        },
                    ],
                    'addStaffInfo.sex': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工性别不能为空"
                    }],
                    'addStaffInfo.relCd': [{
                        limit: "required",
                        param: "",
                        errInfo: "员工岗位不能为空"
                    },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "员工岗位错误"
                        },
                    ],
                    'addStaffInfo.tel': [{
                        limit: "required",
                        param: "",
                        errInfo: "联系方式不能为空"
                    }],
                    'addStaffInfo.address': [{
                        limit: "required",
                        param: "",
                        errInfo: "家庭住址不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "家庭住址不能超过200位"
                        },
                    ],
                    'addStaffInfo.orgId': [{
                        limit: "required",
                        param: "",
                        errInfo: "关联组织不能为空"
                    }
                    ]
                });
            },
            saveStaffInfo: function () {
                if (!vc.component.addStaffValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addStaffInfo.name = $that.addStaffInfo.username;
                vc.http.apiPost(
                    '/user.staff.add',
                    JSON.stringify(vc.component.addStaffInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json)
                        if (_json.code == 0) {
                            //关闭model
                            $('#addStaffModel').modal('hide');
                            vc.component.clearAddStaffInfo();
                            vc.goBack();
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            clearAddStaffInfo: function () {
                let _relCds = $that.addStaffInfo.relCds;
                vc.component.addStaffInfo = {
                    orgId: '',
                    orgName: '',
                    username: '',
                    sex: '',
                    email: '',
                    tel: '',
                    address: '',
                    relCd: '',
                    relCds: _relCds,
                    photo: ''
                };
            },
            _addStaffChangeOrg: function () {
                vc.emit('chooseOrgTree', 'openOrgModal', {});
            }
        }
    });
})(window.vc);