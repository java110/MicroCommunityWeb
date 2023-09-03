(function (vc) {
    vc.extends({
        data: {
            addOwnerCommitteeInfo: {
                ocId: '',
                name: '',
                sex: '',
                link: '',
                idCard: '',
                address: '',
                position: '',
                post: '',
                postDesc: '',
                appointTime: '',
                curTime: '',
                state: '',
                remark: '',
                contracts: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
        },
        methods: {
            addOwnerCommitteeValidate() {
                return vc.validate.validate({
                    addOwnerCommitteeInfo: vc.component.addOwnerCommitteeInfo
                }, {
                    'addOwnerCommitteeInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "姓名不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "姓名不能超过30"
                        }
                    ],
                    'addOwnerCommitteeInfo.sex': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "性别不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "性别不能超过12"
                        }
                    ],
                    'addOwnerCommitteeInfo.link': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "电话不能超过11"
                        }
                    ],
                    'addOwnerCommitteeInfo.idCard': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "身份证号码不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "18",
                            errInfo: "身份证号码不能超过18"
                        }
                    ],
                    'addOwnerCommitteeInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "住址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "住址不能超过256"
                        }
                    ],
                    'addOwnerCommitteeInfo.position': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "职位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "职位不能超过64"
                        }
                    ],
                    'addOwnerCommitteeInfo.post': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "岗位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "岗位不能超过64"
                        }
                    ],
                    'addOwnerCommitteeInfo.postDesc': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "岗位描述不能超过64"
                        }
                    ],
                    'addOwnerCommitteeInfo.appointTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "届期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "届期不能超过256"
                        }
                    ],
                    'addOwnerCommitteeInfo.curTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "任期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "任期不能超过256"
                        }
                    ],
                    'addOwnerCommitteeInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态不能超过12"
                        }
                    ],
                    'addOwnerCommitteeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        }
                    ]
                });
            },
            saveOwnerCommitteeInfo: function () {
                if (!vc.component.addOwnerCommitteeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addOwnerCommitteeInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/ownerCommittee.saveOwnerCommittee',
                    JSON.stringify(vc.component.addOwnerCommitteeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            vc.goBack();
                            vc.toast("保存成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            _addContract: function () {
                $that.addOwnerCommitteeInfo.contracts.push({
                    id: vc.uuid(),
                    relName: '',
                    name: '',
                    link: '',
                    address: ''
                })
            },
            _deleteContract: function (_contract) {
                let _tmpContract = [];
                $that.addOwnerCommitteeInfo.contracts.forEach(item => {
                    if (_contract.id != item.id) {
                        _tmpContract.push(item)
                    }
                });
                $that.addOwnerCommitteeInfo.contracts = _tmpContract;
            }
        }
    });
})(window.vc);