(function(vc,vm){

    vc.extends({
        data:{
            deletePrestoreFeeInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deletePrestoreFee','openDeletePrestoreFeeModal',function(_params){

                vc.component.deletePrestoreFeeInfo = _params;
                $('#deletePrestoreFeeModel').modal('show');

            });
        },
        methods:{
            deletePrestoreFee:function(){
                vc.component.deletePrestoreFeeInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/prestoreFee/deletePrestoreFee',
                    JSON.stringify(vc.component.deletePrestoreFeeInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deletePrestoreFeeModel').modal('hide');
                            vc.emit('prestoreFeeManage','listPrestoreFee',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeletePrestoreFeeModel:function(){
                $('#deletePrestoreFeeModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
