(function(vc,vm){

    vc.extends({
        data:{
            deleteSysDocumentInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSysDocument','openDeleteSysDocumentModal',function(_params){

                vc.component.deleteSysDocumentInfo = _params;
                $('#deleteSysDocumentModel').modal('show');

            });
        },
        methods:{
            deleteSysDocument:function(){
                vc.component.deleteSysDocumentInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/sysDocument/deleteSysDocument',
                    JSON.stringify(vc.component.deleteSysDocumentInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#deleteSysDocumentModel').modal('hide');
                            vc.emit('sysDocumentManage','listSysDocument',{});
                            return ;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteSysDocumentModel:function(){
                $('#deleteSysDocumentModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
