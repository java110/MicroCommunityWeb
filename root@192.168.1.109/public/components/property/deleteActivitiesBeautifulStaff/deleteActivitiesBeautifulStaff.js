(function(vc,vm){

    vc.extends({
        data:{
            deleteActivitiesBeautifulStaffInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteActivitiesBeautifulStaff','openDeleteActivitiesBeautifulStaffModal',function(_params){

                vc.component.deleteActivitiesBeautifulStaffInfo = _params;
                $('#deleteActivitiesBeautifulStaffModel').modal('show');

            });
        },
        methods:{
            deleteActivitiesBeautifulStaff:function(){
                vc.component.deleteActivitiesBeautifulStaffInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'activitiesBeautifulStaff.deleteActivitiesBeautifulStaff',
                    JSON.stringify(vc.component.deleteActivitiesBeautifulStaffInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteActivitiesBeautifulStaffModel').modal('hide');
                            vc.emit('activitiesBeautifulStaffManage','listActivitiesBeautifulStaff',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.message(json);

                     });
            },
            closeDeleteActivitiesBeautifulStaffModel:function(){
                $('#deleteActivitiesBeautifulStaffModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
