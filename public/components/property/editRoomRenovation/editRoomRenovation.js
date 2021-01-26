(function(vc,vm){

    vc.extends({
        data:{
            editRoomRenovationInfo:{
                rId:'',
roomName:'',
personName:'',
personTel:'',
startTime:'',
endTime:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editRoomRenovation','openEditRoomRenovationModal',function(_params){
                vc.component.refreshEditRoomRenovationInfo();
                $('#editRoomRenovationModel').modal('show');
                vc.copyObject(_params, vc.component.editRoomRenovationInfo );
                vc.component.editRoomRenovationInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editRoomRenovationValidate:function(){
                        return vc.validate.validate({
                            editRoomRenovationInfo:vc.component.editRoomRenovationInfo
                        },{
                            'editRoomRenovationInfo.roomName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"房屋不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"房屋格式错误"
                        },
                    ],
'editRoomRenovationInfo.personName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"联系人不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"64",
                            errInfo:"联系人格式错误"
                        },
                    ],
'editRoomRenovationInfo.personTel':[
{
                            limit:"required",
                            param:"",
                            errInfo:"联系电话不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"联系电话错误"
                        },
                    ],
'editRoomRenovationInfo.startTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"装修时间不能为空"
                        },
 {
                            limit:"date",
                            param:"",
                            errInfo:"装修时间错误"
                        },
                    ],
'editRoomRenovationInfo.endTime':[
{
                            limit:"required",
                            param:"",
                            errInfo:"结束时间不能为空"
                        },
 {
                            limit:"date",
                            param:"",
                            errInfo:"结束时间错误"
                        },
                    ],
'editRoomRenovationInfo.remark':[
 {
                            limit:"maxLength",
                            param:"512",
                            errInfo:"备注太长"
                        },
                    ],
'editRoomRenovationInfo.rId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"装修ID不能为空"
                        }]

                        });
             },
            editRoomRenovation:function(){
                if(!vc.component.editRoomRenovationValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'roomRenovation.updateRoomRenovation',
                    JSON.stringify(vc.component.editRoomRenovationInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#editRoomRenovationModel').modal('hide');
                             vc.emit('roomRenovationManage','listRoomRenovation',{});
                            return ;
                        }
                        vc.message(_json.msg);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditRoomRenovationInfo:function(){
                vc.component.editRoomRenovationInfo= {
                  rId:'',
roomName:'',
personName:'',
personTel:'',
startTime:'',
endTime:'',
remark:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
