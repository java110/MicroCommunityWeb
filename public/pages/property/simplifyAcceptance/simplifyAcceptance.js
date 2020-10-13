/**
 入驻小区
 **/
(function (vc) {
    var DEFAULT_PAGE = 1;
    var DEFAULT_ROWS = 10;
    vc.extends({
        data: {
            simplifyAcceptanceInfo: {
                searchType: '1',
                searchValue: '',
                searchPlaceholder: '请输入房屋编号 楼栋-单元-房屋 如1-1-1',
                ownerPhoto:'',
            }
        },
        _initMethod: function () {

        },
        _initEvent: function () {

        },
        methods: {

            _changeSearchType: function () {
                switch ($that.simplifyAcceptanceInfo.searchType) {
                    case '1':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入房屋编号 楼栋-单元-房屋 如1-1-1';
                        break;
                    case '2':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主名称';
                        break;
                    case '3':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主手机号';
                        break;
                    case '4':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主身份证';
                        break;
                    case '5':
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入业主车牌号';
                        break;
                    default:
                        $that.simplifyAcceptanceInfo.searchPlaceholder = '请输入房屋编号 楼栋-单元-房屋 如1-1-1';
                }
            },
            _doSearch:function(){
                if(!vc.isNotEmpty($that.simplifyAcceptanceInfo.searchValue)){
                    vc.toast('请输入查询条件');
                    return ;
                }

            },
            errorLoadImg:function(){
                vc.component.simplifyAcceptanceInfo.ownerPhoto="/img/noPhoto.jpg";
            },

        }
    });
})(window.vc);
