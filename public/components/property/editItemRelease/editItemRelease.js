(function (vc, vm) {
    vc.extends({
        data: {
            editItemReleaseInfo: {
                irId: '',
                typeId: '',
                applyCompany: '',
                applyPerson: '',
                idCard: '',
                applyTel: '',
                passTime: '',
                resName: '',
                amount: '',
                state: '',
                carNum: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editItemRelease', 'openEditItemReleaseModal', function (_params) {
                vc.component.refreshEditItemReleaseInfo();
                $('#editItemReleaseModel').modal('show');
                vc.copyObject(_params, vc.component.editItemReleaseInfo);
                vc.component.editItemReleaseInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editItemReleaseValidate: function () {
                return vc.validate.validate({
                    editItemReleaseInfo: vc.component.editItemReleaseInfo
                }, {
                    'editItemReleaseInfo.typeId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "放行类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "放行类型不能超过30"
                        }
                    ],
                    'editItemReleaseInfo.applyCompany': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请单位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请单位不能超过64"
                        }
                    ],
                    'editItemReleaseInfo.applyPerson': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "申请人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "申请人不能超过64"
                        }
                    ],
                    'editItemReleaseInfo.idCard': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "身份证不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "18",
                            errInfo: "身份证不能超过18"
                        }
                    ],
                    'editItemReleaseInfo.applyTel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "手机号不能超过11"
                        }
                    ],
                    'editItemReleaseInfo.passTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "通行时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "通行时间不能超过12"
                        }
                    ],
                    'editItemReleaseInfo.resName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "放行物品不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "放行物品不能超过12"
                        }
                    ],
                    'editItemReleaseInfo.amount': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "物品数量不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "物品数量不能超过12"
                        }
                    ],
                    'editItemReleaseInfo.state': [
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
                    'editItemReleaseInfo.carNum': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "车牌号不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "车牌号不能超过12"
                        }
                    ],
                    'editItemReleaseInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        }
                    ],
                    'editItemReleaseInfo.irId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editItemRelease: function () {
                if (!vc.component.editItemReleaseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    'itemRelease.updateItemRelease',
                    JSON.stringify(vc.component.editItemReleaseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editItemReleaseModel').modal('hide');
                            vc.emit('itemReleaseManage', 'listItemRelease', {});
                            vc.toast("修改成功");
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
            refreshEditItemReleaseInfo: function () {
                vc.component.editItemReleaseInfo = {
                    irId: '',
                    typeId: '',
                    applyCompany: '',
                    applyPerson: '',
                    idCard: '',
                    applyTel: '',
                    passTime: '',
                    resName: '',
                    amount: '',
                    state: '',
                    carNum: '',
                    remark: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);
