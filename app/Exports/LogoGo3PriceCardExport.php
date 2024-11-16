<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use App\Models\Products;

class LogoGo3PriceCardExport implements FromCollection,ShouldAutoSize,WithHeadings,WithTitle
{
    public function collection()
    {
        return Product::where("is_active",1)->get()->map(function($item){
            return [
                $item->sku,
                $item->name,
                $item->sku,
                "",
                "",
                "1",
                $item->price,
                "ADET",
                date("d.m.Y",strtotime("-1 day")),
                date("d.m.Y",strtotime("+1 year")),
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "0",//İŞ YERİ NO
                "1",//KDV DAHİL
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "00:00:00",
                "23:59:59",
                ""
            ];
        });
    }

    public function headings(): array
    {
        return [
            "FİYAT KART KODU",
            "MALZEME AÇIKLAMASI",
            "MALZEME KODU",
            "CH KODU",
            "CH ÖZEL KODU",
            "DÖVİZ KODU",
            "FİYAT",
            "BİRİM KODU",
            "BAŞLANGIÇ TARİHİ",
            "BİTİŞ TARİHİ",
            "GRUP KODU",
            "ÖNCELİK",
            "SIRALAMA",
            "ÖDEME PLANI",
            "GENIUS ÖDEME TİPİ",
            "GENIUS MAĞAZA NO",
            "KOŞUL",
            "TİCARİ İŞLEM GRUBU",
            "YETKİ KODU",
            "İŞYERİ",
            "KDV",
            "VARYANT",
            "CH ÖZEL KODU2",
            "CH ÖZEL KODU3",
            "CH ÖZEL KODU4",
            "CH ÖZEL KODU5",
            "FİYAT KARTI AÇIKLAMASI",
            "TESLİMAT KODU",
            "BAŞLANGIÇ SAATİ",
            "BİTİŞ SAATİ",
            "HAREKET ÖZEL KODU"
        ];
    }

    public function title(): string
    {
        return "Malzeme Fiyat Kartları";
    }
}
