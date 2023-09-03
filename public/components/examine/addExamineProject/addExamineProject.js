(function(vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addExamineProjectInfo: {
                projectId: '',
                name: '',
                postCd: '',
                post: '通用岗位',
                weight: '',
                state: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addExamineProject', 'openAddExamineProjectModal', function() {
                $('#addExamineProjectModel').modal('show');
            });
        },
        methods: {
            addExamineProjectValidate() {
                return vc.validate.validate({
                    addExamineProjectInfo: vc.component.addExamineProjectInfo
                }, {
                    'addExamineProjectInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "项目名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "项目名称不能超过64"
                        },
                    ],
                    'addExamineProjectInfo.postCd': [{
                            limit: "required",
                            param: "",
                            errInfo: "岗位不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "岗位编号不能超过30"
                        },
                    ],
                    'addExamineProjectInfo.weight': [{
                            limit: "required",
                            param: "",
                            errInfo: "比重不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "比重不能超过12"
                        },
                    ],
                    'addExamineProjectInfo.state': [{
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态不能超过12"
                        },
                    ],




                });
            },
            saveExamineProjectInfo: function() {
                if (!vc.component.addExamineProjectValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                vc.component.addExamineProjectInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/examine.saveExamineProject',
                    JSON.stringify(vc.component.addExamineProjectInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addExamineProjectModel').modal('hide');
                            vc.component.clearAddExamineProjectInfo();
                            vc.emit('examineProjectManage', 'listExamineProject', {});
                            return;
                        }
                        vc.toast(_json.msg);

                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);

                    });
            },
            clearAddExamineProjectInfo: function() {
                vc.component.addExamineProjectInfo = {
                    name: '',
                    postCd: '',
                    post: '通用岗位',
                    weight: '',
                    state: '',

                };
            }
        }
    });

})(window.vc);