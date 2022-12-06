(function (vc, vm) {
    vc.extends({
        data: {
            editReserveCatalogInfo: {
                catalogId: '',
                name: '',
                sort: '',
                type: '',
                state: '',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editReserveCatalog', 'openEditReserveCatalogModal', function (_params) {
                vc.component.refreshEditReserveCatalogInfo();
                $('#editReserveCatalogModel').modal('show');
                vc.copyObject(_params, vc.component.editReserveCatalogInfo);
                vc.component.editReserveCatalogInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editReserveCatalogValidate: function () {
                return vc.validate.validate({
                    editReserveCatalogInfo: vc.component.editReserveCatalogInfo
                }, {
                    'editReserveCatalogInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "预约名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "128",
                            errInfo: "预约名称不能超过128"
                        },
                    ],
                    'editReserveCatalogInfo.sort': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "排序不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "排序不能超过12"
                        },
                    ],
                    'editReserveCatalogInfo.type': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "类型不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "类型不能超过12"
                        },
                    ],
                    'editReserveCatalogInfo.state': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "状态不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "12",
                            errInfo: "状态展示不能超过12"
                        },
                    ],
                    'editReserveCatalogInfo.catalogId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "编号不能为空"
                        }]

                });
            },
            editReserveCatalog: function () {
                if (!vc.component.editReserveCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/reserve.updateReserveCatalog',
                    JSON.stringify(vc.component.editReserveCatalogInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editReserveCatalogModel').modal('hide');
                            vc.emit('reserveCatalogManage', 'listReserveCatalog', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            refreshEditReserveCatalogInfo: function () {
                vc.component.editReserveCatalogInfo = {
                    catalogId: '',
                    name: '',
                    sort: '',
                    type: '',
                    state: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
