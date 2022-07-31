(function(vc,vm){

    vc.extends({
        data:{
            deleteFeePrintPageInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteFeePrintPage','openDeleteFeePrintPageModal',function(_params){

                vc.component.deleteFeePrintPageInfo = _params;
                $('#deleteFeePrintPageModel').modal('show');

            });
        },
        methods:{
            deleteFeePrintPage:function(){
                vc.component.deleteFeePrintPageInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'feePrintPage.deleteFeePrintPage',
                    JSON.stringify(vc.component.deleteFeePrintPageInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteFeePrintPageModel').modal('hide');
                            vc.emit('feePrintPageManage','listFeePrintPage',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteFeePrintPageModel:function(){
                $('#deleteFeePrintPageModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
