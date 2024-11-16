<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class CurrencyService
{
    public static function getCurrency()
    {
        $jsonFilePath = storage_path('app/currency.json');
        $currency = json_decode(File::get($jsonFilePath), true);
        return $currency["USD"];
    }

    public static function updateCurrency($currency): bool
    {
        $jsonFilePath = storage_path('app/currency.json');
        $currencyData = json_decode(File::get($jsonFilePath), true);
        $currencyData["USD"] = $currency;
        return File::put($jsonFilePath, json_encode($currencyData));
    }

}
