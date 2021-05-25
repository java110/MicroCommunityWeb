(function(vc,vm){

    vc.extends({
        data:{
            deleteJunkRequirementInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteJunkRequirement','openDeleteJunkRequirementModal',function(_params){

                vc.component.deleteJunkRequirementInfo = _params;
                $('#deleteJunkRequirementModel').modal('show');

            });
        },
        methods:{
            deleteJunkRequirement:function(){
                vc.component.deleteJunkRequirementInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'junkRequirement.deleteJunkRequirement',
                    JSON.stringify(vc.component.deleteJunkRequirementInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#deleteJunkRequirementModel').modal('hide');
                            vc.emit('junkRequirementManage','listJunkRequirement',{});
                            return ;
                        }
                        vc.message(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteJunkRequirementModel:function(){
                $('#deleteJunkRequirementModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
