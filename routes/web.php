<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, "katalog"])->name("home");
Route::get("/katalog", [\App\Http\Controllers\HomeController::class, "katalog"])->name("katalog");
Route::get('/anasayfa', [\App\Http\Controllers\HomeController::class, "index"])->middleware("only:admin,engineer,salesman")->name('dashboard');
Route::get('/import-firestore', [\App\Http\Controllers\HomeController::class, "importFirestore"])->middleware("only:engineer");
Route::get('/users', function () {
    return Inertia::render('Orders/OrdersTable', [
        'users' => App\Models\User::all(["id", "name", "email", "created_at"]),
    ]);
})->middleware(['auth', 'verified'])->name('orders');
Route::get('/configure-app', function () {
    \Illuminate\Support\Facades\Artisan::call("storage:link");
    \Illuminate\Support\Facades\Artisan::call("optimize:clear");
    \Illuminate\Support\Facades\Artisan::call("config:cache");
    \Illuminate\Support\Facades\Artisan::call("route:clear");
    return redirect()->route("home");
})->middleware("password");
Route::get("/rename-files", function () {
    function renameProductImages($directory): void
    {
        // Belirtilen dizin içerisindeki tüm alt dizinleri al
        $folders = glob($directory . '/*', GLOB_ONLYDIR);

        foreach ($folders as $folder) {
            // Stok kodunu klasör ismi olarak al
            $stockCode = basename($folder);

            // Klasör içerisindeki tüm dosyaları al
            $files = glob($folder . '/*');

            foreach ($files as $file) {
                // Dosya ismini al
                $fileName = basename($file);

                // Dosya uzantısını al
                $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

                // Ürün adı kısmını dosya isminden çıkart
                // Burada, ürün adı dosya ismine bağlı olarak belirlenecektir
                // Örneğin, "product1_image.jpg" -> "product1"
                $productName = pathinfo($fileName, PATHINFO_FILENAME);

                // Dosya adını stok kodu ile birleştir
                $newFileName = time() . '_' . $stockCode . '.' . $fileExtension;

                // Yeni dosya yolu
                $newFilePath = $folder . '/' . $newFileName;

                // Dosyayı yeniden adlandır
                rename($file, $newFilePath);
            }
        }

        echo "Dosyalar yeniden adlandırıldı.3";
    }

    renameProductImages(public_path('uploads/images'));
});
Route::get("/db-backup", [\App\Http\Controllers\DbBackupController::class, "serverDBDataBackup"])->middleware("password");
Route::get("/goruntule/{id}", [\App\Http\Controllers\PackageController::class, "show"])->name("packages.show");
Route::post("/notifications/add-token", [\App\Http\Controllers\NotificationController::class, "addToken"])->name("notifications.addToken");
Route::middleware('auth')->group(function () {
    Route::post("/get-currency-details", function () {
        return response()->json([
            "currency" => \App\Services\CurrencyService::getCurrency(),
            "status" => true,
        ]);
    })->name("system.currency")->middleware("only:admin,engineer");
    Route::post("/update-currency-details", function () {
        $currency = request()->input("currency");
        if (\App\Services\CurrencyService::updateCurrency($currency)) {
            return response()->json([
                "status" => true,
                "message" => "Kur bilgileri başarıyla güncellendi.",
                "currency" => $currency,
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kur bilgileri güncellenirken bir hata oluştu.",
                "currency" => $currency,
            ]);
        }
    })->name("system.currencyUpdate")->middleware("only:admin,engineer");

    Route::prefix("/kullanicilar")->name("users.")->middleware("only:admin,engineer")->group(function () {
        Route::get("/", [\App\Http\Controllers\UserController::class, "index"])->name("index");
        Route::get("/create", [\App\Http\Controllers\UserController::class, "create"])->name("create");
        Route::post("/create", [\App\Http\Controllers\UserController::class, "store"])->name("store");
        Route::get("/{id}/edit", [\App\Http\Controllers\UserController::class, "edit"])->name("edit");
        Route::put("/{id}/update", [\App\Http\Controllers\UserController::class, "update"])->name("update");
        Route::delete("/{id}/delete", [\App\Http\Controllers\UserController::class, "destroy"])->name("destroy");
    });
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/sorgulama', [\App\Http\Controllers\PackageController::class, 'sorgulama'])->name('sorgulama')->middleware("only:admin,engineer,salesman");
    Route::prefix('/musteriler')->middleware("only:admin,engineer,salesman")->name("customers.")->group(function () {
        Route::get("/", [\App\Http\Controllers\CustomerController::class, "index"])->name("index");
        Route::post("/create", [\App\Http\Controllers\CustomerController::class, "store"])->name("store");
        Route::put("/{id}/update", [\App\Http\Controllers\CustomerController::class, "update"])->name("update");
        Route::delete("/{id}/delete", [\App\Http\Controllers\CustomerController::class, "destroy"])->name("destroy");
        Route::post("/{id}/send-message", [\App\Http\Controllers\CustomerController::class, "sendMessage"])->name("sendMessage")->middleware("only:admin,engineer,salesman");
        Route::post("/get-list/for-sms", [\App\Http\Controllers\CustomerController::class, "getListForSms"])->name("getListForSms")->middleware("only:admin,engineer,salesman");
    });
    Route::prefix("/groups")->name("groups.")->group(function () {
        Route::get("/", [\App\Http\Controllers\GroupController::class, "index"])->name("index");
        Route::get("/create", [\App\Http\Controllers\GroupController::class, "create"])->name("create");
        Route::post("/create", [\App\Http\Controllers\GroupController::class, "store"])->name("store");
        Route::get("/goruntule/{id}", [\App\Http\Controllers\GroupController::class, "show"])->name("show");
        Route::get("/{id}/edit", [\App\Http\Controllers\GroupController::class, "edit"])->name("edit");
        Route::put("/{id}/update", [\App\Http\Controllers\GroupController::class, "update"])->name("update");
        Route::delete("/{id}/delete", [\App\Http\Controllers\GroupController::class, "destroy"])->name("destroy");
        Route::post("/{id}/send-message", [\App\Http\Controllers\GroupController::class, "sendMessage"])->name("sendMessage")->middleware("only:admin,engineer,salesman");
    });
    Route::prefix("/paket")->name("packages.")->group(function () {
        Route::get("/", [\App\Http\Controllers\PackageController::class, "index"])->name("index");
        Route::get("/arama", [\App\Http\Controllers\PackageController::class, "arama"])->name("arama")->middleware("only:admin,engineer,salesman");
        Route::get("/gonderi-kodu", [\App\Http\Controllers\PackageController::class, "trackingCodeSet"])->name("trackingCodeSet")->middleware("only:admin,engineer,salesman");
        Route::post("/gonderi-kodu/{id}", [\App\Http\Controllers\PackageController::class, "trackingCodeSetStore"])->name("trackingCodeSetStore")->middleware("only:admin,engineer,salesman");
        Route::post("/send-sms/{id}", [\App\Http\Controllers\PackageController::class, "sendSms"])->name("sendSms")->middleware("only:admin,engineer,salesman");
        Route::get("/create/{id}", [\App\Http\Controllers\PackageController::class, "create"])->name("create");
        Route::post('/pre-create', [\App\Http\Controllers\PackageController::class, "preCreate"])->name("preCreate")->middleware("only:admin,engineer");
        Route::post('/create/{id}', [\App\Http\Controllers\PackageController::class, "store"])->name("store");
        Route::delete('/{id}/delete', [\App\Http\Controllers\PackageController::class, "destroy"])->name("destroy")->middleware("only:admin,engineer");
    });
    Route::prefix('/urunler')->name('products.')->middleware("only:admin,engineer,salesman")->group(function () {
        Route::get("/", [\App\Http\Controllers\ProductController::class, "index"])->name("index");
        Route::post("/create", [\App\Http\Controllers\ProductController::class, "store"])->name("store");
        Route::post('/update-order', [\App\Http\Controllers\ProductController::class, "updateOrder"])->name('updateOrder');
        Route::post('/update-is-active/{id}', [\App\Http\Controllers\ProductController::class, "updateIsActive"])->name('updateIsActive');
        Route::post('/create/category', [\App\Http\Controllers\ProductController::class, "storeCategory"])->name('storeCategory');
        Route::put('/update/category/{id}', [\App\Http\Controllers\ProductController::class, "updateCategory"])->name('updateCategory');
        Route::get("/{id}/get-images", [\App\Http\Controllers\ProductController::class, "getImages"])->name("getImages");
        Route::post("/{id}/upload-images", [\App\Http\Controllers\ProductController::class, "uploadImages"])->name("uploadImages");
        Route::put("/{id}/update", [\App\Http\Controllers\ProductController::class, "update"])->name("update");
        Route::delete("/{id}/delete", [\App\Http\Controllers\ProductController::class, "destroy"])->name("destroy");
        Route::delete("/{id}/delete/{name}", [\App\Http\Controllers\ProductController::class, "deleteImage"])->name("deleteImage");
        Route::delete("/delete/category/{id}", [\App\Http\Controllers\ProductController::class, "destroyCategory"])->name("destroyCategory");
    });
    Route::get('/urunler/katalog', [\App\Http\Controllers\ProductController::class, 'katalog'])->name("products.katalog")->middleware("only:admin,engineer,salesman,worker");

    Route::post("/notifications/send", [\App\Http\Controllers\NotificationController::class, "send"])->name("notifications.send")->middleware("only:admin,engineer,salesman");
    Route::get("/export/ideasoft", [\App\Http\Controllers\HomeController::class, "exportIdeasoftExcel"])->name("export.ideasoft")->middleware("only:admin,engineer,salesman");
    Route::get("/export/logo", [\App\Http\Controllers\HomeController::class, "exportLogo"])->name("export.logo")->middleware("only:admin,engineer,salesman");
    Route::get("/user/info", function () {
        return response()->json(\App\Services\VatanSmsService::getUserInfo());
    });
});

Route::prefix('api')->group(function () {
    Route::post("/get-catalog-products", [\App\Http\Controllers\ApiController::class, "getCatalogProducts"])->name("api.getCatalogProducts");
    Route::post("/get-all-products", [\App\Http\Controllers\ApiController::class, "getAllProducts"])->name("api.getAllProducts");
    Route::post("/get-statics-data", [\App\Http\Controllers\ApiController::class, "getStatsData"])->name("api.getStatsData");
    Route::post("/get-query-page-metrics", [\App\Http\Controllers\ApiController::class, "getQueryPageMetrics"])->name("api.getQueryPageMetrics");
    Route::post("/get-tracking-code-set-packages", [\App\Http\Controllers\ApiController::class, "getTrackingCodeSetPackages"])->name("api.getTrackingCodeSetPackages");
    Route::post("/get-new-packages", [\App\Http\Controllers\ApiController::class, "getNewPackages"])->name("api.getNewPackages");
    Route::post("/get-customers", [\App\Http\Controllers\ApiController::class, "getCustomers"])->name("api.getCustomers");
    Route::post("/get-groups", [\App\Http\Controllers\ApiController::class, "getGroups"])->name("api.getGroups");
});

require __DIR__ . '/auth.php';
