(function(vc,vm){

    vc.extends({
        data:{
            deleteIntegralConfigInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteIntegralConfig','openDeleteIntegralConfigModal',function(_params){

                vc.component.deleteIntegralConfigInfo = _params;
                $('#deleteIntegralConfigModel').modal('show');

            });
        },
        methods:{
            deleteIntegralConfig:function(){
                vc.component.deleteIntegralConfigInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/integral.deleteIntegralConfig',
                    JSON.stringify(vc.component.deleteIntegralConfigInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteIntegralConfigModel').modal('hide');
                            vc.emit('integralConfigManage','listIntegralConfig',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteIntegralConfigModel:function(){
                $('#deleteIntegralConfigModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
