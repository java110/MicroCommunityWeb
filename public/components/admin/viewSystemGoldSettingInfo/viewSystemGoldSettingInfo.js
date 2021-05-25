/**
    金币设置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewSystemGoldSettingInfo:{
                index:0,
                flowComponent:'viewSystemGoldSettingInfo',
                goldName:'',
goldType:'',
buyPrice:'',
usePrice:'',
validity:'',
state:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadSystemGoldSettingInfoData();
        },
        _initEvent:function(){
            vc.on('viewSystemGoldSettingInfo','chooseSystemGoldSetting',function(_app){
                vc.copyObject(_app, vc.component.viewSystemGoldSettingInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewSystemGoldSettingInfo);
            });

            vc.on('viewSystemGoldSettingInfo', 'onIndex', function(_index){
                vc.component.viewSystemGoldSettingInfo.index = _index;
            });

        },
        methods:{

            _openSelectSystemGoldSettingInfoModel(){
                vc.emit('chooseSystemGoldSetting','openChooseSystemGoldSettingModel',{});
            },
            _openAddSystemGoldSettingInfoModel(){
                vc.emit('addSystemGoldSetting','openAddSystemGoldSettingModal',{});
            },
            _loadSystemGoldSettingInfoData:function(){

            }
        }
    });

})(window.vc);
