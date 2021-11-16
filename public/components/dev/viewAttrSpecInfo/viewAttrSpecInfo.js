/**
    属性配置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewAttrSpecInfo:{
                index:0,
                flowComponent:'viewAttrSpecInfo',
                tableName:'',
specName:'',
specHoldplace:'',
required:'',
specShow:'',
specValueType:'',
specType:'',
listShow:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadAttrSpecInfoData();
        },
        _initEvent:function(){
            vc.on('viewAttrSpecInfo','chooseAttrSpec',function(_app){
                vc.copyObject(_app, vc.component.viewAttrSpecInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewAttrSpecInfo);
            });

            vc.on('viewAttrSpecInfo', 'onIndex', function(_index){
                vc.component.viewAttrSpecInfo.index = _index;
            });

        },
        methods:{

            _openSelectAttrSpecInfoModel(){
                vc.emit('chooseAttrSpec','openChooseAttrSpecModel',{});
            },
            _openAddAttrSpecInfoModel(){
                vc.emit('addAttrSpec','openAddAttrSpecModal',{});
            },
            _loadAttrSpecInfoData:function(){

            }
        }
    });

})(window.vc);
