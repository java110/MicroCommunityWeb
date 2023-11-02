(function (vc, vm) {
    vc.extends({
        data: {
            editExamineProjectInfo: {
                projectId: '',
                name: '',
                postCd: '',
                post: '',
                weight: '',
                state: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editExamineProject', 'openEditExamineProjectModal', function (_params) {
                vc.component.refreshEditExamineProjectInfo();
                $('#editExamineProjectModel').modal('show');
                vc.copyObject(_params, vc.component.editExamineProjectInfo);
                vc.component.editExamineProjectInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editExamineProjectValidate: function () {
                return vc.validate.validate({
                    editExamineProjectInfo: vc.component.editExamineProjectInfo
                }, {
                    'editExamineProjectInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "项目名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "项目名称不能超过64"
                        }
                    ],
                    'editExamineProjectInfo.postCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "岗位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "岗位编号不能超过30"
                        }
                    ],
                    'editExamineProjectInfo.weight': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "比重不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "比重不能超过12"
                        }
                    ],
                    'editExamineProjectInfo.state': [
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
                    'editExamineProjectInfo.projectId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }
                    ]
                });
            },
            editExamineProject: function () {
                if (!vc.component.editExamineProjectValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/examine.updateExamineProject',
                    JSON.stringify(vc.component.editExamineProjectInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editExamineProjectModel').modal('hide');
                            vc.emit('examineProjectManage', 'listExamineProject', {});
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
            refreshEditExamineProjectInfo: function () {
                vc.component.editExamineProjectInfo = {
                    projectId: '',
                    name: '',
                    postCd: '',
                    post: '',
                    weight: '',
                    state: ''
                }
            }
        }
    });
})(window.vc, window.vc.component);