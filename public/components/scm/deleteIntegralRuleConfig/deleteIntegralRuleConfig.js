(function(vc,vm){

    vc.extends({
        data:{
            deleteIntegralRuleConfigInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteIntegralRuleConfig','openDeleteIntegralRuleConfigModal',function(_params){

                vc.component.deleteIntegralRuleConfigInfo = _params;
                $('#deleteIntegralRuleConfigModel').modal('show');

            });
        },
        methods:{
            deleteIntegralRuleConfig:function(){
                vc.component.deleteIntegralRuleConfigInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/integral.deleteIntegralRuleConfig',
                    JSON.stringify(vc.component.deleteIntegralRuleConfigInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteIntegralRuleConfigModel').modal('hide');
                            vc.emit('integralRuleConfigManage', 'listIntegralRuleConfig', {});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteIntegralRuleConfigModel:function(){
                $('#deleteIntegralRuleConfigModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
