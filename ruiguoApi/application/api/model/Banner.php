<?php

namespace app\api\model;

use think\Db;
use think\Model;
use app\api\model\Banner as BannerModel;

class Banner extends Model
{
    public function items()
    {
        return $this->hasMany('BannerItem', 'banner_id', 'id');
    }
    //

    /**
     * @param $id int banner所在位置
     * @return Banner
     */
//    public static function getBannerById($id)
//    {
//        $banner = self::with(['items','items.img'])
//            ->find($id);
//
////         $banner = BannerModel::relation('items,items.img')
////             ->find($id);
//        return $banner;
//    }

    public static function getBannerById($id)
    {

//        $banner = self::with(['items','items.img'])
//            ->find($id);

        $banner = BannerModel::with('items,items.img')
             ->find($id);
        return $banner;

    }
}
