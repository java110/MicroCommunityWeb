(function(vc,vm){

    vc.extends({
        data:{
            deleteReportCustomComponentInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReportCustomComponent','openDeleteReportCustomComponentModal',function(_params){

                vc.component.deleteReportCustomComponentInfo = _params;
                $('#deleteReportCustomComponentModel').modal('show');

            });
        },
        methods:{
            deleteReportCustomComponent:function(){
                vc.http.apiPost(
                    '/reportCustomComponent.deleteReportCustomComponent',
                    JSON.stringify(vc.component.deleteReportCustomComponentInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportCustomComponentModel').modal('hide');
                            vc.emit('reportCustomComponentManage','listReportCustomComponent',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReportCustomComponentModel:function(){
                $('#deleteReportCustomComponentModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
