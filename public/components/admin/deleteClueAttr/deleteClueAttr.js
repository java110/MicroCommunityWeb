(function(vc,vm){

    vc.extends({
        data:{
            deleteClueAttrInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteClueAttr','openDeleteClueAttrModal',function(_params){

                vc.component.deleteClueAttrInfo = _params;
                $('#deleteClueAttrModel').modal('show');

            });
        },
        methods:{
            deleteClueAttr:function(){
                vc.component.deleteClueAttrInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/clueAttr/deleteClueAttr',
                    JSON.stringify(vc.component.deleteClueAttrInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteClueAttrModel').modal('hide');
                            vc.emit('clueAttrManage','listClueAttr',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteClueAttrModel:function(){
                $('#deleteClueAttrModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
