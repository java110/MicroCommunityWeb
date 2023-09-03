(function(vc,vm){

    vc.extends({
        data:{
            deleteOwnerSettledApplyInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteOwnerSettledApply','openDeleteOwnerSettledApplyModal',function(_params){

                vc.component.deleteOwnerSettledApplyInfo = _params;
                $('#deleteOwnerSettledApplyModel').modal('show');

            });
        },
        methods:{
            deleteOwnerSettledApply:function(){
                vc.component.deleteOwnerSettledApplyInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'ownerSettledApply.deleteOwnerSettledApply',
                    JSON.stringify(vc.component.deleteOwnerSettledApplyInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteOwnerSettledApplyModel').modal('hide');
                            vc.emit('ownerSettledApplyManage','listOwnerSettledApply',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteOwnerSettledApplyModel:function(){
                $('#deleteOwnerSettledApplyModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
