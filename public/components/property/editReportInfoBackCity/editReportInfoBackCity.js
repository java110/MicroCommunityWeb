(function (vc, vm) {

    vc.extends({
        data: {
            editReportInfoBackCityInfo: {
                backId: '',
                name: '',
                idCard: '',
                tel: '',
                source: '',
                sourceCityName: '',
                backTime: '',
                remark: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editReportInfoBackCity', 'openEditReportInfoBackCityModal', function (_params) {
                vc.component.refreshEditReportInfoBackCityInfo();
                $('#editReportInfoBackCityModel').modal('show');
                vc.copyObject(_params, vc.component.editReportInfoBackCityInfo);
                vc.component.editReportInfoBackCityInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editReportInfoBackCityValidate: function () {
                return vc.validate.validate({
                    editReportInfoBackCityInfo: vc.component.editReportInfoBackCityInfo
                }, {
                    'editReportInfoBackCityInfo.name': [
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
                    'editReportInfoBackCityInfo.idCard': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "身份证不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "身份证不能为空"
                        },
                    ],
                    'editReportInfoBackCityInfo.tel': [
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
                    'editReportInfoBackCityInfo.source': [
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
                    'editReportInfoBackCityInfo.sourceCityName': [
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
                    'editReportInfoBackCityInfo.backTime': [
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
                    'editReportInfoBackCityInfo.remark': [
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "备注内容不能超过200"
                        },
                    ],
                    'editReportInfoBackCityInfo.backId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "返回ID不能为空"
                        }]

                });
            },
            editReportInfoBackCity: function () {
                if (!vc.component.editReportInfoBackCityValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/reportInfoBackCity/updateReportInfoBackCity',
                    JSON.stringify(vc.component.editReportInfoBackCityInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReportInfoBackCityModel').modal('hide');
                            vc.emit('reportInfoBackCityManage', 'listReportInfoBackCity', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditReportInfoBackCityInfo: function () {
                vc.component.editReportInfoBackCityInfo = {
                    backId: '',
                    name: '',
                    idCard: '',
                    tel: '',
                    source: '',
                    sourceCityName: '',
                    backTime: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
