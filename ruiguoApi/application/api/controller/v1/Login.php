<?php
/**
 * Note: Banner 图片的编辑
 * User: Laowu
 * Date: 2020/3/4
 * Time: 21:11
 */
namespace app\api\controller\v1;

use think\Db;
use http\Http;
use think\Cookie;
use think\Request;
use think\Controller;
use think\captcha\Captcha;
use app\admin\model\StoreUser;

class Login
{
    /**
     * Note: 获取指定ID 的banner信息
     * @url /banner/id
     * @http GET
     * @id banner的ID号
     */
    public function index($id)
    {
        echo '46465464';
    }




}
