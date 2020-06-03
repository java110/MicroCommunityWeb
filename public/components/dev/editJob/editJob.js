(function (vc, vm) {

    vc.extends({
        data: {
            editJobInfo: {
                taskId: '',
                taskName: '',
                templateId: '',
                taskCron: '',
                taskAttr: [],
                templates: [],
                templateSpecs: []
            }
        },
        _initMethod: function () {
           
        },
        _initEvent: function () {
            vc.on('editJob', 'openEditJobModal', function (_params) {
                vc.component.refreshEditJobInfo();
                $('#editJobModel').modal('show');
                vc.copyObject(_params, vc.component.editJobInfo);
                $that.queryEditTempalte();
                $that.chooseEditTemplate();
                //vc.component.editJobInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editJobValidate: function () {
                return vc.validate.validate({
                    editJobInfo: vc.component.editJobInfo
                }, {
                    'editJobInfo.taskName': [
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
                    'editJobInfo.templateId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "模板不能为空"
                        },
                    ],
                    'editJobInfo.taskCron': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "定时不能为空"
                        },
                    ]

                });
            },
            editJob: function () {
                if (!vc.component.editJobValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'task.updateTask',
                    JSON.stringify(vc.component.editJobInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        let data = res.data;
                        if (_json.code == 200) {
                            //关闭model
                            $('#editJobModel').modal('hide');
                            vc.component.clearEditJobInfo();
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
            queryEditTempalte: function () {
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
                        console.log('task.listTaskTemplate', json);
                        let _json = JSON.parse(json);
                        let data = _json.data;
                        if (_json.code == 200) {
                            $that.editJobInfo.templates = data;
                            return;
                        }
                    }, function (errInfo, error) {
                        console.log('请求失败处理', errInfo, error);
                        //vc.toast("查询地区失败");
                    });
            },
            chooseEditTemplate: function () {
                //根据当前 template 查询属性 渲染页面
                var _param = {
                    params: {
                        page: 1,
                        row: 30,
                        templateId: $that.editJobInfo.templateId,
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
                                $that.editJobInfo.taskAttr.forEach(tmd => {
                                    if(item.specCd == tmd.specCd && item.templateId == $that.editJobInfo.templateId){
                                        item.value = tmd.value;
                                        item.attrId = tmp.attrId;
                                    }
                                });
                            });
                            $that.editJobInfo.templateSpecs = data;
                            return;
                        }
                    }, function (errInfo, error) {
                        vc.toast("查询模板配置失败");
                    });
            },
            refreshEditJobInfo: function () {
                vc.component.editJobInfo = {
                    taskId: '',
                    taskName: '',
                    templateId: '',
                    taskCron: '',
                    taskAttr: [],
                    templates: [],
                    templateSpecs: []

                }
            }
        }
    });

})(window.vc, window.vc.component);
