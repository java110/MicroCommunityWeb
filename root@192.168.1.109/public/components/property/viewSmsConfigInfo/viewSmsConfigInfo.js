/**
    短信配置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewSmsConfigInfo:{
                index:0,
                flowComponent:'viewSmsConfigInfo',
                smsType:'',
smsBusi:'',
templateCode:'',
signName:'',
accessSecret:'',
accessKeyId:'',
region:'',
logSwitch:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadSmsConfigInfoData();
        },
        _initEvent:function(){
            vc.on('viewSmsConfigInfo','chooseSmsConfig',function(_app){
                vc.copyObject(_app, vc.component.viewSmsConfigInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewSmsConfigInfo);
            });

            vc.on('viewSmsConfigInfo', 'onIndex', function(_index){
                vc.component.viewSmsConfigInfo.index = _index;
            });

        },
        methods:{

            _openSelectSmsConfigInfoModel(){
                vc.emit('chooseSmsConfig','openChooseSmsConfigModel',{});
            },
            _openAddSmsConfigInfoModel(){
                vc.emit('addSmsConfig','openAddSmsConfigModal',{});
            },
            _loadSmsConfigInfoData:function(){

            }
        }
    });

})(window.vc);
