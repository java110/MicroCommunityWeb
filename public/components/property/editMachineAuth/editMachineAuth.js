(function(vc,vm){

    vc.extends({
        data:{
            editMachineAuthInfo:{
                authId:'',
machineId:'',
personId:'',
startTime:'',
endTime:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editMachineAuth','openEditMachineAuthModal',function(_params){
                vc.component.refreshEditMachineAuthInfo();
                $('#editMachineAuthModel').modal('show');
                vc.copyObject(_params, vc.component.editMachineAuthInfo );
                vc.component.editMachineAuthInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editMachineAuthValidate:function(){
                        return vc.validate.validate({
                            editMachineAuthInfo:vc.component.editMachineAuthInfo
                        },{
                            'editMachineAuthInfo.machineId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"设备不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"设备格式错误"
                        },
                    ],
'editMachineAuthInfo.personId':[
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
'editMachineAuthInfo.startTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"开始时间不能为空"
                        },
 {
                            limit:"datetime",
                            param:"",
                            errInfo:"开始时间格式错误"
                        },
                    ],
'editMachineAuthInfo.endTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"结束时间不能为空"
                        },
 {
                            limit:"datetime",
                            param:"",
                            errInfo:"结束时间格式错误"
                        },
                    ],
'editMachineAuthInfo.authId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"ID不能为空"
                        }]

                        });
             },
            editMachineAuth:function(){
                if(!vc.component.editMachineAuthValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'machineAuth.updateMachineAuth',
                    JSON.stringify(vc.component.editMachineAuthInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editMachineAuthModel').modal('hide');
                             vc.emit('machineAuthManage','listMachineAuth',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditMachineAuthInfo:function(){
                vc.component.editMachineAuthInfo= {
                  authId:'',
machineId:'',
personId:'',
startTime:'',
endTime:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
