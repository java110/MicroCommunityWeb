(function (vc, vm) {

    vc.extends({
        data: {
            editJunkRequirementInfo: {
                junkRequirementId: '',
                classification: '',
                inspectionPlanId: '',
                context: '',
                referencePrice: '',
                publishUserName: '',
                publishUserLink: '',
                state: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editJunkRequirement', 'openEditJunkRequirementModal', function (_params) {
                vc.component.refreshEditJunkRequirementInfo();
                $('#editJunkRequirementModel').modal('show');
                vc.copyObject(_params, vc.component.editJunkRequirementInfo);
                vc.component.editJunkRequirementInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editJunkRequirementValidate: function () {
                return vc.validate.validate({
                    editJunkRequirementInfo: vc.component.editJunkRequirementInfo
                }, {
                    'editJunkRequirementInfo.classification': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类别不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "任务编码格式错误"
                        },
                    ],
                    'editJunkRequirementInfo.inspectionPlanId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "巡检计划不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "收费项目不能超过100位"
                        },
                    ],
                    'editJunkRequirementInfo.context': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "内容不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "内容不能超过200个字符"
                        },
                    ],
                    'editJunkRequirementInfo.referencePrice': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "参考价格不能为空"
                        },
                        {
                            limit: "money",
                            param: "",
                            errInfo: "参考价格格式错误"
                        },
                    ],
                    'editJunkRequirementInfo.publishUserName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "发布人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "发布人不能超过50"
                        },
                    ],
                    'editJunkRequirementInfo.publishUserLink': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系方式不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "联系方式不是有效的电话格式"
                        },
                    ],
                    'editJunkRequirementInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "状态格式错误"
                        },
                    ],
                    'editJunkRequirementInfo.junkRequirementId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "旧货编码不能为空"
                        }]

                });
            },
            editJunkRequirement: function () {
                if (!vc.component.editJunkRequirementValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'junkRequirement.updateJunkRequirement',
                    JSON.stringify(vc.component.editJunkRequirementInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if (res.status == 200) {
                            //关闭model
                            $('#editJunkRequirementModel').modal('hide');
                            vc.emit('junkRequirementManage', 'listJunkRequirement', {});
                            return;
                        }
                        vc.message(json);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditJunkRequirementInfo: function () {
                vc.component.editJunkRequirementInfo = {
                    junkRequirementId: '',
                    classification: '',
                    inspectionPlanId: '',
                    context: '',
                    referencePrice: '',
                    publishUserName: '',
                    publishUserLink: '',
                    state: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
