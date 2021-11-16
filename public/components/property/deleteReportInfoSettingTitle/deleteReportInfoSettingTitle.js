(function(vc,vm){

    vc.extends({
        data:{
            deleteReportInfoSettingTitleInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReportInfoSettingTitle','openDeleteReportInfoSettingTitleModal',function(_params){

                vc.component.deleteReportInfoSettingTitleInfo = _params;
                $('#deleteReportInfoSettingTitleModel').modal('show');

            });
        },
        methods:{
            deleteReportInfoSettingTitle:function(){
                vc.component.deleteReportInfoSettingTitleInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reportInfoSettingTitle/deleteSettingTitle',
                    JSON.stringify(vc.component.deleteReportInfoSettingTitleInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportInfoSettingTitleModel').modal('hide');
                            vc.emit('reportInfoSettingTitleManage','listReportInfoSettingTitle',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReportInfoSettingTitleModel:function(){
                $('#deleteReportInfoSettingTitleModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
