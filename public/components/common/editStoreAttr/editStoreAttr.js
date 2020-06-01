(function (vc, vm) {
    vc.extends({
        data: {
            editStoreAttr: {
                attrId:'',
                value:'',
                name:'',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

            vc.on("editStoreAttr", "openEditStoreAttrModal", function (_param) {
                vc.component.clearEditStoreAttr();
                vc.component.refreshEditStoreAttr(_param);
                $('#editStoreAttrModel').modal('show');
            });

        },
        methods: {
            refreshEditStoreAttr(_storeAttr){
                var _storeAttr = _storeAttr._storeAttr;
                vc.component.editStoreAttr.attrId = _storeAttr.attrId;
                vc.component.editStoreAttr.value = _storeAttr.value;
                vc.component.editStoreAttr.name = _storeAttr.name;
            },
            clearEditStoreAttr(){
                vc.component.editStoreAttr= {
                    attrId:'',
                    value:'',
                    name:''
                }
            },
            editStoreAttrValidate: function () {
                return vc.validate.validate({
                    editStoreAttrInfo: vc.component.editStoreAttr
                }, {
                    'editStoreAttrInfo.value': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "必填"
                        },
                        {
                            limit: "maxLength",
                            param: "50",
                            errInfo: "属性值不能超过50位"
                        },
                    ],
                    'editStoreAttrInfo.attrId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "属性id不能为空"
                        }
                    ]
                });
            },
            submitEditStoreAttr:function () {
                if (!vc.component.editStoreAttrValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost('storeAttr.updateStoreAttr',
                    JSON.stringify(vc.component.editStoreAttr),
                    {},
                    function (json, res) {
                        if (res.status == 200) {
                            $('#editStoreAttrModel').modal('hide');
                            vc.emit('storeInfoManage', 'getStoreInfo', {});
                            return;
                        }
                        vc.toast(json);
                    }, function (bodyText, res) {
                        if (res.status == 200) {
                            $('#editStoreAttrModel').modal('hide');
                            vc.emit('storeInfoManage', 'getStoreInfo', {});
                            return;
                        }
                        vc.toast(bodyText);
                    }
                );
            }
        }
    });

})(window.vc, window.vc.component);
