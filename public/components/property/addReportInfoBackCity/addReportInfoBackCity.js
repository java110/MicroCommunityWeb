(function (vc) {
    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReportInfoBackCityInfo: {
                backId: '',
                name: '',
                idCard: '',
                tel: '',
                source: '',
                sourceCity: '8630101',
                sourceCityName: '',
                backTime: '',
                remark: ''
            }
        },
        _initMethod: function () {
            vc.initDateTime('addBackTime', function (_value) {
                $that.addReportInfoBackCityInfo.backTime = _value;
            });
            //防止多次点击时间插件失去焦点
            document.getElementsByClassName('form-control addBackTime')[0].addEventListener('click', myfunc)

            function myfunc(e) {
                e.currentTarget.blur();
            }
        },
        _initEvent: function () {
            vc.on('addReportInfoBackCity', 'openAddReportInfoBackCityModal', function () {
                $('#addReportInfoBackCityModel').modal('show');
            });
        },
        methods: {
            addReportInfoBackCityValidate() {
                return vc.validate.validate({
                    addReportInfoBackCityInfo: vc.component.addReportInfoBackCityInfo
                }, {
                    'addReportInfoBackCityInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "姓名不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "姓名超过64位"
                        },
                    ],
                    'addReportInfoBackCityInfo.idCard': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "身份证不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "身份证格式不对"
                        },
                        {
                            limit: "idCard",
                            param: "",
                            errInfo: "不是有效的身份证号"
                        },
                    ],
                    'addReportInfoBackCityInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "手机号不能为空"
                        },
                        {
                            limit: "phone",
                            param: "",
                            errInfo: "手机号格式错误"
                        },
                    ],
                    'addReportInfoBackCityInfo.source': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "来源地不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "来源地格式错误"
                        },
                    ],
                    'addReportInfoBackCityInfo.sourceCityName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "城市名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "城市名称格式错误"
                        },
                    ],
                    'addReportInfoBackCityInfo.backTime': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "返回时间不能为空"
                        },
                        {
                            limit: "dateTime",
                            param: "",
                            errInfo: "返回时间格式错误"
                        },
                    ],
                    'addReportInfoBackCityInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ]
                });
            },
            saveReportInfoBackCityInfo: function () {
                if (!vc.component.addReportInfoBackCityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addReportInfoBackCityInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if (vc.notNull($props.callBackListener)) {
                    vc.emit($props.callBackListener, $props.callBackFunction, vc.component.addReportInfoBackCityInfo);
                    $('#addReportInfoBackCityModel').modal('hide');
                    return;
                }
                vc.http.apiPost(
                    '/reportInfoBackCity/saveReportInfoBackCity',
                    JSON.stringify(vc.component.addReportInfoBackCityInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReportInfoBackCityModel').modal('hide');
                            vc.component.clearAddReportInfoBackCityInfo();
                            vc.emit('reportInfoBackCityManage', 'listReportInfoBackCity', {});
                            vc.toast("上报成功")
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
            clearAddReportInfoBackCityInfo: function () {
                vc.component.addReportInfoBackCityInfo = {
                    name: '',
                    idCard: '',
                    tel: '',
                    source: '',
                    sourceCity: '8630101',
                    sourceCityName: '',
                    backTime: '',
                    remark: ''
                };
            }
        }
    });
})(window.vc);
