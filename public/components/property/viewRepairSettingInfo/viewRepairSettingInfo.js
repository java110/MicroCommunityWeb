/**
    报修设置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewRepairSettingInfo:{
                index:0,
                flowComponent:'viewRepairSettingInfo',
                repairTypeName:'',
repairWay:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadRepairSettingInfoData();
        },
        _initEvent:function(){
            vc.on('viewRepairSettingInfo','chooseRepairSetting',function(_app){
                vc.copyObject(_app, vc.component.viewRepairSettingInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewRepairSettingInfo);
            });

            vc.on('viewRepairSettingInfo', 'onIndex', function(_index){
                vc.component.viewRepairSettingInfo.index = _index;
            });

        },
        methods:{

            _openSelectRepairSettingInfoModel(){
                vc.emit('chooseRepairSetting','openChooseRepairSettingModel',{});
            },
            _openAddRepairSettingInfoModel(){
                vc.emit('addRepairSetting','openAddRepairSettingModal',{});
            },
            _loadRepairSettingInfoData:function(){

            }
        }
    });

})(window.vc);
