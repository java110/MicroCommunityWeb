(function(vc, vm) {

    vc.extends({
        data: {
            editPropertyCompanyInfo: {
                storeId: '',
                name: '',
                address: '',
                tel: '',
                corporation: '',
                foundingTime: '',
                nearbyLandmarks: '',

            }
        },
        _initMethod: function() {

            vc.initDate('editFoundingTime', function(_value) {
                $that.editPropertyCompanyInfo.foundingTime = _value;
            });
        },
        _initEvent: function() {
            vc.on('editPropertyCompany', 'openEditPropertyCompanyModal', function(_params) {
                vc.component.refreshEditPropertyCompanyInfo();
                $('#editPropertyCompanyModel').modal('show');
                vc.copyObject(_params, vc.component.editPropertyCompanyInfo);
            });
        },
        methods: {
            editPropertyCompanyValidate: function() {
                return vc.validate.validate({
                    editPropertyCompanyInfo: vc.component.editPropertyCompanyInfo
                }, {
                    'editPropertyCompanyInfo.name': [{
                            limit: "required",
                            param: "",
                            errInfo: "名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "名称不能超过100"
                        },
                    ],
                    'editPropertyCompanyInfo.address': [{
                            limit: "required",
                            param: "",
                            errInfo: "地址不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地址不能超过200"
                        },
                    ],
                    'editPropertyCompanyInfo.tel': [{
                            limit: "required",
                            param: "",
                            errInfo: "电话不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "电话不能超过11"
                        },
                    ],
                    'editPropertyCompanyInfo.corporation': [{
                            limit: "required",
                            param: "",
                            errInfo: "公司法人不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "公司法人不能空"
                        },
                    ],
                    'editPropertyCompanyInfo.foundingTime': [{
                            limit: "required",
                            param: "",
                            errInfo: "成立日期不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "成立日期不能空"
                        },
                    ],
                    'editPropertyCompanyInfo.nearbyLandmarks': [{
                            limit: "required",
                            param: "",
                            errInfo: "地标不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "地标不能超过200"
                        },
                    ],
                    'editPropertyCompanyInfo.storeId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editPropertyCompany: function() {
                if (!vc.component.editPropertyCompanyValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/property.updateProperty',
                    JSON.stringify(vc.component.editPropertyCompanyInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editPropertyCompanyModel').modal('hide');
                            vc.emit('propertyCompanyManage', 'listPropertyCompany', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditPropertyCompanyInfo: function() {
                vc.component.editPropertyCompanyInfo = {
                    storeId: '',
                    name: '',
                    address: '',
                    tel: '',
                    corporation: '',
                    foundingTime: '',
                    nearbyLandmarks: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);