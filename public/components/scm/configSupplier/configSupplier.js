(function (vc) {

    vc.extends({
        data: {
            configSupplierInfo: {
                supplierId: '',
                configs:[]

            }
        },
        _initMethod: function () {
        },
        _initEvent: function () {
            vc.on('configSupplier', 'openConfigModal', function (_param) {
                vc.copyObject(_param,$that.configSupplierInfo);
                $('#configSupplierModel').modal('show');
                $that._loadSupplierConfigs();
            });
        },
        methods: {
            saveConfigSupplierInfo: function () {
               

                vc.http.apiPost(
                    '/supplierType.saveSupplierConfig',
                    JSON.stringify(vc.component.configSupplierInfo),
                    {
                        emulateJSON: true
                    },
                    function (json, res) {
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#configSupplierModel').modal('hide');
                            vc.component.clearConfigtSupplierInfo();
                            return;
                        }
                        vc.toast(_json.msg);
                    },
                    function (errInfo, error) {
                        console.log('请求失败处理');
                        vc.toast(errInfo);
                    });
            },
            clearConfigtSupplierInfo: function () {
                vc.component.configSupplierInfo = {
                    supplierId: '',
                    configs:[]
                };
            },
            _loadSupplierConfigs:function(){
                if(!$that.configSupplierInfo.supplierId){
                    return;
                }
                let _param = {
                    params:{
                        supplierId:$that.configSupplierInfo.supplierId,
                        page:1,
                        row:100
                    }
                }
                 //发送get请求
                 vc.http.apiGet('/supplierType.listSupplierConfig',
                 _param,
                 function (json, res) {
                     let _marketSmsManageInfo = JSON.parse(json);
                     $that.configSupplierInfo.configs = _marketSmsManageInfo.data;
                 }, function (errInfo, error) {
                     console.log('请求失败处理');
                 }
             );
            }
        }
    });

})(window.vc);
