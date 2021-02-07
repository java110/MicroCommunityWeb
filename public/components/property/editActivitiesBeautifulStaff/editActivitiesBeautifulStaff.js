(function(vc,vm){

    vc.extends({
        data:{
            editActivitiesBeautifulStaffInfo:{
                beId:'',
ruleId:'',
staffId:'',
activitiesNum:'',
workContent:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editActivitiesBeautifulStaff','openEditActivitiesBeautifulStaffModal',function(_params){
                vc.component.refreshEditActivitiesBeautifulStaffInfo();
                $('#editActivitiesBeautifulStaffModel').modal('show');
                vc.copyObject(_params, vc.component.editActivitiesBeautifulStaffInfo );
                vc.component.editActivitiesBeautifulStaffInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editActivitiesBeautifulStaffValidate:function(){
                        return vc.validate.validate({
                            editActivitiesBeautifulStaffInfo:vc.component.editActivitiesBeautifulStaffInfo
                        },{
                            'editActivitiesBeautifulStaffInfo.ruleId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"活动规则不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"活动规则格式错误"
                        },
                    ],
'editActivitiesBeautifulStaffInfo.staffId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"员工不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"128",
                            errInfo:"员工名称太长"
                        },
                    ],
'editActivitiesBeautifulStaffInfo.activitiesNum':[
{
                            limit:"required",
                            param:"",
                            errInfo:"员工编号不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"编号必须为数字"
                        },
                    ],
'editActivitiesBeautifulStaffInfo.workContent':[
{
                            limit:"required",
                            param:"",
                            errInfo:"工作简介不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"1024",
                            errInfo:"工作简介说明太长"
                        },
                    ],
'editActivitiesBeautifulStaffInfo.beId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"ID不能为空"
                        }]

                        });
             },
            editActivitiesBeautifulStaff:function(){
                if(!vc.component.editActivitiesBeautifulStaffValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'activitiesBeautifulStaff.updateActivitiesBeautifulStaff',
                    JSON.stringify(vc.component.editActivitiesBeautifulStaffInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editActivitiesBeautifulStaffModel').modal('hide');
                             vc.emit('activitiesBeautifulStaffManage','listActivitiesBeautifulStaff',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditActivitiesBeautifulStaffInfo:function(){
                vc.component.editActivitiesBeautifulStaffInfo= {
                  beId:'',
ruleId:'',
staffId:'',
activitiesNum:'',
workContent:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
