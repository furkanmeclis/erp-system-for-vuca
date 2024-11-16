<?php

namespace App\Models;

use App\Services\CurrencyService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    public $zeonCache = [
        "activeProducts" => null,
        "prices" => null,
    ];

    public static function getAllProducts(): \Illuminate\Database\Eloquent\Collection
    {
        return Product::where('id', '>', 0)->orderBy('order')->get()->map(function ($product) {
            $product->campaign_price = $product->priceFormatter()->tl;
            $product->price = round($product->price, 2);
            return $product;
        });
    }
    public static function getActiveProducts($images=false): \Illuminate\Database\Eloquent\Collection
    {
        return Product::where('id', '>', 0)->where('is_active',1)->orderBy('order')->get()->map(function ($product) use ($images) {
            $product->campaign_price = $product->priceFormatter()->tl;
            $product->price = round($product->price, 2);
            if($images){
                $product->images = $product->getImages(true);
            }
            return $product;
        });
    }

    public function priceFormatter(): object
    {
        $usd = CurrencyService::getCurrency();
        $price = (str_replace([','], '.', str_replace([' ', 'TL', 'USD'], '', $this->price)));
        $is_tl = boolval($this->is_tl);
        if ($is_tl) {
            return (object)[
                'tl' => round($price, 2),
                'usd' => round($price / $usd, 2),
            ];
        } else {
            return (object)[
                'tl' => round($price * $usd, 2),
                'usd' => round($price, 2),
            ];
        }
    }

    public function getImages($onlyUrls = false): array
    {
        $filesPath = public_path('uploads/images/' . $this->sku);
        $files = [];
        if (is_dir($filesPath)) {
            $files = array_diff(scandir($filesPath), array('.', '..'));
        }
        $media = [];
        foreach ($files as $file) {
            if ($onlyUrls) {
                $media[] = url('uploads/images/' . $this->sku . '/' . $file);
            } else {
                $media[] = [
                    'name' => $file,
                    'url' => url('uploads/images/' . $this->sku . '/' . $file),
                    'deleteUrl' => route('products.deleteImage', ['id' => $this->id, 'name' => $file])
                ];
            }

        }
        return $media;
    }

    public function deleteImage($fileName): bool
    {
        $filePath = public_path('uploads/images/' . $this->sku . '/' . $fileName);
        if (file_exists($filePath)) {
            return unlink($filePath);
        }
        return false;
    }

    public function addImages($files): bool
    {
        $filesPath = public_path('uploads/images/' . $this->sku);
        if (!is_dir($filesPath)) {
            mkdir($filesPath, 0777, true);
        }
        $error = false;
        foreach ($files as $file) {
            if (!$file->move($filesPath, time() . "_" . $file->getClientOriginalName())) {
                $error = true;
            }
        }
        return !$error;
    }

    public function deleteImages(): bool
    {
        $images = $this->getImages();
        $error = false;
        foreach ($images as $image) {
            if (!$this->deleteImage($image['name'])) {
                $error = true;
            }
        }
        $filesPath = public_path('uploads/images/' . $this->sku);
        if (is_dir($filesPath)) {
            rmdir($filesPath);
        }
        return !$error;
    }

    /**
     *
     * ZEON MOTO FUNCTIONS
     *
     */
    public static function getZeonActiveProducts($getAll = false)
    {
        $products = Product::where('id', '>', "0")->orderBy('order')->get();
        $products->map(function ($product) use ($getAll) {
            $product->is_new = $product->is_new == 1;
            $product->is_tl = $product->is_tl == 1;
            $product->is_discount = $product->is_discount == 1;
            $product->is_active = $product->is_active == 1;
            $product->price = $product->priceFormatter()->tl;
            $product->zeon_active = $product->zeonIsActiveProduct($product->sku . "-" . $product->id);
            $product->default_image = url('uploads/images/zeon.png');
            $product->images = $product->getImages(true);
            $price = $product->price;
            if ($price > 0 && $price <= 10) {
                $price = $price * 2;
            } elseif ($price > 10 && $price <= 20) {
                $price = $price * 1.75;
            } elseif ($price > 20 && $price <= 30) {
                $price = $price * 1.5;
            } elseif ($price > 30 && $price <= 50) {
                $price = $price * 1.3;
            } elseif ($price > 50 && $price <= 100) {
                $price = $price * 1.2;
            } elseif ($price > 100) {
                $price = $price * 1.12;
            }
            if ($hasZeonPrice = $product->zeonPriceControl($product->sku)) {
                $product->origin_price = round($price, 2);
                $product->price = round($hasZeonPrice, 2);
            } else {
                $product->price = round($price, 2);
                $product->origin_price = round($price, 2);
            }
            $product->sku = Str::replace('CKY', 'ONR', $product->sku);

            if ($getAll !== true && !$product->zeon_active) {
                return null;
            }
            if ($product->zeon_active || $getAll === true) {
                return $product;
            }
            return null;
        })->filter();
        if($getAll === true){
            return $products;
        }else{
            $returnProducts = [];
            foreach ($products as $product) {
                if($product->zeon_active){
                    $returnProducts[] = $product;
                }
            }
            return $returnProducts;
        }
    }

    public function zeonIsActiveProduct($sku): bool
    {
        if ($this->zeonCache["activeProducts"] == null) {
            $this->zeonCache["activeProducts"] = json_decode(file_get_contents(storage_path('app/zeon_active.json')), true);
        }
        $sku = str_replace("CKY", "ONR", $sku);
        $activeProducts = $this->zeonCache["activeProducts"];
        if (isset($activeProducts[$sku])) {
            if($activeProducts[$sku] == 1){
                return true;
            }elseif($activeProducts[$sku] == 0){
                return false;
            }else{
                return $activeProducts[$sku];
            }
        } else {
            $activeProducts[$sku] = true;
            file_put_contents(storage_path('app/zeon_active.json'), json_encode($activeProducts));
            $this->zeonCache["activeProducts"] = $activeProducts;
            return true;
        }
    }

    public function zeonPriceControl($sku)
    {
        if ($this->zeonCache["prices"] == null) {
            $this->zeonCache["prices"] = json_decode(file_get_contents(storage_path('app/zeon_prices.json')), true);
        }
        $prices = $this->zeonCache["prices"];
        if (isset($prices[$sku])) {
            return $prices[$sku];
        } else {
            return false;
        }
    }

    public static function zeonActiveProducts($keys): bool
    {
        if(is_array($keys)){
            $products = $keys;
        }else{
            $products = [$keys];
        }
        $zeonProducts = json_decode(file_get_contents(storage_path('app/zeon_active.json')), true);
        $saveArray = [];
        foreach ($zeonProducts as $sku => $active) {
            $saveArray[$sku] = $active;
        }
        foreach ($products as $product) {
            $saveArray[$product] = true;
        }
        file_put_contents(storage_path('app/zeon_active.json'), json_encode($saveArray));
        return true;
    }

    public static function zeonDeActiveProducts($keys): bool
    {
        if(!is_array($keys)) {
            $products = [$keys];
        } else {
            $products = $keys;
        }
        $zeonProducts = json_decode(file_get_contents(storage_path('app/zeon_active.json')), true);
        $saveArray = [];
        foreach ($zeonProducts as $sku => $active) {
            $saveArray[$sku] = $active;
        }
        foreach ($products as $product) {
            $saveArray[$product] = false;
        }
        file_put_contents(storage_path('app/zeon_active.json'), json_encode($saveArray));
        return true;
    }
    public static function restoreZeonActiveProducts(): void
    {
        $zeonProducts = json_decode(file_get_contents(storage_path('app/zeon_active.json')), true);
        $allProducts = Product::where('id', '>', 0)->get(['id', 'sku']);
        $purifiedIds = [];
        foreach ($zeonProducts as $sku => $active) {
            $purifiedIds[] = [
                "sku" => str_replace("ONR", "CKY", explode("-", $sku)[0]),
                "active" => $active
            ];
        }
        $saveArray = [];
        foreach ($allProducts as $product) {
            $sku = $product->sku . "-" . $product->id;
            $active = false;
            $transaction = false;
            foreach ($purifiedIds as $purifiedId) {
                if ($purifiedId['sku'] == $sku) {
                    $active = $purifiedId['active'];
                    $transaction = true;
                }
            }
            if (!$transaction) {
                $active = true;
            }
            $saveArray[str_replace("CKY","ONR",$sku)] = $active;
        }
        file_put_contents(storage_path('app/zeon_active.json'), json_encode($saveArray));

    }
}
