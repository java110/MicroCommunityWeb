(function (vc, vm) {
    vc.extends({
        data: {
            editStorehouseInfo: {
                shId: '',
                shName: '',
                shDesc: '',
                isShow: '',
                purchaseSwitch: '',
                purchaseRafId: '',
                useSwitch: '',
                useRafId: '',
                allocationSwitch: '',
                allocationRafId: '',
                allowPurchase: 'ON',
                allowUse: 'ON',
                flows: []
            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('editStorehouse', 'openEditStorehouseModal', function (_params) {
                $that.refreshEditStorehouseInfo();
                $that._listEditResourceAuditFlows();
                $('#editStorehouseModel').modal('show');
                vc.copyObject(_params, $that.editStorehouseInfo);
                $that.editStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods: {
            editStorehouseValidate: function () {
                return vc.validate.validate({
                    editStorehouseInfo: $that.editStorehouseInfo
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
                        }
                    ],
                    'editStorehouseInfo.isShow': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "是否对外开放选框不能为空"
                        }
                    ],
                    'editStorehouseInfo.shDesc': [
                        {
                            limit: "maxLength",
                            param: "512",
                            errInfo: "描述太长"
                        }
                    ],
                    'editStorehouseInfo.shId': [
                        {
                            limit: "required",
                            param: "",
                            errInfo: "仓库编号不能为空"
                        }
                    ]
                });
            },
            editStorehouse: function () {
                if (!$that.editStorehouseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                vc.http.apiPost(
                    '/resourceStore.updateStorehouse',
                    JSON.stringify($that.editStorehouseInfo), {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editStorehouseModel').modal('hide');
                            vc.emit('storehouseManage', 'listStorehouse', {});
                            vc.toast("修改成功");
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
            refreshEditStorehouseInfo: function () {
                $that.editStorehouseInfo = {
                    shId: '',
                    shName: '',
                    shType: '',
                    shDesc: '',
                    isShow: '',
                    purchaseSwitch: '',
                    purchaseRafId: '',
                    useSwitch: '',
                    useRafId: '',
                    allocationSwitch: '',
                    allocationRafId: '',
                    allowPurchase: 'ON',
                    allowUse: 'ON',
                    flows: []
                }
            },
            _listEditResourceAuditFlows: function (_page, _rows) {
                let param = {
                    params: {
                        page: 1,
                        row: 100,
                        communityId: vc.getCurrentCommunity().communityId,
                    }
                };
                //发送get请求
                vc.http.apiGet('/resourceStore.listResourceAuditFlow',
                    param,
                    function (json, res) {
                        let _json = JSON.parse(json);
                        $that.editStorehouseInfo.flows = _json.data;
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },
        }
    });
})(window.vc, window.$that);