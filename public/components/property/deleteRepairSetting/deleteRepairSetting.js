(function(vc,vm){

    vc.extends({
        data:{
            deleteRepairSettingInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteRepairSetting','openDeleteRepairSettingModal',function(_params){

                vc.component.deleteRepairSettingInfo = _params;
                $('#deleteRepairSettingModel').modal('show');

            });
        },
        methods:{
            deleteRepairSetting:function(){
                vc.component.deleteRepairSettingInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'repair.deleteRepairSetting',
                    JSON.stringify(vc.component.deleteRepairSettingInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#deleteRepairSettingModel').modal('hide');
                            vc.emit('repairSettingManage','listRepairSetting',{});
                            return ;
                        }
                        vc.message(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteRepairSettingModel:function(){
                $('#deleteRepairSettingModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
