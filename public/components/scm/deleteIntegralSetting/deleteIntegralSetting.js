(function(vc,vm){

    vc.extends({
        data:{
            deleteIntegralSettingInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteIntegralSetting','openDeleteIntegralSettingModal',function(_params){

                vc.component.deleteIntegralSettingInfo = _params;
                $('#deleteIntegralSettingModel').modal('show');

            });
        },
        methods:{
            deleteIntegralSetting:function(){
                vc.component.deleteIntegralSettingInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'integralSetting.deleteIntegralSetting',
                    JSON.stringify(vc.component.deleteIntegralSettingInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteIntegralSettingModel').modal('hide');
                            vc.emit('integralSettingManage','listIntegralSetting',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteIntegralSettingModel:function(){
                $('#deleteIntegralSettingModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
