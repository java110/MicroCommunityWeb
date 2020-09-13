(function(vc){
    vc.extends({
        propTypes: {
           emitChooseFeeFormula:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseFeeFormulaInfo:{
                feeFormulas:[],
                _currentFeeFormulaName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseFeeFormula','openChooseFeeFormulaModel',function(_param){
                $('#chooseFeeFormulaModel').modal('show');
                vc.component._refreshChooseFeeFormulaInfo();
                vc.component._loadAllFeeFormulaInfo(1,10,'');
            });
        },
        methods:{
            _loadAllFeeFormulaInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('feeFormula.listFeeFormulas',
                             param,
                             function(json){
                                var _feeFormulaInfo = JSON.parse(json);
                                vc.component.chooseFeeFormulaInfo.feeFormulas = _feeFormulaInfo.feeFormulas;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseFeeFormula:function(_feeFormula){
                if(_feeFormula.hasOwnProperty('name')){
                     _feeFormula.feeFormulaName = _feeFormula.name;
                }
                vc.emit($props.emitChooseFeeFormula,'chooseFeeFormula',_feeFormula);
                vc.emit($props.emitLoadData,'listFeeFormulaData',{
                    feeFormulaId:_feeFormula.feeFormulaId
                });
                $('#chooseFeeFormulaModel').modal('hide');
            },
            queryFeeFormulas:function(){
                vc.component._loadAllFeeFormulaInfo(1,10,vc.component.chooseFeeFormulaInfo._currentFeeFormulaName);
            },
            _refreshChooseFeeFormulaInfo:function(){
                vc.component.chooseFeeFormulaInfo._currentFeeFormulaName = "";
            }
        }

    });
})(window.vc);
