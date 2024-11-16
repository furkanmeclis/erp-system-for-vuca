<?php

namespace App\Http\Controllers;

use App\Exports\IdeasoftProductExport;
use App\Exports\LogoGo3PriceCardExport;
use App\Models\Category;
use App\Models\Package;
use App\Services\VatanSmsService;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class HomeController
{
    public function index()
    {
        return Inertia::render("Home");
    }

    public function exportIdeasoftExcel(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filename = "ideasoft-" . date("Y-m-d") . ".xls";
        return Excel::download(new IdeasoftProductExport, $filename, \Maatwebsite\Excel\Excel::XLS);
    }

    public function exportLogo(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filename = "go3-" . date("Y-m-d") . ".xls";
        return Excel::download(new LogoGo3PriceCardExport(), $filename, \Maatwebsite\Excel\Excel::XLS);
    }


    public function getSmsCount()
    {
        if (cache()->has("sms_count")) {
            return cache()->get("sms_count");
        } else {
            $sms = VatanSmsService::getUserInfo();
            cache()->put("sms_count", $sms, 60);
            return $sms;
        }
    }

    public function katalog(): \Inertia\Response
    {
        return Inertia::render("Katalog", [
            "defaultImage" => asset("uploads/images/default.png"),
            "categories" => Category::all(["name"]),
            "phoneNumber" => env("CATALOG_PHONE_NUMBER") ?? "905068116868",
            "password" => env("CATALOG_PASSWORD"),
        ]);
    }

    public function importFirestore()
    {
        $path = storage_path("backup.json");
        $data = json_decode(file_get_contents($path), true);
        $packageData = $data["__collections__"]["packages"];
        $insertPackages = [];
        foreach ($packageData as $recordId => $package) {
            $createdAt = $package["created"]["value"]["_seconds"];
            $updatedAt = $package["created"]["value"]["_seconds"];
            $createdAt = \Carbon\Carbon::createFromTimestamp($createdAt);
            $updatedAt = \Carbon\Carbon::createFromTimestamp($updatedAt);
            $is_sms_sent = isset($package["sms"]);
            $status = "";
            if (isset($package["status"])) {
                if ($package["status"] == "new") {
                    if ($createdAt->diffInDays() < 20) {
                        $status = "Beklemede";
                    } else {
                        $status = "Kargolandı";
                    }
                } elseif ($package["status"] == "ready") {
                    $status = "Kargolandı";
                }
            } else {
                $status = "Kargolandı";
            }
            $insertPackages[] = [
                "name" => $package["name"] ?? "Belirsiz",
                "phone" => $package["phone"] ?? "Belirsiz",
                "record_id" => $recordId,
                "record_type" => "firebase",
                "quantity" => intval($package["quantity"] ?? 1),
                "is_sms_sent" => $is_sms_sent,
                "note" => $package["description"] ?? "",
                "officer" => $package["officer"] ?? "Anonim",
                "packer" => $package["packer"] ?? "Anonim",
                "prepared" => $package["prepared"] ?? "Anonim",
                "city" => $package["city"] ?? "Belirsiz",
                "tracking_code" => $package["postCode"] ?? "",
                "district" => "Belirsiz",
                "address" => "Belirsiz",
                "status" => $status,
                "created_at" => $createdAt,
                "updated_at" => $updatedAt,
            ];
        }
        $collection = collect($insertPackages);
        $chunks = $collection->chunk(100);
        foreach ($chunks as $chunk) {
            Package::insert($chunk->toArray());
        }
        return response()->json([
            "status" => true,
            "message" => "Firestore verileri başarıyla aktarıldı.",
        ]);
    }
}
