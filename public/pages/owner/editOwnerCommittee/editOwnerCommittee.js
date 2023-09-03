(function (vc, vm) {
    vc.extends({
        data: {
            editOwnerCommitteeInfo: {
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
                contracts: [],
                communityId: ''
            }
        },
        _initMethod: function () {
            $that.editOwnerCommitteeInfo.ocId = vc.getParam('ocId');
            $that._listOwnerCommittees();
            $that._listOwnerCommitteeContracts();
        },
        _initEvent: function () {
        },
        methods: {
            editOwnerCommitteeValidate: function () {
                return vc.validate.validate({
                    editOwnerCommitteeInfo: vc.component.editOwnerCommitteeInfo
                }, {
                    'editOwnerCommitteeInfo.name': [
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
                    'editOwnerCommitteeInfo.sex': [
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
                    'editOwnerCommitteeInfo.link': [
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
                    'editOwnerCommitteeInfo.idCard': [
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
                    'editOwnerCommitteeInfo.address': [
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
                    'editOwnerCommitteeInfo.position': [
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
                    'editOwnerCommitteeInfo.post': [
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
                    'editOwnerCommitteeInfo.postDesc': [
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "岗位描述不能超过64"
                        }
                    ],
                    'editOwnerCommitteeInfo.appointTime': [
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
                    'editOwnerCommitteeInfo.curTime': [
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
                    'editOwnerCommitteeInfo.state': [
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
                    'editOwnerCommitteeInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注不能超过200"
                        }
                    ],
                    'editOwnerCommitteeInfo.ocId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editOwnerCommittee: function () {
                if (!vc.component.editOwnerCommitteeValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/ownerCommittee.updateOwnerCommittee',
                    JSON.stringify(vc.component.editOwnerCommitteeInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            vc.goBack();
                            vc.toast("修改成功");
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
            _listOwnerCommittees: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ocId: $that.editOwnerCommitteeInfo.ocId
                    }
                };
                //发送get请求
                vc.http.apiGet('/ownerCommittee.listOwnerCommittee',
                    param,
                    function (json, res) {
                        let _ownerCommitteeManageInfo = JSON.parse(json);
                        vc.copyObject(_ownerCommitteeManageInfo.data[0], $that.editOwnerCommitteeInfo);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _listOwnerCommitteeContracts: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 1,
                        communityId: vc.getCurrentCommunity().communityId,
                        ocId: $that.editOwnerCommitteeInfo.ocId
                    }
                };
                //发送get请求
                vc.http.apiGet('/ownerCommittee.listOwnerCommitteeContract',
                    param,
                    function (json, res) {
                        let _ownerCommitteeManageInfo = JSON.parse(json);
                        _ownerCommitteeManageInfo.data.forEach(item => {
                            item.id = item.contractId;
                        });
                        $that.editOwnerCommitteeInfo.contracts = _ownerCommitteeManageInfo.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            _addContract: function () {
                $that.editOwnerCommitteeInfo.contracts.push({
                    id: vc.uuid(),
                    relName: '',
                    name: '',
                    link: '',
                    address: ''
                })
            },
            _deleteContract: function (_contract) {
                let _tmpContract = [];
                $that.editOwnerCommitteeInfo.contracts.forEach(item => {
                    if (_contract.id != item.id) {
                        _tmpContract.push(item)
                    }
                });
                $that.editOwnerCommitteeInfo.contracts = _tmpContract;
            }
        }
    });
})(window.vc, window.vc.component);