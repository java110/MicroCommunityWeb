(function(vc){
    vc.extends({
        propTypes: {
           emitChooseContractPartya:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseContractPartyaInfo:{
                contractPartyas:[],
                _currentContractPartyaName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseContractPartya','openChooseContractPartyaModel',function(_param){
                $('#chooseContractPartyaModel').modal('show');
                vc.component._refreshChooseContractPartyaInfo();
                vc.component._loadAllContractPartyaInfo(1,10,'');
            });
        },
        methods:{
            _loadAllContractPartyaInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('contractPartya.listContractPartyas',
                             param,
                             function(json){
                                var _contractPartyaInfo = JSON.parse(json);
                                vc.component.chooseContractPartyaInfo.contractPartyas = _contractPartyaInfo.contractPartyas;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseContractPartya:function(_contractPartya){
                if(_contractPartya.hasOwnProperty('name')){
                     _contractPartya.contractPartyaName = _contractPartya.name;
                }
                vc.emit($props.emitChooseContractPartya,'chooseContractPartya',_contractPartya);
                vc.emit($props.emitLoadData,'listContractPartyaData',{
                    contractPartyaId:_contractPartya.contractPartyaId
                });
                $('#chooseContractPartyaModel').modal('hide');
            },
            queryContractPartyas:function(){
                vc.component._loadAllContractPartyaInfo(1,10,vc.component.chooseContractPartyaInfo._currentContractPartyaName);
            },
            _refreshChooseContractPartyaInfo:function(){
                vc.component.chooseContractPartyaInfo._currentContractPartyaName = "";
            }
        }

    });
})(window.vc);
