(function(vc,vm){

    vc.extends({
        data:{
            deleteAttrValueInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteAttrValue','openDeleteAttrValueModal',function(_params){

                vc.component.deleteAttrValueInfo = _params;
                $('#deleteAttrValueModel').modal('show');

            });
        },
        methods:{
            deleteAttrValue:function(){
                vc.component.deleteAttrValueInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/attrValue/deleteAttrValue',
                    JSON.stringify(vc.component.deleteAttrValueInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteAttrValueModel').modal('hide');
                            vc.emit('attrValueManage','listAttrValue',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteAttrValueModel:function(){
                $('#deleteAttrValueModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
