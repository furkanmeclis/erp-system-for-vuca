<?php

namespace App\Exports;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\Products;

class IdeasoftProductExport implements FromCollection,ShouldAutoSize,WithHeadings
{
    public function collection()
    {
        return Product::where("is_active",1)->get()->map(function($item){
            $is_tl = $item->is_tl == 1 ? "TL":"USD";
            $product = [
                $item->sku,
                $item->name,
                $is_tl,
                "20",
                $item->price,
                "2000",
            ];

            $urls = $item->getImages(true);

            $product = array_merge($product,$urls);
            return $product;
        });
    }

    public function headings(): array
    {
        return [
            "stockCode",
            "label",
            "currencyAbbr",
            "tax",
            "price2",
            "stockAmount",
            "picture",
            "picture1Path",
            "picture2Path",
            "picture3Path",
            "picture4Path",
            "picture5Path",
            "picture6Path",
            "picture7Path",
            "picture8Path",
        ];
    }
}
