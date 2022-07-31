(function(vc,vm){

    vc.extends({
        data:{
            deleteTempCarFeeConfigInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteTempCarFeeConfig','openDeleteTempCarFeeConfigModal',function(_params){

                vc.component.deleteTempCarFeeConfigInfo = _params;
                $('#deleteTempCarFeeConfigModel').modal('show');

            });
        },
        methods:{
            deleteTempCarFeeConfig:function(){
                vc.component.deleteTempCarFeeConfigInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'fee.deleteTempCarFeeConfig',
                    JSON.stringify(vc.component.deleteTempCarFeeConfigInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteTempCarFeeConfigModel').modal('hide');
                            vc.emit('tempCarFeeConfigManage','listTempCarFeeConfig',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteTempCarFeeConfigModel:function(){
                $('#deleteTempCarFeeConfigModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
