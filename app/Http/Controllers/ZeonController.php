<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;

class ZeonController
{
    public function zeonUpdatePrice($sku)
    {
        $sku = str_replace('ONR', 'CKY', $sku);
        $request = request();
        $jsonFilePath = storage_path('app/zeon_prices.json');
        $products = json_decode(file_get_contents($jsonFilePath), true);
        $products[$sku] = $request->price;
        $file = file_put_contents($jsonFilePath, json_encode($products));
        return response()->json([
            "message" => "Ürün başarıyla güncellendi.",
        ]);
    }

    public function activeProducts(): \Illuminate\Http\JsonResponse
    {
        $categories = Category::all();
        if (isset($_GET["all"])) {
            $zeonAll = $_GET["all"] == "hepsi";
        } else {
            $zeonAll = false;
        }
        $default_image = url("/uploads/images/zeon.png");
        $products = Product::getZeonActiveProducts($zeonAll);
        return response()->json([
            "products" => $products,
            "categories" => $categories,
            "message" => "Ürünler başarıyla getirildi.",
            "default_image" => $default_image,
        ]);
    }

    public function zeonActiveProducts(): \Illuminate\Http\JsonResponse
    {
        $products = explode(",", request()->input("products"));
        Product::zeonActiveProducts($products);
        return response()->json([
            "message" => "Ürünler başarıyla aktif edildi.",
        ]);
    }

    public function zeonDeActiveProducts(): \Illuminate\Http\JsonResponse
    {
        $products = explode(",", request()->input("products"));
        Product::zeonDeActiveProducts($products);
        return response()->json([
            "message" => "Ürünler başarıyla pasif edildi.",
        ]);
    }
}
