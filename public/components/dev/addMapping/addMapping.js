(function (vc) {
    vc.extends({
        data: {
            addMappingInfo: {
                domain: 'DOMAIN.COMMON',
                name: '',
                key: '',
                value: '',
                remark: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('addMapping', 'openAddMappingModal', function () {
                $('#addMappingModel').modal('show');
            });
        },
        methods: {
            addMappingValidate() {
                return vc.validate.validate({
                    addMappingInfo: vc.component.addMappingInfo
                }, {
                    'addMappingInfo.domain': [{
                        limit: "required",
                        param: "",
                        errInfo: "域不能为空"
                    },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "域长度不能超过50"
                        },
                    ],
                    'addMappingInfo.name': [{
                        limit: "required",
                        param: "",
                        errInfo: "名称不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "2,50",
                            errInfo: "名称必须在2至50字符之间"
                        },
                    ],
                    'addMappingInfo.key': [{
                        limit: "required",
                        param: "",
                        errInfo: "键不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "键必须在1至100之间"
                        },
                    ],
                    'addMappingInfo.value': [{
                        limit: "required",
                        param: "",
                        errInfo: "值不能为空"
                    },
                        {
                            limit: "maxin",
                            param: "1,100",
                            errInfo: "值必须在1至100之间"
                        }
                    ]
                });
            },
            saveMappingInfo: function () {
                if (!vc.component.addMappingValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                //vc.component.addMappingInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.post(
                    'addMapping',
                    'save',
                    JSON.stringify(vc.component.addMappingInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        if (res.status == 200) {
                            //关闭model
                            $('#addMappingModel').modal('hide');
                            vc.component.clearAddMappingInfo();
                            vc.emit('mappingManage', 'listMapping', {});
                            vc.toast("添加成功");
                            return;
                        }
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearAddMappingInfo: function () {
                vc.component.addMappingInfo = {
                    domain: 'DOMAIN.COMMON',
                    name: '',
                    key: '',
                    value: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);