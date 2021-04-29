/**
    打印配置 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewFeePrintSpecInfo:{
                index:0,
                flowComponent:'viewFeePrintSpecInfo',
                specCd:'',
content:'',
qrImg:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadFeePrintSpecInfoData();
        },
        _initEvent:function(){
            vc.on('viewFeePrintSpecInfo','chooseFeePrintSpec',function(_app){
                vc.copyObject(_app, vc.component.viewFeePrintSpecInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewFeePrintSpecInfo);
            });

            vc.on('viewFeePrintSpecInfo', 'onIndex', function(_index){
                vc.component.viewFeePrintSpecInfo.index = _index;
            });

        },
        methods:{

            _openSelectFeePrintSpecInfoModel(){
                vc.emit('chooseFeePrintSpec','openChooseFeePrintSpecModel',{});
            },
            _openAddFeePrintSpecInfoModel(){
                vc.emit('addFeePrintSpec','openAddFeePrintSpecModal',{});
            },
            _loadFeePrintSpecInfoData:function(){

            }
        }
    });

})(window.vc);
