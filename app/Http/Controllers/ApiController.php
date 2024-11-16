<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\DeviceTokens;
use App\Models\Groups;
use App\Models\Package;
use App\Models\Product;
use App\Models\SendedMessages;

class ApiController extends Controller
{
    public function getCatalogProducts(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "data" => Product::getActiveProducts(true)
        ]);
    }

    public function getAllProducts(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "data" => Product::getAllProducts(),
        ]);
    }

    public function getStorageInfo(): array
    {
        $path = storage_path();

        $totalSpace = disk_total_space($path);
        $freeSpace = disk_free_space($path);
        $usedSpace = $totalSpace - $freeSpace;

        return [
            'totalSpace' => $this->formatBytes($totalSpace),
            'usedSpace' => $this->formatBytes($usedSpace),
            'freeSpace' => $this->formatBytes($freeSpace),
            "percentageUsed" => round(($usedSpace / $totalSpace) * 100, 2),
            "percentageFree" => round(($freeSpace / $totalSpace) * 100, 2)
        ];
    }

    private function formatBytes($bytes, $decimals = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . ' ' . $units[$factor];
    }

    public function getStatsData(): \Illuminate\Http\JsonResponse
    {
        $space = $this->getStorageInfo();
        $data = [
            "space" => $space,
            "counts" => [
                "customers" => Customer::where("id", ">", 0)->count(),
                "packages" => Package::where("id", ">", 0)->count(),
                "groups" => Groups::where("id", ">", 0)->count(),
                "products" => Product::where("id", ">", 0)->count(),
                "deviceTokens" => DeviceTokens::where("id", ">", 0)->count(),
            ],
            "password" => env("CATALOG_PASSWORD"),
        ];
        return response()->json([
            "status" => true,
            "data" => $data
        ]);
    }

    public function getQueryPageMetrics(): \Illuminate\Http\JsonResponse
    {
        $todayPackageCount = Package::whereDate("created_at", now()->toDateString())->where("status", "Beklemede")->count();
        $todayPackageCountShipped = Package::whereDate("created_at", now()->toDateString())->where("status", "Kargolandı")->count();
        $todayPackageCountPrepared = Package::whereDate("created_at", now()->toDateString())->where("status", "Paketlendi")->count();
        $todaySendedMessagesCount = SendedMessages::whereDate("created_at", now()->toDateString())->count();
        $data = [
            "todayPackageCount" => $todayPackageCount,
            "todayPackageCountShipped" => $todayPackageCountShipped,
            "todayPackageCountPrepared" => $todayPackageCountPrepared,
            "todaySendedMessagesCount" => $todaySendedMessagesCount
        ];
        return response()->json([
            "status" => true,
            "data" => $data
        ]);
    }

    public function getTrackingCodeSetPackages(): \Illuminate\Http\JsonResponse
    {
        $twoDaysAgo = \Carbon\Carbon::now()->subDays(1);

        $packages = Package::where("status", "Paketlendi")
            ->orWhere(function ($query) use ($twoDaysAgo) {
                $query->where("status", "Kargolandı")
                    ->where("updated_at", '>=', $twoDaysAgo);
            })
            ->orderBy("updated_at", "desc")
            ->get();
        return response()->json([
            "status" => true,
            "data" => $packages
        ]);
    }

    public function getNewPackages(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "data" => Package::where("status", "Beklemede")->orderBy('id', 'desc')->get()
        ]);
    }

    public function getCustomers(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "data" => Customer::where("id", ">", "0")->orderBy("id", "desc")->get()
        ]);
    }

    public function getGroups(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            "status" => true,
            "data" => Groups::getAllGroups()
        ]);
    }
}
