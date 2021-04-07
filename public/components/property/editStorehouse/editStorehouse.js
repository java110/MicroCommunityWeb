(function (vc, vm) {

    vc.extends({
        data: {
            editStorehouseInfo: {
                shId: '',
                shName: '',
                shType: '',
                shDesc: '',

            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {
            vc.on('editStorehouse', 'openEditStorehouseModal', function (_params) {
                vc.component.refreshEditStorehouseInfo();
                $('#editStorehouseModel').modal('show');
                vc.copyObject(_params, vc.component.editStorehouseInfo);
                vc.component.editStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editStorehouseValidate: function () {
                return vc.validate.validate({
                    editStorehouseInfo: vc.component.editStorehouseInfo
                }, {
                    'editStorehouseInfo.shName': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库名称不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "64",
                            errInfo: "仓库名称太长"
                        },
                    ],
                    'editStorehouseInfo.shType': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库类型不能为空"
                        },
                        {
                            limit: "num",
                            param: "",
                            errInfo: "仓库类型格式错误"
                        },
                    ],
                    'editStorehouseInfo.shDesc': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "描述不能为空"
                        },
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述太长"
                        },
                    ],
                    'editStorehouseInfo.shId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库编号不能为空"
                        }]

                });
            },
            editStorehouse: function () {
                if (!vc.component.editStorehouseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }

                vc.http.apiPost(
                    'resourceStore.updateStorehouse',
                    JSON.stringify(vc.component.editStorehouseInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editStorehouseModel').modal('hide');
                            vc.emit('storehouseManage', 'listStorehouse', {});
                            return;
                        }
                        vc.message(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');

                        vc.message(errInfo);
                    });
            },
            refreshEditStorehouseInfo: function () {
                vc.component.editStorehouseInfo = {
                    shId: '',
                    shName: '',
                    shType: '',
                    shDesc: '',

                }
            }
        }
    });

})(window.vc, window.vc.component);
