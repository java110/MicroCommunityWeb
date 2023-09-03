(function(vc,vm){

    vc.extends({
        data:{
            deleteChargeRuleFeeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteChargeRuleFee','openDeleteChargeRuleFeeModal',function(_params){
                vc.component.deleteChargeRuleFeeInfo = _params;
                $('#deleteChargeRuleFeeModel').modal('show');

            });
        },
        methods:{
            deleteChargeRuleFee:function(){
                vc.component.deleteChargeRuleFeeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/chargeRule.deleteChargeRuleFee',
                    JSON.stringify(vc.component.deleteChargeRuleFeeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteChargeRuleFeeModel').modal('hide');
                            vc.emit('chargeRuleFee', 'listChargeRuleFee',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteChargeRuleFeeModel:function(){
                $('#deleteChargeRuleFeeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
