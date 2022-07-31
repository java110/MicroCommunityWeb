/**
    抄表 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMeterWaterInfo:{
                index:0,
                flowComponent:'viewMeterWaterInfo',
                meterType:'',
preDegrees:'',
curDegrees:'',
preReadingTime:'',
curReadingTime:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMeterWaterInfoData();
        },
        _initEvent:function(){
            vc.on('viewMeterWaterInfo','chooseMeterWater',function(_app){
                vc.copyObject(_app, vc.component.viewMeterWaterInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMeterWaterInfo);
            });

            vc.on('viewMeterWaterInfo', 'onIndex', function(_index){
                vc.component.viewMeterWaterInfo.index = _index;
            });

        },
        methods:{

            _openSelectMeterWaterInfoModel(){
                vc.emit('chooseMeterWater','openChooseMeterWaterModel',{});
            },
            _openAddMeterWaterInfoModel(){
                vc.emit('addMeterWater','openAddMeterWaterModal',{});
            },
            _loadMeterWaterInfoData:function(){

            }
        }
    });

})(window.vc);
