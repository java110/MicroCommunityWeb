/**
    费用套餐 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewFeeComboInfo:{
                index:0,
                flowComponent:'viewFeeComboInfo',
                comboName:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadFeeComboInfoData();
        },
        _initEvent:function(){
            vc.on('viewFeeComboInfo','chooseFeeCombo',function(_app){
                vc.copyObject(_app, vc.component.viewFeeComboInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewFeeComboInfo);
            });

            vc.on('viewFeeComboInfo', 'onIndex', function(_index){
                vc.component.viewFeeComboInfo.index = _index;
            });

        },
        methods:{

            _openSelectFeeComboInfoModel(){
                vc.emit('chooseFeeCombo','openChooseFeeComboModel',{});
            },
            _openAddFeeComboInfoModel(){
                vc.emit('addFeeCombo','openAddFeeComboModal',{});
            },
            _loadFeeComboInfoData:function(){

            }
        }
    });

})(window.vc);
