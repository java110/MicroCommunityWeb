(function(vc){

    vc.extends({
        propTypes: {
               callBackListener:vc.propTypes.string, //父组件名称
               callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            addConvenienceMenusInfo:{
                convenienceMenusId:'',
                name:'',
icon:'',
url:'',
seq:'',
remark:'',

            }
        },
         _initMethod:function(){

         },
         _initEvent:function(){
            vc.on('addConvenienceMenus','openAddConvenienceMenusModal',function(){
                $('#addConvenienceMenusModel').modal('show');
            });
        },
        methods:{
            addConvenienceMenusValidate(){
                return vc.validate.validate({
                    addConvenienceMenusInfo:vc.component.addConvenienceMenusInfo
                },{
                    'addConvenienceMenusInfo.name':[
{
                            limit:"required",
                            param:"",
                            errInfo:"菜单名称不能为空"
                        },
 {
                            limit:"maxLength",
                            param:"50",
                            errInfo:"菜单名称太长"
                        },
                    ],
'addConvenienceMenusInfo.icon':[
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"图片地址太长"
                        },
                    ],
'addConvenienceMenusInfo.url':[
 {
                            limit:"maxLength",
                            param:"100",
                            errInfo:"页面路径太长"
                        },
                    ],
'addConvenienceMenusInfo.seq':[
{
                            limit:"required",
                            param:"",
                            errInfo:"显示序号不能为空"
                        },
 {
                            limit:"num",
                            param:"",
                            errInfo:"显示序号不是有效数字"
                        },
                    ],
'addConvenienceMenusInfo.remark':[
 {
                            limit:"maxLength",
                            param:"200",
                            errInfo:"备注太长"
                        },
                    ],




                });
            },
            saveConvenienceMenusInfo:function(){
                if(!vc.component.addConvenienceMenusValidate()){
                    vc.toast(vc.validate.errInfo);

                    return ;
                }

                vc.component.addConvenienceMenusInfo.communityId = vc.getCurrentCommunity().communityId;
                //不提交数据将数据 回调给侦听处理
                if(vc.notNull($props.callBackListener)){
                    vc.emit($props.callBackListener,$props.callBackFunction,vc.component.addConvenienceMenusInfo);
                    $('#addConvenienceMenusModel').modal('hide');
                    return ;
                }

                vc.http.apiPost(
                    '/convenienceMenus/saveConvenienceMenus',
                    JSON.stringify(vc.component.addConvenienceMenusInfo),
                    {
                        emulateJSON:true
                     },
                     function(json,res){
                        //vm.menus = vm.refreshMenuActive(JSON.parse(json),0);
                        let _json = JSON.parse(json);
                        if (_json.code == 0) {
                            //关闭model
                            $('#addConvenienceMenusModel').modal('hide');
                            vc.component.clearAddConvenienceMenusInfo();
                            vc.emit('convenienceMenusManage','listConvenienceMenus',{});

                            return ;
                        }
                        vc.message(_json.msg);

                     },
                     function(errInfo,error){
                        console.log('请求失败处理');

                        vc.message(errInfo);

                     });
            },
            clearAddConvenienceMenusInfo:function(){
                vc.component.addConvenienceMenusInfo = {
                                            name:'',
icon:'',
url:'',
seq:'',
remark:'',

                                        };
            }
        }
    });

})(window.vc);
