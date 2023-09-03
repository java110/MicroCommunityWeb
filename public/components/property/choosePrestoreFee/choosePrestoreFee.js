(function(vc){
    vc.extends({
        propTypes: {
           emitChoosePrestoreFee:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            choosePrestoreFeeInfo:{
                prestoreFees:[],
                _currentPrestoreFeeName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('choosePrestoreFee','openChoosePrestoreFeeModel',function(_param){
                $('#choosePrestoreFeeModel').modal('show');
                vc.component._refreshChoosePrestoreFeeInfo();
                vc.component._loadAllPrestoreFeeInfo(1,10,'');
            });
        },
        methods:{
            _loadAllPrestoreFeeInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('/prestoreFee/queryPrestoreFee',
                             param,
                             function(json){
                                var _prestoreFeeInfo = JSON.parse(json);
                                vc.component.choosePrestoreFeeInfo.prestoreFees = _prestoreFeeInfo.prestoreFees;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            choosePrestoreFee:function(_prestoreFee){
                if(_prestoreFee.hasOwnProperty('name')){
                     _prestoreFee.prestoreFeeName = _prestoreFee.name;
                }
                vc.emit($props.emitChoosePrestoreFee,'choosePrestoreFee',_prestoreFee);
                vc.emit($props.emitLoadData,'listPrestoreFeeData',{
                    prestoreFeeId:_prestoreFee.prestoreFeeId
                });
                $('#choosePrestoreFeeModel').modal('hide');
            },
            queryPrestoreFees:function(){
                vc.component._loadAllPrestoreFeeInfo(1,10,vc.component.choosePrestoreFeeInfo._currentPrestoreFeeName);
            },
            _refreshChoosePrestoreFeeInfo:function(){
                vc.component.choosePrestoreFeeInfo._currentPrestoreFeeName = "";
            }
        }

    });
})(window.vc);
