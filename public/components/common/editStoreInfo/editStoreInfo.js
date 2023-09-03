(function (vc, vm) {
    vc.extends({
        data: {
            editStoreInfo: {
                storeId: '',
                name: '',
                address: '',
                tel: '',
                nearByLandmarks: '',
                mapX: '',
                mapY: ''
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on("editStoreInfo", "openEditStoreModal", function (_param) {
                vc.component.clearEditStoreInfo();
                vc.component.refreshEditStoreInfo(_param);
                $('#editStoreModel').modal('show');
            });
        },
        methods: {
            refreshEditStoreInfo(_storeInfo) {
                _storeInfo = _storeInfo._storeInfo;
                vc.component.editStoreInfo.storeId = _storeInfo.storeId;
                vc.component.editStoreInfo.name = _storeInfo.name;
                vc.component.editStoreInfo.address = _storeInfo.address;
                vc.component.editStoreInfo.tel = _storeInfo.tel;
                vc.component.editStoreInfo.nearByLandmarks = _storeInfo.nearByLandmarks;
                vc.component.editStoreInfo.mapX = _storeInfo.mapX;
                vc.component.editStoreInfo.mapY = _storeInfo.mapY;
            },
            clearEditStoreInfo() {
                vc.component.editStoreInfo = {
                    storeId: '',
                    name: '',
                    address: '',
                    tel: '',
                    nearByLandmarks: '',
                    mapX: '',
                    mapY: ''
                }
            },
            editStoreValidate: function () {
                return vc.validate.validate({
                    editStoreInfo: vc.component.editStoreInfo
                }, {
                    'editStoreInfo.name': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商户名称必填"
                        },
                        {
                            limit: "maxLength",
                            param: "100",
                            errInfo: "商户名称不能超过100位"
                        }
                    ],
                    'editStoreInfo.address': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "商户地址必填"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "商户地址不能超过200位"
                        }
                    ],
                    'editStoreInfo.tel': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "联系电话必填"
                        },
                        {
                            limit: "maxLength",
                            param: "11",
                            errInfo: "联系电话最多11位"
                        }
                    ],
                    'editStoreInfo.nearByLandmarks': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "附件地标必填"
                        },
                        {
                            limit: "maxLength",
                            param: "200",
                            errInfo: "附件地标位置最多200位"
                        }
                    ]
                });
            },
            submitEditStoreInfo: function () {
                if (!vc.component.editStoreValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('update.store.info',
                    JSON.stringify(vc.component.editStoreInfo),
                    {},
                    function (json, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#editStoreModel').modal('hide');
                            vc.emit('storeInfoManage', 'getStoreInfo', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    }, function (bodyText, res) {
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            $('#editStoreModel').modal('hide');
                            vc.emit('storeInfoManage', 'getStoreInfo', {});
                            vc.toast("修改成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    }
                );
            }
        }
    });
})(window.vc, window.vc.component);
