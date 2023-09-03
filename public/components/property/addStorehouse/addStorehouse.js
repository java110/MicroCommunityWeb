(function(vc) {
    vc.extends({
        data: {
            addStorehouseInfo: {
                shId: '',
                shName: '',
                shType: '',
                shDesc: '',
                isShow: 'true',
                purchaseSwitch: '',
                purchaseRafId: '',
                useSwitch: '',
                useRafId: '',
                allocationSwitch: '',
                allocationRafId: '',
                allowPurchase: 'ON',
                allowUse: 'ON',
                allocationRafId: '',
                flows: []
            }
        },
        _initMethod: function() {

        },
        _initEvent: function() {
            vc.on('addStorehouse', 'openAddStorehouseModal', function() {
                $that._listAddResourceAuditFlows();
                $('#addStorehouseModel').modal('show');
            });
        },
        methods: {
            addStorehouseValidate() {
                return vc.validate.validate({
                    addStorehouseInfo: $that.addStorehouseInfo
                }, {
                    'addStorehouseInfo.shName': [{
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
                    'addStorehouseInfo.isShow': [{
                        limit: "required",
                        param: "",
                        errInfo: "对外开放选框不能为空"
                    }],
                    'addStorehouseInfo.shDesc': [{
                        limit: "maxLength",
                        param: "512",
                        errInfo: "描述太长"
                    }, ],
                });
            },
            saveStorehouseInfo: function() {
                if (!$that.addStorehouseValidate()) {
                    vc.toast(vc.validate.errInfo);
                    return;
                }
                $that.addStorehouseInfo.communityId = vc.getCurrentCommunity().communityId;

                vc.http.apiPost(
                    '/resourceStore.saveStorehouse',
                    JSON.stringify($that.addStorehouseInfo), {
                        emulateJSON: true
                    },
                    function(json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addStorehouseModel').modal('hide');
                            $that.clearAddStorehouseInfo();
                            vc.emit('storehouseManage', 'listStorehouse', {});
                            vc.toast("添加成功");
                            return;
                        } else {
                            vc.toast(_json.msg);
                        }
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                        vc.message(errInfo);
                    });
            },
            clearAddStorehouseInfo: function() {
                $that.addStorehouseInfo = {
                    shId: '',
                    shName: '',
                    shType: '',
                    shDesc: '',
                    isShow: 'true',
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
            _listAddResourceAuditFlows: function(_page, _rows) {

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
                    function(json, res) {
                        let _json = JSON.parse(json);
                        $that.addStorehouseInfo.flows = _json.data;
                    },
                    function(errInfo, error) {
                        console.log('请求失败处理');
                    }
                );
            },

        }
    });
})(window.vc);