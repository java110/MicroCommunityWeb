(function(vc,vm){

    vc.extends({
        data:{
            deleteGroupBuySettingInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteGroupBuySetting','openDeleteGroupBuySettingModal',function(_params){

                vc.component.deleteGroupBuySettingInfo = _params;
                $('#deleteGroupBuySettingModel').modal('show');

            });
        },
        methods:{
            deleteGroupBuySetting:function(){
                vc.component.deleteGroupBuySettingInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'groupBuySetting.deleteGroupBuySetting',
                    JSON.stringify(vc.component.deleteGroupBuySettingInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteGroupBuySettingModel').modal('hide');
                            vc.emit('groupBuySettingManage','listGroupBuySetting',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteGroupBuySettingModel:function(){
                $('#deleteGroupBuySettingModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
