(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addHousekeepingTypeInfo: {
                hktId: '',
                hktName: '',
                hktIcon: '',
                hktDesc: '',
                label: '',
                seq: '',
                url: '',
                skipType: '',
                isShow: '',
                typeCd: ''

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addHousekeepingType', 'openAddHousekeepingTypeModal', function () {
                $('#addHousekeepingTypeModel').modal('show');
            });
            vc.on("addHousekeepingType", "notifyUploadCoverImage", function (_param) {
                if (_param.length > 0) {
                    console.log(_param);
                    vc.component.addHousekeepingTypeInfo.hktIcon = _param[0];
                } else {
                    vc.component.addHousekeepingTypeInfo.hktIcon = '';
                }
            });
        },
        methods: {
            addHousekeepingTypeValidate() {
                return vc.validate.validate({
                    addHousekeepingTypeInfo: vc.component.addHousekeepingTypeInfo
                }, {
                    'addHousekeepingTypeInfo.hktName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类别名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "30",
                            errInfo: "类别名称名称太长"
                        },
                    ],
                    'addHousekeepingTypeInfo.hktIcon': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "小图标不能为空"
                        }
                    ],
                    'addHousekeepingTypeInfo.hktDesc': [
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "服务描述太长"
                        },
                    ],
                    'addHousekeepingTypeInfo.label': [
                        {
                            limit: "maxLength",
                            param: "15",
                            errInfo: "标签描述太长"
                        },
                    ],
                    'addHousekeepingTypeInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "排序不是有效数字"
                        },
                    ],
                    'addHousekeepingTypeInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否显示不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "2",
                            errInfo: "是否显示格式错误"
                        },
                    ],
                    'addHousekeepingTypeInfo.typeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "请选择类型"
                        }
                    ]
                });
            },
            saveHousekeepingTypeInfo: function () {
                if (!vc.component.addHousekeepingTypeValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }
                $that.addHousekeepingTypeInfo.shopId = '9999';
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addHousekeepingTypeInfo);
                    $('#addHousekeepingTypeModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/housekeepingType/saveHousekeepingType',
                    JSON.stringify(vc.component.addHousekeepingTypeInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addHousekeepingTypeModel').modal('hide');
                            vc.component.clearAddHousekeepingTypeInfo();
                            vc.emit('housekeepingTypeManage', 'listHousekeepingType', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddHousekeepingTypeInfo: function () {
                vc.component.addHousekeepingTypeInfo = {
                    hktName: '',
                    hktIcon: '',
                    hktDesc: '',
                    label: '',
                    seq: '',
                    url: '',
                    skipType: '',
                    isShow: '',
                    typeCd: ''

                };
            }
        }
    });

})(window.vc);
