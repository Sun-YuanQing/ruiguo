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

class Token
{

    //微信登录
    public function wxlogin()
    {

        $post = input('post.');
        $param['code'] = define_str_replace($post['code']);
        $wxLoginUrl = sprintf(config('wx.login_url'),  config('wx.app_id'), config('wx.app_secret'), $param['code']);
        $result = curl_get($wxLoginUrl);
        $session_key = json_decode($result, true);
        if (!empty($session_key['session_key'])) {


            print_r($post);
            die();
            
            $appid = $param['appid'];
            $encrypteData = urldecode($post['encrypteData']);
            $iv = define_str_replace($post['iv']);
            $errCode = decryptData($appid, $session_key['session_key'], $encrypteData, $iv);

            //把appid写入到数据库中
            $data['appid'] = $errCode['openId'];
            $data['nicheng'] = $errCode['nickName'];
            $data['publishtime'] = time();
            $data['sex'] = $errCode['gender'];
            if (false == $this->user->where(['appid' => $data['appid']])->find()) {
                $this->user->insert($data);
            } else {
                $value = $this->user->where(['appid' => $data['appid']])->field('name,tel,birthday,industry,address')->select();
            }
            $array = array_merge_recursive($errCode, $value);
            return json($array);
        } else {

            returnAjax('101','获取sesson_key失败');
        }

    }
}
