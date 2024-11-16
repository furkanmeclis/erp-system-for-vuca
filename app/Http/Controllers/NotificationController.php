<?php

namespace App\Http\Controllers;

use App\Models\DeviceTokens;

class NotificationController
{
    public function addToken()
    {
        $token = request()->input('token');
        $platform = request()->input('platform');
        $deviceToken = DeviceTokens::where('token', $token)->first();
        if (!$deviceToken) {
            $deviceToken = new DeviceTokens();
            $deviceToken->token = $token;
            $deviceToken->platform = $platform;
            if($deviceToken->save()){
                return response()->json([
                    'status' => true,
                    'message' => "Token Başarıyla Eklendi"
                ]);
            }else{
                return response()->json([
                    'status' => false,
                    'message' => "Token Eklenirken Bir Hata Oluştu"
                ]);
            }
        }
        return response()->json([
            'status' => false,
            'message' => "Token Zaten Kayıtlı",
            "key" => "already_exists"
        ]);
    }
    public function send(): \Illuminate\Http\JsonResponse
    {
        $title = request()->input('title');
        $body = request()->input('content');
        $redirectType = request()->input('redirect_type');
        $file = request()->has("file") ? request()->file("file") : null;
        $url = request()->has("url") ? request()->input("url") : null;
        if ($file !== null) {
            $fileName = time() . "_" . $file->getClientOriginalName();
            $file->move(public_path('uploads/notifications'), $fileName);
            $url = url('uploads/notifications/' . $fileName);
        }
        $tokens = DeviceTokens::all();
        $tokensArray = [];
        foreach ($tokens as $token) {
            $tokensArray[] = $token->token;
        }
        $notification = new \App\Notifications\FirebaseNotification($title, $body, $tokensArray, $url);
        if($notification->sendPushNotification()){
            return response()->json([
                'status' => true,
                'message' => "Bildirimler Başarıyla Gönderildi"
            ]);
        }else{
            return response()->json([
                'status' => true,
                'message' => "Bildirimler Gönderildi Bazı Cihazlara Ulaşılamadı"
            ]);
        }
    }
}
