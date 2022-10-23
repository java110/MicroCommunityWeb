/**
    营销配置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMarketSmsInfo:{
                index:0,
                flowComponent:'viewMarketSmsInfo',
                smsName:'',
smsType:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMarketSmsInfoData();
        },
        _initEvent:function(){
            vc.on('viewMarketSmsInfo','chooseMarketSms',function(_app){
                vc.copyObject(_app, vc.component.viewMarketSmsInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMarketSmsInfo);
            });

            vc.on('viewMarketSmsInfo', 'onIndex', function(_index){
                vc.component.viewMarketSmsInfo.index = _index;
            });

        },
        methods:{

            _openSelectMarketSmsInfoModel(){
                vc.emit('chooseMarketSms','openChooseMarketSmsModel',{});
            },
            _openAddMarketSmsInfoModel(){
                vc.emit('addMarketSms','openAddMarketSmsModal',{});
            },
            _loadMarketSmsInfoData:function(){

            }
        }
    });

})(window.vc);
