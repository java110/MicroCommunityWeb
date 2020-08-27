(function(vc){
    vc.extends({
        propTypes: {
           emitChooseRentingPool:vc.propTypes.string,
           emitLoadData:vc.propTypes.string
        },
        data:{
            chooseRentingPoolInfo:{
                rentingPools:[],
                _currentRentingPoolName:'',
            }
        },
        _initMethod:function(){
        },
        _initEvent:function(){
            vc.on('chooseRentingPool','openChooseRentingPoolModel',function(_param){
                $('#chooseRentingPoolModel').modal('show');
                vc.component._refreshChooseRentingPoolInfo();
                vc.component._loadAllRentingPoolInfo(1,10,'');
            });
        },
        methods:{
            _loadAllRentingPoolInfo:function(_page,_row,_name){
                var param = {
                    params:{
                        page:_page,
                        row:_row,
                        communityId:vc.getCurrentCommunity().communityId,
                        name:_name
                    }
                };

                //发送get请求
               vc.http.apiGet('rentingPool.listRentingPools',
                             param,
                             function(json){
                                var _rentingPoolInfo = JSON.parse(json);
                                vc.component.chooseRentingPoolInfo.rentingPools = _rentingPoolInfo.rentingPools;
                             },function(){
                                console.log('请求失败处理');
                             }
                           );
            },
            chooseRentingPool:function(_rentingPool){
                if(_rentingPool.hasOwnProperty('name')){
                     _rentingPool.rentingPoolName = _rentingPool.name;
                }
                vc.emit($props.emitChooseRentingPool,'chooseRentingPool',_rentingPool);
                vc.emit($props.emitLoadData,'listRentingPoolData',{
                    rentingPoolId:_rentingPool.rentingPoolId
                });
                $('#chooseRentingPoolModel').modal('hide');
            },
            queryRentingPools:function(){
                vc.component._loadAllRentingPoolInfo(1,10,vc.component.chooseRentingPoolInfo._currentRentingPoolName);
            },
            _refreshChooseRentingPoolInfo:function(){
                vc.component.chooseRentingPoolInfo._currentRentingPoolName = "";
            }
        }

    });
})(window.vc);
