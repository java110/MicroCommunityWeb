(function (vc) {

    vc.extends({
        data: {
            addJobInfo: {
                taskName: '',
                templateId: '',
                taskCron: '',
                templates: [],
                templateSpecs: []

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addJob', 'openAddJobModal', function () {
                $that.queryTempalte();
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
                        let _json = JSON.parse(json);
                        let data = res.data;
                        if (_json.code == 200) {
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
            queryTempalte: function () {
                var _param = {
                    params: {
                        page: 1,
                        row: 30
                    }
                };
                //获取模板信息
                vc.http.apiGet('task.listTaskTemplate',
                    _param,
                    function (json, res) {
                        console.log('task.listTaskTemplate',json);
                        let _json = JSON.parse(json);
                        let data = _json.data;
                        if (_json.code == 200) {
                            $that.addJobInfo.templates = data;
                            return;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理', errInfo, error);
                        vc.toast("查询地区失败");
                    });
            },
            chooseTemplate: function () {
                //根据当前 template 查询属性 渲染页面
                var _param = {
                    params: {
                        page: 1,
                        row: 30,
                        templateId: $that.addJobInfo.templateId,
                        isShow: 'T'
                    }
                };
                //获取模板信息
                vc.http.apiGet('task.listTaskTemplateSpec',
                    _param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        let data = _json.data;
                        if (_json.code == 200) {
                            data.forEach(item => {
                                item.value = "";
                            });
                            $that.addJobInfo.templateSpecs = data;
                            return;
                        }
                    }, function (errInfo, error) {
                        vc.toast("查询模板配置失败");
                    });
            },
            clearAddJobInfo: function () {
                vc.component.addJobInfo = {
                    taskName: '',
                    templateId: '',
                    taskCron: '',
                    templates: [],
                    templateSpecs: []
                };
            }
        }
    });

})(window.vc);
