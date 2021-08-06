(function(vc,vm){

    vc.extends({
        data:{
            deleteReportInfoSettingInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteReportInfoSetting','opendeleteReportInfoSettingModal',function(_params){

                vc.component.deleteReportInfoSettingInfo = _params;
                $('#deleteReportInfoSettingModel').modal('show');

            });
        },
        methods:{
            deleteReportInfoSetting:function(){
                vc.component.deleteReportInfoSettingInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    '/reportInfoSetting/deleteReportInfoSetting',
                    JSON.stringify(vc.component.deleteReportInfoSettingInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteReportInfoSettingModel').modal('hide');
                            vc.emit('reportInfoSettingManage','listReportInfoSetting',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteReportInfoSettingModel:function(){
                $('#deleteReportInfoSettingModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
