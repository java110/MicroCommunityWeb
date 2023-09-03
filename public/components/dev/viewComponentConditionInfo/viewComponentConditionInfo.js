/**
    报表组件条件 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewComponentConditionInfo:{
                index:0,
                flowComponent:'viewComponentConditionInfo',
                componentId:'',
name:'',
holdpace:'',
param:'',
type:'',
remark:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadComponentConditionInfoData();
        },
        _initEvent:function(){
            vc.on('viewComponentConditionInfo','chooseComponentCondition',function(_app){
                vc.copyObject(_app, vc.component.viewComponentConditionInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewComponentConditionInfo);
            });

            vc.on('viewComponentConditionInfo', 'onIndex', function(_index){
                vc.component.viewComponentConditionInfo.index = _index;
            });

        },
        methods:{

            _openSelectComponentConditionInfoModel(){
                vc.emit('chooseComponentCondition','openChooseComponentConditionModel',{});
            },
            _openAddComponentConditionInfoModel(){
                vc.emit('addComponentCondition','openAddComponentConditionModal',{});
            },
            _loadComponentConditionInfoData:function(){

            }
        }
    });

})(window.vc);
