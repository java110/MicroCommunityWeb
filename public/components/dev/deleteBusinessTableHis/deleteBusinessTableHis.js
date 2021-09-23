(function(vc,vm){

    vc.extends({
        data:{
            deleteBusinessTableHisInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteBusinessTableHis','openDeleteBusinessTableHisModal',function(_params){

                vc.component.deleteBusinessTableHisInfo = _params;
                $('#deleteBusinessTableHisModel').modal('show');

            });
        },
        methods:{
            deleteBusinessTableHis:function(){
                vc.component.deleteBusinessTableHisInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'businessTableHis.deleteBusinessTableHis',
                    JSON.stringify(vc.component.deleteBusinessTableHisInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteBusinessTableHisModel').modal('hide');
                            vc.emit('businessTableHisManage','listBusinessTableHis',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteBusinessTableHisModel:function(){
                $('#deleteBusinessTableHisModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
