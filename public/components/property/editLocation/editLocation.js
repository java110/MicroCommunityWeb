(function(vc,vm){

    vc.extends({
        data:{
            editLocationInfo:{
                locationId:'',
locationName:'',
locationType:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
             vc.on('editLocation','openEditLocationModal',function(_params){
                vc.component.refreshEditLocationInfo();
                $('#editLocationModel').modal('show');
                vc.copyObject(_params, vc.component.editLocationInfo );
                vc.component.editLocationInfo.communityId = vc.getCurrentCommunity().communityId;
            });
        },
        methods:{
            editLocationValidate:function(){
                        return vc.validate.validate({
                            editLocationInfo:vc.component.editLocationInfo
                        },{
                            'editLocationInfo.locationName':[
{
                            limit:"required",
                            param:"",
                            errInfo:"位置名称不能为空"
                        },
 {
                            limit:"max",
                            param:"1,100",
                            errInfo:"位置名称不能超过100位"
                        },
                    ],
'editLocationInfo.locationType':[
{
                            limit:"required",
                            param:"",
                            errInfo:"位置类型不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"位置类型 格式错误"
                        },
                    ],
'editLocationInfo.locationId':[
{
                            limit:"required",
                            param:"",
                            errInfo:"位置ID不能为空"
                        }]

                        });
             },
            editLocation:function(){
                if(!vc.component.editLocationValidate()){
                    vc.toast(vc.validate.errInfo);
                    return ;
                }

                vc.http.apiPost(
                    'location.updateLocation',
                    JSON.stringify(vc.component.editLocationInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#editLocationModel').modal('hide');
                             vc.emit('locationManage','listLocation',{});
                            return ;
                        }
                        vc.message(json);
                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);
                     });
            },
            refreshEditLocationInfo:function(){
                vc.component.editLocationInfo= {
                  locationId:'',
locationName:'',
locationType:'',

                }
            }
        }
    });

})(window.vc,window.vc.component);
