(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addBusinessDatabusInfo: {
                databusId: '',
                businessTypeCd: '',
                beanName: '',
                seq: '',
                databusName: '',
                state: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('addBusinessDatabus', 'openAddBusinessDatabusModal', function () {
                $('#addBusinessDatabusModel').modal('show');
            });
        },
        methods: {
            addBusinessDatabusValidate() {
                return vc.validate.validate({
                    addBusinessDatabusInfo: vc.component.addBusinessDatabusInfo
                }, {
                    'addBusinessDatabusInfo.businessTypeCd': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "业务类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "业务类型格式错误"
                        },
                    ],
                    'addBusinessDatabusInfo.beanName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "适配器不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "适配器名称太长"
                        },
                    ],
                    'addBusinessDatabusInfo.databusName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "名称太长"
                        },
                    ],
                    'addBusinessDatabusInfo.seq': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "顺序不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "顺序格式错误"
                        },
                    ],

                    'addBusinessDatabusInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        }]




                });
            },
            saveBusinessDatabusInfo: function () {
                if (!vc.component.addBusinessDatabusValidate()) {
                    vc.toast(vc.validate.errInfo);

                    return;
                }

                vc.component.addBusinessDatabusInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addBusinessDatabusInfo);
                    $('#addBusinessDatabusModel').modal('hide');
                    return;
                }

                vc.http.apiPost(
                    '/businessDatabus/saveBusinessDatabus',
                    JSON.stringify(vc.component.addBusinessDatabusInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addBusinessDatabusModel').modal('hide');
                            vc.component.clearAddBusinessDatabusInfo();
                            vc.emit('businessDatabusManage', 'listBusinessDatabus', {});

                            return;
                        }
                        vc.message(_json.msg);

                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);

                    });
            },
            clearAddBusinessDatabusInfo: function () {
                vc.component.addBusinessDatabusInfo = {
                    businessTypeCd: '',
                    beanName: '',
                    seq: '',
                    databusName: '',
                    state: '',
                };
            }
        }
    });

})(window.vc);
