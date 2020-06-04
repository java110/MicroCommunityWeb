(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addLocationInfo:{
                locationId:'',
                locationName:'',
locationType:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addLocation','openAddLocationModal',function(){
                $('#addLocationModel').modal('show');
            });
        },
        methods:{
            addLocationValidate(){
                return vc.validate.validate({
                    addLocationInfo:vc.component.addLocationInfo
                },{
                    'addLocationInfo.locationName':[
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
'addLocationInfo.locationType':[
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




                });
            },
            saveLocationInfo:function(){
                if(!vc.component.addLocationValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addLocationInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addLocationInfo);
                    $('#addLocationModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    'location.saveLocation',
                    JSON.stringify(vc.component.addLocationInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        if(res.status == 200){
                            //关闭model
                            $('#addLocationModel').modal('hide');
                            vc.component.clearAddLocationInfo();
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
            clearAddLocationInfo:function(){
                vc.component.addLocationInfo = {
                                            locationName:'',
locationType:'',

                                        };
            }
        }
    });

})(window.vc);
