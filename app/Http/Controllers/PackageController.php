<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Package;
use App\Models\SendedMessages;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;
use Intervention\Image\Laravel\Facades\Image;
class PackageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Package/NewPackages');
    }
    public function sorgulama(): \Inertia\Response
    {

        return Inertia::render('Sorgulama');
    }

    public function arama()
    {
        $parameter = "";
        if(\request()->has("customer")){
            $parameter = "customer";
            $query = Package::where("name","like","%".\request()->input("customer")."%")->orWhere("phone","like","%".\request()->input("customer")."%");
        }elseif (\request()->has("code")){
            $parameter = "code";
            $query = Package::where("tracking_code",\request()->input("code"));
        }elseif (\request()->has("date")){
            $parameter = "date";
            $date = \request()->input("date");
            $carbonDate = \Carbon\Carbon::createFromFormat('d.m.Y',$date);
            $query = Package::whereDate("updated_at",$carbonDate);
        }
        if($parameter == ""){
            return redirect()->route("packages.index");
        }elseif($parameter == "code"){
            if($record = $query->first()){
                return redirect()->route("packages.show",$record->record_id);
            }else{
                return redirect()->route("sorgulama")->withErrors([
                    "message" => "Paket Bulunamadı",
                    "code" => \request()->input($parameter)
                ]);
            }
        }else{
            return Inertia::render('Package/Search',[
                "parameter" => $parameter,
                "searched" => \request()->input($parameter),
                "packagesAll" => $query->orderBy("updated_at","desc")->get()
            ]);
        }

    }
    public function create($id): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        $package = Package::find($id);
        if($package){
            if($package->status != "Beklemede"){
                return redirect()->route("packages.show",$id);
            }
            $packers = User::where("role",">",0)->get(["id","name"])->toArray();
            return Inertia::render('Package/Create',[
                "prepareds" => $packers,
                "packageData" => $package
            ]);
        }else{
            return redirect()->route("packages.index");
        }
    }

    public function controlUniqueUUID(): string
    {
        $uuid = Uuid::uuid4()->toString();
        if(Package::where("record_id",$uuid)->count() > 0){
            $uuid = Uuid::uuid4()->toString();
            return $this->controlUniqueUUID($uuid);
        }
        return $uuid;
    }
    public function preCreate()
    {
        $customer = Customer::find(\request()->input("customer_id"));
        $onSave = \request()->input("onSave");
        if($customer){
            $uuid = $this->controlUniqueUUID();

            $newPackage = new Package();
            $newPackage->name = $customer->name;
            $newPackage->phone = $customer->phone;
            $newPackage->city = $customer->city;
            $newPackage->district = $customer->district;
            $newPackage->address = $customer->address;
            $newPackage->officer = auth()->user()->name;
            $newPackage->record_id = $uuid;
            if($newPackage->save()) {
                if($onSave == "true"){
                    return response()->json([
                        "message" => "Paket Oluşturuldu",
                        "packages" => Package::where("status","Beklemede")->orderBy('id','desc')->get(),
                        "status" => true,
                    ]);
                }
                return response()->json([
                    "message" => "Paket Oluşturuldu",
                    "status" => true,
                ]);
            }else{
                return response()->json([
                    "message" => "Paket Oluşturulamadı",
                    "status" => false
                ]);
            }
        }else{
            return response()->json([
                "message" => "Müşteri Bulunamadı",
                "status" => false
            ]);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    private function resizeAndSaveImage($file,$path,$fileName,$width=800,$height=600): void
    {
        $img = Image::read($file);
        $img->resize($width,$height);
        $img->save($path."/".$fileName);
    }
    public function store(Request $request,$id)
    {
        $package = Package::find($id);
        if($package){
            $images = [];
            $videos = [];
            $package->status = "Paketlendi";
            $package->quantity = $request->input("quantity");
            $package->prepared = $request->input("prepared");
            $package->note = $request->input("note") ?? "";
            $package->packer = auth()->user()->name;

            if($request->hasFile('images')){
                foreach ($request->file('images') as $file){
                    $fileName = "CKYMOTO_PAKET_RESIM_".$file->getClientOriginalName();
                    $path =  public_path('uploads/packages_data/'.$package->record_id."/images");
                    if(!file_exists($path)){
                        mkdir($path,0777,true);
                    }
                    $this->resizeAndSaveImage($file,$path,$fileName);
                    $images[] = $fileName;
                }
            }
            if($request->hasFile('videos')){
                foreach ($request->file('videos') as $file){
                    $fileName = "CKYMOTO_PAKET_VIDEO_".$file->getClientOriginalName();
                    $file->move(public_path('uploads/packages_data/'.$package->record_id."/videos"),$fileName);
                    $videos[] = $fileName;
                }
            }
            $imageUrls = [];
            $videoUrls = [];
            foreach ($images as $image){
                $imageUrls[] = url('uploads/packages_data/'.$package->record_id."/images/".$image);
            }
            foreach ($videos as $video){
                $videoUrls[] = url('uploads/packages_data/'.$package->record_id."/videos/".$video);
            }
            $filesJson = [
                "files" => [
                    "images" => $images,
                    "videos" => $videos
                ],
                "images" => $imageUrls,
                "videos" => $videoUrls,
                "allFiles" => array_merge($imageUrls,$videoUrls),
                "package_id" => $package->id,
                "package_record_id" => $package->record_id,
                "customer_name" => $package->name,
                "customer_phone" => $package->phone,
                "customer_city" => $package->city,
                "customer_district" => $package->district,
                "customer_address" => $package->address,
                "officer" => $package->officer,
                "prepared" => $package->prepared,
                "packer" => $package->packer,
                "quantity" => $package->quantity,
                "note" => $package->note,
                "status" => $package->status,
                "uploaded_at" => now()->format('d.m.Y H:i:s'),
            ];
            if(file_put_contents(public_path('uploads/packages_data/'.$package->record_id."/info.json"),json_encode($filesJson))){
                if($package->save()){
                    return response()->json([
                        "message" => "Paket Oluşturuldu",
                        "status" => true,
                        "data" => $request->all(),
                        "images" => $images,
                        "videos" => $videos
                    ]);
                }else{
                    foreach ($images as $image){
                        unlink(public_path('uploads/packages_data/'.$package->record_id."/images/".$image));
                    }
                    foreach ($videos as $video){
                        unlink(public_path('uploads/packages_data/'.$package->record_id."/videos/".$video));
                    }
                    return response()->json([
                        "message" => "Paket Oluşturulamadı",
                        "status" => false
                    ]);
                }
            }
            return response()->json([
                "message" => "Paket Oluşturuldu",
                "status" => true,
                "data" => $request->all(),
                "images" => $images,
                "videos" => $videos
            ]);
        }else{
            return response()->json([
                "message" => "Paket Bulunamadı",
                "status" => false
            ]);
        }
    }

    public function trackingCodeSet(): \Inertia\Response
    {
        return Inertia::render('Package/TrackingCodeSet');
    }


    public function trackingCodeSetStore($id): \Illuminate\Http\JsonResponse
    {
        $package = Package::find($id);
        if($package){
            if($package = $package->updateTrackingCode(\request()->input("tracking_code"))) {
                if($package->sendSms()){
                    $twoDaysAgo = \Carbon\Carbon::now()->subDays(1);

                    $packages = Package::where("status", "Paketlendi")
                        ->orWhere(function($query) use ($twoDaysAgo) {
                            $query->where("status", "Kargolandı")
                                ->where("updated_at", '>=', $twoDaysAgo);
                        })
                        ->orderBy("updated_at", "desc")
                        ->get();
                    return response()->json([
                        "message" => "Kargo Takip Kodu Güncellendi ve SMS Gönderildi",
                        "status" => true,
                        "packages" => $packages
                    ]);
                }else{
                    return response()->json([
                        "message" => "Kargo Takip Kodu Güncellendi SMS Gönderilemedi",
                        "status" => false
                    ]);
                }
            }else{
                return response()->json([
                    "message" => "Kargo Takip Kodu Güncellenemedi",
                    "status" => false
                ]);
            }
        }else{
            return response()->json([
                "message" => "Paket Bulunamadı",
                "status" => false
            ]);
        }

    }


    public function sendSms($id)
    {
        $package = Package::find($id);
        if($package){
            if($package->sendSms()){
                return response()->json([
                    "message" => "SMS Gönderildi",
                    "status" => true
                ]);
            }else{
                return response()->json([
                    "message" => "SMS Gönderilemedi",
                    "status" => false
                ]);
            }
        }else{
            return response()->json([
                "message" => "Paket Bulunamadı",
                "status" => false
            ]);

        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $package = Package::where("record_id",$id)->first();
        if($package){
            $files = $package->getMedia();
            return Inertia::render('Package/Show',[
                "packageData" => $package,
                "files" => $files
            ]);
        }else{
            return redirect()->back();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $package = Package::find($id);
        if($package){
            if($package->status == "Beklemede") {
                if ($package->delete()) {
                    return response()->json([
                        "message" => "Paket Silindi",
                        "status" => true
                    ]);
                } else {
                    return response()->json([
                        "message" => "Paket Silinemedi",
                        "status" => false
                    ]);
                }
            }else{
                $files = json_decode(file_get_contents(public_path('uploads/packages_data/'.$package->record_id."/info.json")),true);
                $record_id = $package->record_id;
                if($package->delete()){
                    foreach ($files["files"]["images"] as $image){
                        unlink(public_path('uploads/packages_data/'.$record_id."/images/".$image));
                    }
                    foreach ($files["files"]["videos"] as $video){
                        unlink(public_path('uploads/packages_data/'.$record_id."/videos/".$video));
                    }
                    unlink(public_path('uploads/packages_data/'.$record_id."/info.json"));
                    if(count($files["files"]["images"]) > 0){
                        rmdir(public_path('uploads/packages_data/'.$record_id."/images"));
                    }
                    if(count($files["files"]["videos"]) > 0){
                        rmdir(public_path('uploads/packages_data/'.$record_id."/videos"));
                    }
                    rmdir(public_path('uploads/packages_data/'.$record_id));
                    return response()->json([
                        "message" => "Paket Silindi",
                        "status" => true
                    ]);
                }else{
                    return response()->json([
                        "message" => "Paket Silinemedi",
                        "status" => false
                    ]);
                }


            }
        }else{
            return response()->json([
                "message" => "Paket Bulunamadı",
                "status" => false
            ]);
        }
    }
}
