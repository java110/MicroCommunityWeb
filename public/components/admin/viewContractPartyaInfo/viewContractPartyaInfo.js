/**
    合同甲方 组件
**/
(function(vc){

    vc.extends({
        propTypes: {
           callBackListener:vc.propTypes.string, //父组件名称
           callBackFunction:vc.propTypes.string //父组件监听方法
        },
        data:{
            viewContractPartyaInfo:{
                index:0,
                flowComponent:'viewContractPartyaInfo',
                partyA:'',
aContacts:'',
aLink:'',

            }
        },
        _initMethod:function(){
            //根据请求参数查询 查询 业主信息
            vc.component._loadContractPartyaInfoData();
        },
        _initEvent:function(){
            vc.on('viewContractPartyaInfo','chooseContractPartya',function(_app){
                vc.copyObject(_app, vc.component.viewContractPartyaInfo);
                vc.emit($props.callBackListener,$props.callBackFunction,vc.component.viewContractPartyaInfo);
            });

            vc.on('viewContractPartyaInfo', 'onIndex', function(_index){
                vc.component.viewContractPartyaInfo.index = _index;
            });

        },
        methods:{

            _openSelectContractPartyaInfoModel(){
                vc.emit('chooseContractPartya','openChooseContractPartyaModel',{});
            },
            _openAddContractPartyaInfoModel(){
                vc.emit('addContractPartya','openAddContractPartyaModal',{});
            },
            _loadContractPartyaInfoData:function(){

            }
        }
    });

})(window.vc);
