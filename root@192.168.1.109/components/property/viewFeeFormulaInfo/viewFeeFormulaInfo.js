/**
    公摊公式 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewFeeFormulaInfo:{
                index:0,
                flowComponent:'viewFeeFormulaInfo',
                formulaValue:'',
formulaDesc:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadFeeFormulaInfoData();
        },
        _initEvent:function(){
            vc.on('viewFeeFormulaInfo','chooseFeeFormula',function(_app){
                vc.copyObject(_app, vc.component.viewFeeFormulaInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewFeeFormulaInfo);
            });

            vc.on('viewFeeFormulaInfo', 'onIndex', function(_index){
                vc.component.viewFeeFormulaInfo.index = _index;
            });

        },
        methods:{

            _openSelectFeeFormulaInfoModel(){
                vc.emit('chooseFeeFormula','openChooseFeeFormulaModel',{});
            },
            _openAddFeeFormulaInfoModel(){
                vc.emit('addFeeFormula','openAddFeeFormulaModal',{});
            },
            _loadFeeFormulaInfoData:function(){

            }
        }
    });

})(window.vc);
