(function(vc,vm){

    vc.extends({
        data:{
            deleteContractPartyaInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteContractPartya','openDeleteContractPartyaModal',function(_params){

                vc.component.deleteContractPartyaInfo = _params;
                $('#deleteContractPartyaModel').modal('show');

            });
        },
        methods:{
            deleteContractPartya:function(){
                vc.component.deleteContractPartyaInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/contractPartya/deleteContractPartya',
                    JSON.stringify(vc.component.deleteContractPartyaInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteContractPartyaModel').modal('hide');
                            vc.emit('contractPartyaManage','listContractPartya',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteContractPartyaModel:function(){
                $('#deleteContractPartyaModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
