(function(vc,vm){

    vc.extends({
        data:{
            deleteContractCollectionPlanInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteContractCollectionPlan','openDeleteContractCollectionPlanModal',function(_params){

                vc.component.deleteContractCollectionPlanInfo = _params;
                $('#deleteContractCollectionPlanModel').modal('show');

            });
        },
        methods:{
            deleteContractCollectionPlan:function(){
                vc.component.deleteContractCollectionPlanInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'contractCollectionPlan.deleteContractCollectionPlan',
                    JSON.stringify(vc.component.deleteContractCollectionPlanInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteContractCollectionPlanModel').modal('hide');
                            vc.emit('contractCollectionPlanManage','listContractCollectionPlan',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteContractCollectionPlanModel:function(){
                $('#deleteContractCollectionPlanModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
