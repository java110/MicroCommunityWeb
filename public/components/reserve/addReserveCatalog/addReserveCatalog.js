(function (vc) {

    vc.extends({
        propTypes: {
            callBackListener: vc.propTypes.string, //父组件名称
            callBackFunction: vc.propTypes.string //父组件监听方法
        },
        data: {
            addReserveCatalogInfo: {
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
            vc.on('addReserveCatalog', 'openAddReserveCatalogModal', function () {
                $('#addReserveCatalogModel').modal('show');
            });
        },
        methods: {
            addReserveCatalogValidate() {
                return vc.validate.validate({
                    addReserveCatalogInfo: vc.component.addReserveCatalogInfo
                }, {
                    'addReserveCatalogInfo.name': [
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
                    'addReserveCatalogInfo.sort': [
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
                    'addReserveCatalogInfo.type': [
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
                });
            },
            saveReserveCatalogInfo: function () {
                if (!vc.component.addReserveCatalogValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.component.addReserveCatalogInfo.communityId = vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reserve.saveReserveCatalog',
                    JSON.stringify(vc.component.addReserveCatalogInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addReserveCatalogModel').modal('hide');
                            vc.component.clearAddReserveCatalogInfo();
                            vc.emit('reserveCatalogManage', 'listReserveCatalog', {});
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        vc.toast(errInfo);
                    });
            },
            clearAddReserveCatalogInfo: function () {
                vc.component.addReserveCatalogInfo = {
                    name: '',
                    sort: '',
                    type: '',
                    state: '',
                };
            }
        }
    });

})(window.vc);
