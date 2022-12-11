(function(vc,vm){

    vc.extends({
        data:{
            deleteIntegralRuleFeeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteIntegralRuleFee','openDeleteIntegralRuleFeeModal',function(_params){

                vc.component.deleteIntegralRuleFeeInfo = _params;
                $('#deleteIntegralRuleFeeModel').modal('show');

            });
        },
        methods:{
            deleteIntegralRuleFee:function(){
                vc.component.deleteIntegralRuleFeeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/integral.deleteIntegralRuleFee',
                    JSON.stringify(vc.component.deleteIntegralRuleFeeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteIntegralRuleFeeModel').modal('hide');
                            vc.emit('integralRuleFeeManage','listIntegralRuleFee',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteIntegralRuleFeeModel:function(){
                $('#deleteIntegralRuleFeeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
