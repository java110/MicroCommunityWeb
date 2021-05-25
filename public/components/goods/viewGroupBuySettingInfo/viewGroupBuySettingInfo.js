/**
    拼团设置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewGroupBuySettingInfo:{
                index:0,
                flowComponent:'viewGroupBuySettingInfo',
                groupBuyName:'',
groupBuyDesc:'',
validHours:'',
startTime:'',
endTime:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadGroupBuySettingInfoData();
        },
        _initEvent:function(){
            vc.on('viewGroupBuySettingInfo','chooseGroupBuySetting',function(_app){
                vc.copyObject(_app, vc.component.viewGroupBuySettingInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewGroupBuySettingInfo);
            });

            vc.on('viewGroupBuySettingInfo', 'onIndex', function(_index){
                vc.component.viewGroupBuySettingInfo.index = _index;
            });

        },
        methods:{

            _openSelectGroupBuySettingInfoModel(){
                vc.emit('chooseGroupBuySetting','openChooseGroupBuySettingModel',{});
            },
            _openAddGroupBuySettingInfoModel(){
                vc.emit('addGroupBuySetting','openAddGroupBuySettingModal',{});
            },
            _loadGroupBuySettingInfoData:function(){

            }
        }
    });

})(window.vc);
