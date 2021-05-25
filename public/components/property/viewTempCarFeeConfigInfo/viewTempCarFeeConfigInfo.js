/**
    临时车收费标准 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewTempCarFeeConfigInfo:{
                index:0,
                flowComponent:'viewTempCarFeeConfigInfo',
                feeName:'',
paId:'',
carType:'',
ruleId:'',
startTime:'',
endTime:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadTempCarFeeConfigInfoData();
        },
        _initEvent:function(){
            vc.on('viewTempCarFeeConfigInfo','chooseTempCarFeeConfig',function(_app){
                vc.copyObject(_app, vc.component.viewTempCarFeeConfigInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewTempCarFeeConfigInfo);
            });

            vc.on('viewTempCarFeeConfigInfo', 'onIndex', function(_index){
                vc.component.viewTempCarFeeConfigInfo.index = _index;
            });

        },
        methods:{

            _openSelectTempCarFeeConfigInfoModel(){
                vc.emit('chooseTempCarFeeConfig','openChooseTempCarFeeConfigModel',{});
            },
            _openAddTempCarFeeConfigInfoModel(){
                vc.emit('addTempCarFeeConfig','openAddTempCarFeeConfigModal',{});
            },
            _loadTempCarFeeConfigInfoData:function(){

            }
        }
    });

})(window.vc);
