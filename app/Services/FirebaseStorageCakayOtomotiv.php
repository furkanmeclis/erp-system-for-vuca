<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class FirebaseStorageCakayOtomotiv
{
    public static function getMedia($recordId)
    {
        $url = "https://ckymoto-firebase-old-packages-get.vercel.app/api/package/files?packageId=".$recordId;
        $response = Http::withHeaders([
            "x-guard-code" => "ckymoto"
        ])->get($url);
        if($response->successful()){
            $images = $response->json()["images"];
            $videos = $response->json()["videos"];
            return [
                "images" => $images,
                "videos" => $videos,
            ];
        }else{
            return [
                "images" => [],
                "videos" => [],
            ];
        }
    }
}
