(function(vc, vm) {

    vc.extends({
        data: {
            editInspectionItemInfo: {
                itemId: '',
                itemName: '',
                remark: '',

            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('editInspectionItem', 'openEditInspectionItemModal', function(_params) {
                vc.component.refreshEditInspectionItemInfo();
                $('#editInspectionItemModel').modal('show');
                vc.copyObject(_params, vc.component.editInspectionItemInfo);
                vc.component.editInspectionItemInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editInspectionItemValidate: function() {
                return vc.validate.validate({
                    editInspectionItemInfo: vc.component.editInspectionItemInfo
                }, {
                    'editInspectionItemInfo.itemName': [{
                            limit: "required",
                            param: "",
                            errInfo: "巡检项目不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "256",
                            errInfo: "巡检项目不能超过256"
                        },
                    ],
                    'editInspectionItemInfo.remark': [{
                            limit: "required",
                            param: "",
                            errInfo: "备注不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "备注不能超过512"
                        },
                    ],
                    'editInspectionItemInfo.itemId': [{
                        limit: "required",
                        param: "",
                        errInfo: "编号不能为空"
                    }]

                });
            },
            editInspectionItem: function() {
                if (!vc.component.editInspectionItemValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    '/inspectionItem.updateInspectionItem',
                    JSON.stringify(vc.component.editInspectionItemInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editInspectionItemModel').modal('hide');
                            vc.emit('inspectionItemManage', 'listInspectionItem', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditInspectionItemInfo: function() {
                vc.component.editInspectionItemInfo = {
                    itemId: '',
                    itemName: '',
                    remark: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);