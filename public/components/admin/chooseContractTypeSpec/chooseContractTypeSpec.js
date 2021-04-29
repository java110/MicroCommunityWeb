(function(vc){
    vc.extends({
        propTypes: {
           emitChooseContractTypeSpec:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseContractTypeSpecInfo:{
                contractTypeSpecs:[],
                _currentContractTypeSpecName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseContractTypeSpec','openChooseContractTypeSpecModel',function(_param){
                $('#chooseContractTypeSpecModel').modal('show');
                vc.component._refreshChooseContractTypeSpecInfo();
                vc.component._loadAllContractTypeSpecInfo(1,10,'');
            });
        },
        methods:{
            _loadAllContractTypeSpecInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('contractTypeSpec.listContractTypeSpecs',
                             param,
                             function(json){
                                var _contractTypeSpecInfo = JSON.parse(json);
                                vc.component.chooseContractTypeSpecInfo.contractTypeSpecs = _contractTypeSpecInfo.contractTypeSpecs;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseContractTypeSpec:function(_contractTypeSpec){
                if(_contractTypeSpec.hasOwnProperty('name')){
                     _contractTypeSpec.contractTypeSpecName = _contractTypeSpec.name;
                }
                vc.emit($props.emitChooseContractTypeSpec,'chooseContractTypeSpec',_contractTypeSpec);
                vc.emit($props.emitLoadData,'listContractTypeSpecData',{
                    contractTypeSpecId:_contractTypeSpec.contractTypeSpecId
                });
                $('#chooseContractTypeSpecModel').modal('hide');
            },
            queryContractTypeSpecs:function(){
                vc.component._loadAllContractTypeSpecInfo(1,10,vc.component.chooseContractTypeSpecInfo._currentContractTypeSpecName);
            },
            _refreshChooseContractTypeSpecInfo:function(){
                vc.component.chooseContractTypeSpecInfo._currentContractTypeSpecName = "";
            }
        }

    });
})(window.vc);
