(function (vc, vm) {
    vc.extends({
        data: {
            editCommunitySpaceInfo: {
                spaceId: '',
                name: '',
                startTime: '',
                endTime: '',
                feeMoney: '',
                adminName: '',
                tel: '',
                state: ''
            }
        },
        _initMethod: function () {
            // vc.initHourMinute('editSpaceStartTime', function(_value) {
            //     $that.editCommunitySpaceInfo.startTime = _value;
            // });
            // vc.initHourMinute('editSpaceEndTime', function(_value) {
            //     $that.editCommunitySpaceInfo.endTime = _value;
            // });
        },
        _initEvent: function () {
            vc.on('editCommunitySpace', 'openEditCommunitySpaceModal', function (_params) {
                vc.component.refreshEditCommunitySpaceInfo();
                $('#editCommunitySpaceModel').modal('show');
                vc.copyObject(_params, vc.component.editCommunitySpaceInfo);
                vc.component.editCommunitySpaceInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editCommunitySpaceValidate: function () {
                return vc.validate.validate({
                    editCommunitySpaceInfo: vc.component.editCommunitySpaceInfo
                }, {
                    'editCommunitySpaceInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        }
                    ],
                    'editCommunitySpaceInfo.startTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约开始时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约开始时间不能超过64"
                        }
                    ],
                    'editCommunitySpaceInfo.endTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约结束时间不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "预约结束时间不能超过64"
                        }
                    ],
                    'editCommunitySpaceInfo.feeMoney': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "每小时费用不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "10",
                            errInfo: "每小时费用不能超过10"
                        }
                    ],
                    'editCommunitySpaceInfo.adminName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "管理员不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "管理员不能超过64"
                        }
                    ],
                    'editCommunitySpaceInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "管理员电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "管理员电话不能超过11"
                        }
                    ],
                    'editCommunitySpaceInfo.state': [
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
                    'editCommunitySpaceInfo.spaceId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editCommunitySpace: function () {
                if (!vc.component.editCommunitySpaceValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/communitySpace.updateCommunitySpace',
                    JSON.stringify(vc.component.editCommunitySpaceInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editCommunitySpaceModel').modal('hide');
                            vc.emit('communitySpaceManage', 'listCommunitySpace', {});
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
            refreshEditCommunitySpaceInfo: function () {
                vc.component.editCommunitySpaceInfo = {
                    spaceId: '',
                    name: '',
                    startTime: '',
                    endTime: '',
                    feeMoney: '',
                    adminName: '',
                    tel: '',
                    state: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);