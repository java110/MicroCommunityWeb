(function(vc,vm){

    vc.extends({
        data:{
            deleteSmsConfigInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSmsConfig','openDeleteSmsConfigModal',function(_params){

                vc.component.deleteSmsConfigInfo = _params;
                $('#deleteSmsConfigModel').modal('show');

            });
        },
        methods:{
            deleteSmsConfig:function(){
                vc.component.deleteSmsConfigInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'smsConfig.deleteSmsConfig',
                    JSON.stringify(vc.component.deleteSmsConfigInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteSmsConfigModel').modal('hide');
                            vc.emit('smsConfigManage','listSmsConfig',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteSmsConfigModel:function(){
                $('#deleteSmsConfigModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
