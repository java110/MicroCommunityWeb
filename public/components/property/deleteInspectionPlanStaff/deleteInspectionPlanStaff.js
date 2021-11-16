(function(vc,vm){

    vc.extends({
        data:{
            deleteInspectionPlanStaffInfo:{

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('deleteInspectionPlanStaff','openDeleteInspectionPlanStaffModal',function(_params){

                vc.component.deleteInspectionPlanStaffInfo = _params;
                $('#deleteInspectionPlanStaffModel').modal('show');

            });
        },
        methods:{
            deleteInspectionPlanStaff:function(){
                vc.component.deleteInspectionPlanStaffInfo.communityId=vc.getCurrentCommunity().communityId;
                vc.http.apiPost(
                    'inspectionPlanStaff.deleteInspectionPlanStaff',
                    JSON.stringify(vc.component.deleteInspectionPlanStaffInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#deleteInspectionPlanStaffModel').modal('hide');
                            vc.emit('inspectionPlanStaffManage','listInspectionPlanStaff',$that.deleteInspectionPlanStaffInfo);
                        
                            return ;
                        }
                        vc.toast(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');
                        vc.toast(json);

                     });
            },
            closeDeleteInspectionPlanStaffModel:function(){
                $('#deleteInspectionPlanStaffModel').modal('hide');
            }
        }
    });

})(window.vc,window.vc.component);
