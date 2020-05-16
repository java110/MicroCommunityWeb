(function(vc,vm){

    vc.extends({
        data:{
            deleteSmallWeChatInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteSmallWeChat','openDeleteSmallWeChatModal',function(_params){

                vc.component.deleteSmallWeChatInfo = _params;
                $('#deleteSmallWeChatModel').modal('show');

            });
        },
        methods:{
            deleteSmallWeChat:function(){
                vc.component.deleteSmallWeChatInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'smallWeChat.deleteSmallWeChat',
                    JSON.stringify(vc.component.deleteSmallWeChatInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#deleteSmallWeChatModel').modal('hide');
                            vc.emit('smallWeChatManage','listSmallWeChat',{});
                            return ;
                        }
                        vc.message(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteSmallWeChatModel:function(){
                $('#deleteSmallWeChatModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
