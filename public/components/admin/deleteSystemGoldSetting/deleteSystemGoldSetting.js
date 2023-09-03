(function(vc,vm){

    vc.extends({
        data:{
            deleteSystemGoldSettingInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSystemGoldSetting','openDeleteSystemGoldSettingModal',function(_params){

                vc.component.deleteSystemGoldSettingInfo = _params;
                $('#deleteSystemGoldSettingModel').modal('show');

            });
        },
        methods:{
            deleteSystemGoldSetting:function(){
                vc.component.deleteSystemGoldSettingInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'systemGoldSetting.deleteSystemGoldSetting',
                    JSON.stringify(vc.component.deleteSystemGoldSettingInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteSystemGoldSettingModel').modal('hide');
                            vc.emit('systemGoldSettingManage','listSystemGoldSetting',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteSystemGoldSettingModel:function(){
                $('#deleteSystemGoldSettingModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
