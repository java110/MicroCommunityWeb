(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addAttrSpecInfo: {
                specCd: '',
                tableName: '',
                specName: '',
                specHoldplace: '',
                required: '',
                specShow: '',
                specValueType: '',
                specType: '',
                listShow: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addAttrSpec', 'openAddAttrSpecModal', function () {
                $('#addAttrSpecModel').modal('show');
            });
        },
        methods: {
            addAttrSpecValidate() {
                return vc.validate.validate({
                    addAttrSpecInfo: vc.component.addAttrSpecInfo
                }, {
                    'addAttrSpecInfo.tableName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "属性表不能为空"
                        }],
                    'addAttrSpecInfo.specName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "规格名称太长"
                        },
                    ],
                    'addAttrSpecInfo.specHoldplace': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "说明不能超过500位"
                        },
                    ],
                    'addAttrSpecInfo.required': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填不能为空"
                        }],
                    'addAttrSpecInfo.specShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "展示不能为空"
                        }],
                    'addAttrSpecInfo.specValueType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "值类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "值类型格式错误"
                        },
                    ],
                    'addAttrSpecInfo.specType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "规格类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "规格类型错误"
                        },
                    ],
                    'addAttrSpecInfo.listShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "查询显示不能为空"
                        }]
                });
            },
            saveAttrSpecInfo: function () {
                if (!vc.component.addAttrSpecValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addAttrSpecInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addAttrSpecInfo);
                    $('#addAttrSpecModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/attrSpec/saveAttrSpec',
                    JSON.stringify(vc.component.addAttrSpecInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addAttrSpecModel').modal('hide');
                            vc.component.clearAddAttrSpecInfo();
                            vc.emit('attrSpecManage', 'listAttrSpec', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddAttrSpecInfo: function () {
                vc.component.addAttrSpecInfo = {
                    tableName: '',
                    specName: '',
                    specHoldplace: '',
                    required: '',
                    specShow: '',
                    specValueType: '',
                    specType: '',
                    listShow: '',

                };
            }
        }
    });

})(window.vc);
