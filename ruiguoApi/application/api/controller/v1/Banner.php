<?php
/**
 * Note: Banner 图片的编辑
 * User: Laowu
 * Date: 2020/3/4
 * Time: 21:11
 */
namespace app\api\controller\v1;

use app\api\model\Banner as BannerModel;
use app\api\validate\IDMustBePositiveInt;

class Banner
{
    /**
     * Note: 获取指定ID 的banner信息
     * @url /banner/id
     * @http GET
     * @id banner的ID号
     */
    public function getBanner($id)
    {
//        (new IDMustBePositiveInt())->goCheck();
//        $banner = BannerModel::getBannerById($id);
////        $banner = BannerModel::with('items')->find($id);
//        if (!$banner) {
//            return false;
//        }
//        return json($banner);

        echo '46465464';
    }
}
