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
                            errInfo: "编码不能为空"
                        }]

                });
            },
            editJunkRequirement: function () {
                if (!vc.component.editJunkRequirementValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.editJunkRequirementInfo.communityId = vc.getCurrentCommunity().communityId;

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
