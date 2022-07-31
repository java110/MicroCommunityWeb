(function(vc){
    vc.extends({
        propTypes: {
           emitChooseContractType:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseContractTypeInfo:{
                contractTypes:[],
                _currentContractTypeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseContractType','openChooseContractTypeModel',function(_param){
                $('#chooseContractTypeModel').modal('show');
                vc.component._refreshChooseContractTypeInfo();
                vc.component._loadAllContractTypeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllContractTypeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('contractType.listContractTypes',
                             param,
                             function(json){
                                var _contractTypeInfo = JSON.parse(json);
                                vc.component.chooseContractTypeInfo.contractTypes = _contractTypeInfo.contractTypes;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseContractType:function(_contractType){
                if(_contractType.hasOwnProperty('name')){
                     _contractType.contractTypeName = _contractType.name;
                }
                vc.emit($props.emitChooseContractType,'chooseContractType',_contractType);
                vc.emit($props.emitLoadData,'listContractTypeData',{
                    contractTypeId:_contractType.contractTypeId
                });
                $('#chooseContractTypeModel').modal('hide');
            },
            queryContractTypes:function(){
                vc.component._loadAllContractTypeInfo(1,10,vc.component.chooseContractTypeInfo._currentContractTypeName);
            },
            _refreshChooseContractTypeInfo:function(){
                vc.component.chooseContractTypeInfo._currentContractTypeName = "";
            }
        }

    });
})(window.vc);
