<?php

namespace App\Models;

use App\Services\FirebaseStorageCakayOtomotiv;
use App\Services\VatanSmsService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'officer',
        'status',
        'prepared',
        'packer',
        'note',
        'address',
        'city',
        'district',
        'quantity',
        'is_sms_sent',
        'tracking_code',
        'shipping_company',
        'record_type',
        'record_id',
    ];

    public function shortUrl()
    {
        $response = Http::get('https://is.gd/create.php?format=json&url=https://ckymoto.com/sayfa/kargom-nerede?id=' . $this->record_id);
        $response = $response->json();
        if (!isset($response['errorCode'])) {
            return $response['shorturl'];
        } else {
            return null;
        }
    }

    public function sendSms(): bool
    {
        $this->is_sms_sent = 1;
        $this->status = "Kargolandı";
        return $this->save();
        $message = "Merhaba {isim} {tarih} tarihli siparişiniz kargolanmıştır.Detay için tıklayınız.\n";
        if ($this->tracking_code == "ELDEN TESLİM") {
            $message = "Merhaba {isim} {tarih} tarihli siparişiniz tamamlanmıştır.Detay için tıklayınız.\n";
        }
        $name = Str::substr($this->name, 0, 17);
        if (strlen($this->name) > 17) {
            $name .= "...";
        }
        $message = str_replace("{isim}", $name, $message);
        $message = str_replace("{tarih}", $this->created_at->format("d.m.Y"), $message);
        $url = $this->shortUrl();
        if ($url != null) {
            $message .= $url;
        } else {
            $message .= "https://ckymoto.com/sayfa/kargom-nerede?id=" . $this->record_id;
        }
        $sms = VatanSmsService::sendSingleSms($this->phone, $message);
        if ($sms["response"]["status"] == "success") {
            $this->is_sms_sent = 1;
            $this->status = "Kargolandı";
            $this->save();
            return true;
        } else {
            return false;
        }
    }

    public function updateTrackingCode($trackingCode): Package|bool
    {
        $this->tracking_code = $trackingCode;
        if ($this->save()) {
            return $this;
        } else {
            return false;
        }
    }

    /**
     * @param $status string "Beklemede","Paketlendi","Kargolandı"
     * @return Package|bool
     */
    public function updateStatus($status): Package|bool
    {
        $this->status = $status;
        if ($this->save()) {
            return $this;
        } else {
            return false;
        }
    }

    public function getMedia()
    {
        if ($this->record_type == "firebase") {
            return FirebaseStorageCakayOtomotiv::getMedia($this->record_id);
        } elseif ($this->record_type == "web") {
            $filesJson = public_path('uploads/packages_data/' . $this->record_id . "/info.json");
            if (file_exists($filesJson)) {
                $files = json_decode(file_get_contents($filesJson), true);
            } else {
                return [
                    "images" => [],
                    "videos" => [],
                ];
            }
            return [
                "images" => $files["images"],
                "videos" => $files["videos"],
            ];
        }
    }

}
