/**
    属性值 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewAttrValueInfo:{
                index:0,
                flowComponent:'viewAttrValueInfo',
                value:'',
valueName:'',
valueShow:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadAttrValueInfoData();
        },
        _initEvent:function(){
            vc.on('viewAttrValueInfo','chooseAttrValue',function(_app){
                vc.copyObject(_app, vc.component.viewAttrValueInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewAttrValueInfo);
            });

            vc.on('viewAttrValueInfo', 'onIndex', function(_index){
                vc.component.viewAttrValueInfo.index = _index;
            });

        },
        methods:{

            _openSelectAttrValueInfoModel(){
                vc.emit('chooseAttrValue','openChooseAttrValueModel',{});
            },
            _openAddAttrValueInfoModel(){
                vc.emit('addAttrValue','openAddAttrValueModal',{});
            },
            _loadAttrValueInfoData:function(){

            }
        }
    });

})(window.vc);
