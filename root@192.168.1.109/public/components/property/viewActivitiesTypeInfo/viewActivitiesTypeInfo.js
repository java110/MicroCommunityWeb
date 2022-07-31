/**
    信息大类 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewActivitiesTypeInfo:{
                index:0,
                flowComponent:'viewActivitiesTypeInfo',
                typeName:'',
typeDesc:'',
seq:'',
defalutShow:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadActivitiesTypeInfoData();
        },
        _initEvent:function(){
            vc.on('viewActivitiesTypeInfo','chooseActivitiesType',function(_app){
                vc.copyObject(_app, vc.component.viewActivitiesTypeInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewActivitiesTypeInfo);
            });

            vc.on('viewActivitiesTypeInfo', 'onIndex', function(_index){
                vc.component.viewActivitiesTypeInfo.index = _index;
            });

        },
        methods:{

            _openSelectActivitiesTypeInfoModel(){
                vc.emit('chooseActivitiesType','openChooseActivitiesTypeModel',{});
            },
            _openAddActivitiesTypeInfoModel(){
                vc.emit('addActivitiesType','openAddActivitiesTypeModal',{});
            },
            _loadActivitiesTypeInfoData:function(){

            }
        }
    });

})(window.vc);
