(function(vc,vm){

    vc.extends({
        data:{
            deleteClueInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteClue','openDeleteClueModal',function(_params){

                vc.component.deleteClueInfo = _params;
                $('#deleteClueModel').modal('show');

            });
        },
        methods:{
            deleteClue:function(){
                vc.component.deleteClueInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/clue/deleteClue',
                    JSON.stringify(vc.component.deleteClueInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteClueModel').modal('hide');
                            vc.emit('clueManage','listClue',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteClueModel:function(){
                $('#deleteClueModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
