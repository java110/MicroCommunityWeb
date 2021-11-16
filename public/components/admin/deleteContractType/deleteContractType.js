(function(vc,vm){

    vc.extends({
        data:{
            deleteContractTypeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteContractType','openDeleteContractTypeModal',function(_params){

                vc.component.deleteContractTypeInfo = _params;
                $('#deleteContractTypeModel').modal('show');

            });
        },
        methods:{
            deleteContractType:function(){
                vc.component.deleteContractTypeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/contract/deleteContractType',
                    JSON.stringify(vc.component.deleteContractTypeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteContractTypeModel').modal('hide');
                            vc.emit('contractTypeManage','listContractType',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteContractTypeModel:function(){
                $('#deleteContractTypeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
