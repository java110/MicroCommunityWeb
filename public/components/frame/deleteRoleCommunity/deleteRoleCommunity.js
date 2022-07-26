(function(vc,vm){

    vc.extends({
        data:{
            deleteRoleCommunityInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteRoleCommunity','openDeleteRoleCommunityModal',function(_params){

                vc.component.deleteRoleCommunityInfo = _params;
                $('#deleteRoleCommunityModel').modal('show');

            });
        },
        methods:{
            deleteRoleCommunity:function(){
                vc.component.deleteRoleCommunityInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/roleCommunity.deleteRoleCommunity',
                    JSON.stringify(vc.component.deleteRoleCommunityInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#deleteRoleCommunityModel').modal('hide');
                            vc.emit('roleCommunityInfo', 'listRoleCommunity',{});
                            return ;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteRoleCommunityModel:function(){
                $('#deleteRoleCommunityModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
