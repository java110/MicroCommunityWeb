/**
    微信模板 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewWechatSmsTemplateInfo:{
                index:0,
                flowComponent:'viewWechatSmsTemplateInfo',
                templateType:'',
smsTemplateId:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadWechatSmsTemplateInfoData();
        },
        _initEvent:function(){
            vc.on('viewWechatSmsTemplateInfo','chooseWechatSmsTemplate',function(_app){
                vc.copyObject(_app, vc.component.viewWechatSmsTemplateInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewWechatSmsTemplateInfo);
            });

            vc.on('viewWechatSmsTemplateInfo', 'onIndex', function(_index){
                vc.component.viewWechatSmsTemplateInfo.index = _index;
            });

        },
        methods:{

            _openSelectWechatSmsTemplateInfoModel(){
                vc.emit('chooseWechatSmsTemplate','openChooseWechatSmsTemplateModel',{});
            },
            _openAddWechatSmsTemplateInfoModel(){
                vc.emit('addWechatSmsTemplate','openAddWechatSmsTemplateModal',{});
            },
            _loadWechatSmsTemplateInfoData:function(){

            }
        }
    });

})(window.vc);
