/**
    抄表类型 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewMeterTypeInfo:{
                index:0,
                flowComponent:'viewMeterTypeInfo',
                typeName:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadMeterTypeInfoData();
        },
        _initEvent:function(){
            vc.on('viewMeterTypeInfo','chooseMeterType',function(_app){
                vc.copyObject(_app, vc.component.viewMeterTypeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewMeterTypeInfo);
            });

            vc.on('viewMeterTypeInfo', 'onIndex', function(_index){
                vc.component.viewMeterTypeInfo.index = _index;
            });

        },
        methods:{

            _openSelectMeterTypeInfoModel(){
                vc.emit('chooseMeterType','openChooseMeterTypeModel',{});
            },
            _openAddMeterTypeInfoModel(){
                vc.emit('addMeterType','openAddMeterTypeModal',{});
            },
            _loadMeterTypeInfoData:function(){

            }
        }
    });

})(window.vc);
