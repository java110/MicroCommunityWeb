(function(vc,vm){

    vc.extends({
        data:{
            deleteScheduleClassesStaffInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteScheduleClassesStaff','openDeleteScheduleClassesStaffModal',function(_params){
                vc.component.deleteScheduleClassesStaffInfo = _params;
                $('#deleteScheduleClassesStaffModel').modal('show');

            });
        },
        methods:{
            deleteScheduleClassesStaff:function(){
                vc.http.apiPost(
                    '/scheduleClasses.deleteScheduleClassesStaff',
                    JSON.stringify(vc.component.deleteScheduleClassesStaffInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#deleteScheduleClassesStaffModel').modal('hide');
                            vc.emit('scheduleClassesStaffManage','listScheduleClassesStaff',{});
                            return ;
                        }
                        vc.toast(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);
                     });
            },
            closeDeleteScheduleClassesStaffModel:function(){
                $('#deleteScheduleClassesStaffModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
