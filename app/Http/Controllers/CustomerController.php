<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\VatanSmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function getCustomersAll()
    {
        return Customer::where("id", ">", "0")->orderBy("id", "desc")->get();
    }

    public function index()
    {
        return Inertia::render('Customers/Index');
    }

    public function store()
    {
        $customer = new Customer();
        $customer->name = \request()->input("name");
        if (\request()->has("email") && \request()->input("email") != "") {
            if (Customer::where("email", \request()->input("email"))->first()) {
                return response()->json([
                    "message" => "Bu Mail Adresi İle Daha Önce Kayıt Gerçekleştirilmiş Lütfen Başka Bir Mail Adresi Deneyiniz.",
                    "status" => false
                ]);
            }
            $customer->email = \request()->input("email");
        } else {
            $random = Str::random(10);
            $customer->email = $random . "@ckymoto.com";
        }
        if (Customer::where("email", $customer->email)->first()) {
            return response()->json([
                "message" => "Bu Mail Adresi İle Daha Önce Kayıt Gerçekleştirilmiş Lütfen Başka Bir Mail Adresi Deneyiniz.",
                "status" => false
            ]);
        }
        $customer->phone = str_replace(" ", "", \request()->input("phone"));
        $customer->city = \request()->input("city");
        $customer->district = \request()->input("district");
        $customer->address = \request()->input("address");
        if ($customer->save()) {
            return response()->json([
                "message" => "Müşteri Kaydı Başarılı",
                "status" => true,
                "user_id" => $customer->id,
                'customers' => $this->getCustomersAll()
            ]);
        } else {
            return response()->json([
                "message" => "Müşteri Kaydı Başarısız",
                "status" => false
            ]);
        }

    }

    public function update($id)
    {
        $customer = Customer::find($id);
        if ($customer) {
            $customer->name = \request()->input("name");
            $customer->email = \request()->input("email");
            $customer->phone = \request()->input("phone");
            $customer->city = \request()->input("city");
            $customer->district = \request()->input("district");
            $customer->address = \request()->input("address");
            if ($customer->save()) {
                return response()->json([
                    "message" => "Güncelleme İşlemi Başarılı",
                    "status" => true,
                    'customers' => $this->getCustomersAll()
                ]);
            } else {
                return response()->json([
                    "message" => "Güncelleme İşlemi Başarısız",
                    "status" => false
                ]);
            }

        } else {
            return response()->json([
                "message" => "Müşteri Bulunamadı",
                "status" => false
            ]);
        }
    }

    public function sendMessage($id): \Illuminate\Http\JsonResponse
    {
        $customer = Customer::find($id);
        $message = \request()->input("message");
        return response()->json([
            'message' => 'SMS Özelliği şu an aktif değil',
            'status' => false
        ]);
        if ($customer) {
            $sms = VatanSmsService::sendSingleSms($customer->phone, $message);
            $status = $sms["response"]["status"] == "success";
            if ($status) {
                return response()->json(["message" => "Mesaj Gönderildi." . $sms["response"]["quantity"] . " SMS Krediniz Kaldı.", "status" => true, "sms" => $sms]);
            } else {
                return response()->json(["message" => $sms["response"]["description"], "status" => false]);
            }
        } else {
            return response()->json(["message" => "Müşteri Bulunamadı", "status" => false]);
        }
    }

    public function getListForSms()
    {
        if (\request()->has("detail") && \request()->input("detail") == "1") {
            $customers = Customer::where("id", ">", "0")->orderBy("id", "desc")->get(["id", "name", "email", "phone", "city", "district", "address"]);
        } else {
            $customers = Customer::where("id", ">", "0")->orderBy("id", "desc")->get(["id", "name"]);
        }
        return response()->json([
            "customers" => $customers,
            "detail" => \request()->all()
        ]);
    }

    public function destroy($id)
    {
        $customer = Customer::find($id);
        if ($customer) {
            if ($customer->delete()) {
                return response()->json([
                    "message" => "Silme İşlemi Başarılı",
                    "status" => true,
                ]);
            } else {
                return response()->json([
                    "message" => "Silme İşlemi Başarısız",
                    "status" => false
                ]);
            }
        } else {
            return response()->json([
                "message" => "Müşteri Bulunamadı",
                "status" => false
            ]);
        }

    }
}
