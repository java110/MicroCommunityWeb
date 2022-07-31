(function(vc,vm){

    vc.extends({
        data:{
            deleteReportCustomComponentRelInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReportCustomComponentRel','openDeleteReportCustomComponentRelModal',function(_params){

                vc.component.deleteReportCustomComponentRelInfo = _params;
                $('#deleteReportCustomComponentRelModel').modal('show');

            });
        },
        methods:{
            deleteReportCustomComponentRel:function(){
                vc.component.deleteReportCustomComponentRelInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'reportCustomComponentRel.deleteReportCustomComponentRel',
                    JSON.stringify(vc.component.deleteReportCustomComponentRelInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportCustomComponentRelModel').modal('hide');
                            vc.emit('reportCustomComponentRelManage','listReportCustomComponentRel',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReportCustomComponentRelModel:function(){
                $('#deleteReportCustomComponentRelModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
