(function (vc) {

    vc.extends({
        data: {
            addJobInfo: {
                taskName: '',
                templateId: '',
                taskCron: ''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addJob', 'openAddJobModal', function () {
                $('#addJobModel').modal('show');
            });
        },
        methods: {
            addJobValidate() {
                return vc.validate.validate({
                    addJobInfo: vc.component.addJobInfo
                }, {
                    'addJobInfo.taskName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "任务名称不能为空"
                        },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "任务名称必须在2至50字符之间"
                        },
                    ],
                    'addJobInfo.templateId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "模板不能为空"
                        },
                    ],
                    'addJobInfo.taskCron': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "定时不能为空"
                        },
                    ]
                });
            },
            saveJobInfo: function () {
                if (!vc.component.addJobValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                //vc.component.addJobInfo.communityId = vc.getCurrentCommunity().communityId;

            
                vc.http.apiPost(
                    'task.saveTask',
                    JSON.stringify(vc.component.addJobInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let data = res.data;
                        if (data.code == 200) {
                            //关闭model
                            $('#addJobModel').modal('hide');
                            vc.component.clearAddJobInfo();
                            vc.emit('jobManage', 'listJob', {});

                            return;
                        }
                        vc.toast(json);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.toast(errInfo);

                    });
            },
            clearAddJobInfo: function () {
                vc.component.addJobInfo = {
                    taskName: '',
                    templateId: '',
                    taskCron: ''
                };
            }
        }
    });

})(window.vc);
