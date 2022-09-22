(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addDictInfo: {
                id: '',
                statusCd: '',
                name: '',
                description: '',
                specId: '',
                dictSpecs: []
            }
        },
        _initMethod: function () {
            $that._listAddDictSpecs();
        },
        _initEvent: function () {
            vc.on('addDict', 'openAddDictModal', function () {
                $('#addDictModel').modal('show');
            });
        },
        methods: {
            _listAddDictSpecs: function () {
                let param = {
                    params: {
                        page: 1,
                        row: 1000
                    }
                };
                //发送get请求
                vc.http.apiGet('/dictSpec.listDictSpec',
                    param,
                    function (json, res) {
                        let _dictManageInfo = JSON.parse(json);
                        $that.addDictInfo.dictSpecs = _dictManageInfo.data;
                    }, function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
            addDictValidate() {
                return vc.validate.validate({
                    addDictInfo: vc.component.addDictInfo
                }, {
                    'addDictInfo.specId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        }
                    ],
                    'addDictInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "名称不能超过50"
                        },
                    ],
                    'addDictInfo.statusCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "值不能超过64"
                        },
                    ],
                    'addDictInfo.description': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "描述不能超过200"
                        },
                    ]
                });
            },
            saveDictInfo: function () {
                if (!vc.component.addDictValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/dict.saveDict',
                    JSON.stringify(vc.component.addDictInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addDictModel').modal('hide');
                            vc.component.clearAddDictInfo();
                            vc.emit('dictManage', 'listDict', {});
                            vc.toast("添加成功");
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
            clearAddDictInfo: function () {
                let _dictSpecs = $that.addDictInfo.dictSpecs;
                vc.component.addDictInfo = {
                    statusCd: '',
                    name: '',
                    description: '',
                    specId: '',
                    dictSpecs: _dictSpecs
                };
            }
        }
    });
})(window.vc);
