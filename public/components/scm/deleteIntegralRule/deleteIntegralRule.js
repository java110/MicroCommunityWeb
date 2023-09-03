(function(vc,vm){

    vc.extends({
        data:{
            deleteIntegralRuleInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteIntegralRule','openDeleteIntegralRuleModal',function(_params){

                vc.component.deleteIntegralRuleInfo = _params;
                $('#deleteIntegralRuleModel').modal('show');

            });
        },
        methods:{
            deleteIntegralRule:function(){
                vc.component.deleteIntegralRuleInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/integral.deleteIntegralRule',
                    JSON.stringify(vc.component.deleteIntegralRuleInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteIntegralRuleModel').modal('hide');
                            vc.emit('integralRuleManage','listIntegralRule',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteIntegralRuleModel:function(){
                $('#deleteIntegralRuleModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
