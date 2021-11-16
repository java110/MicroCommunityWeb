/**
    入驻小区
**/
(function(vc){
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data:{
            shopRangeManageInfo:{
                shopRanges:[],
                total:0,
                records:1,
                moreCondition:false,
                rangeName:'',
                shopTypes:[],
                conditions:{
                    rangeName:'',
                    isShow:'',
                    isDefault:'',

                }
            }
        },
        _initMethod:function(){
            vc.component._listShopRanges(DEFAULT_PAGE, DEFAULT_ROWS);
        },
        _initEvent:function(){
            vc.on('shopRangeManage','listShopRange',function(_param){
                  vc.component._listShopRanges(DEFAULT_PAGE, DEFAULT_ROWS);
            });
             vc.on('pagination','page_event',function(_currentPage){
                vc.component._listShopRanges(_currentPage,DEFAULT_ROWS);
            });
            vc.component._listShopTypes(1,50);
        },
        methods:{
            _listShopTypes:function(_page, _rows){
                var param = {
                    params:{
                        page : _page,
                        row : _rows,
                    }
               };

               //发送get请求
               vc.http.apiGet('/shopType/queryShopType',
                             param,
                             function(json,res){
                                var _shopTypeManageInfo=JSON.parse(json);
                                vc.component.shopRangeManageInfo.shopTypes = _shopTypeManageInfo.data;
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _listShopRanges:function(_page, _rows){

                vc.component.shopRangeManageInfo.conditions.page = _page;
                vc.component.shopRangeManageInfo.conditions.row = _rows;
                var param = {
                    params:vc.component.shopRangeManageInfo.conditions
               };

               //发送get请求
               vc.http.apiGet('/shopRange/queryShopRange',
                             param,
                             function(json,res){
                                var _shopRangeManageInfo=JSON.parse(json);
                                vc.component.shopRangeManageInfo.total = _shopRangeManageInfo.total;
                                vc.component.shopRangeManageInfo.records = _shopRangeManageInfo.records;
                                vc.component.shopRangeManageInfo.shopRanges = _shopRangeManageInfo.data;
                                vc.emit('pagination','init',{
                                     total:vc.component.shopRangeManageInfo.records,
                                     currentPage:_page
                                 });
                             },function(errInfo,error){
                                console.log('请求失败处理');
                             }
                           );
            },
            _openAddShopRangeModal:function(){
                vc.emit('addShopRange','openAddShopRangeModal',{});
            },
            _openEditShopRangeModel:function(_shopRange){
                vc.emit('editShopRange','openEditShopRangeModal',_shopRange);
            },
            _openDeleteShopRangeModel:function(_shopRange){
                vc.emit('deleteShopRange','openDeleteShopRangeModal',_shopRange);
            },
            _queryShopRangeMethod:function(){
                vc.component._listShopRanges(DEFAULT_PAGE, DEFAULT_ROWS);

            },
            _moreCondition:function(){
                if(vc.component.shopRangeManageInfo.moreCondition){
                    vc.component.shopRangeManageInfo.moreCondition = false;
                }else{
                    vc.component.shopRangeManageInfo.moreCondition = true;
                }
            }

             
        }
    });
})(window.vc);
