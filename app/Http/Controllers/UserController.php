<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController
{
    public function index()
    {
        return Inertia::render("Users/Index", [
            "usersAll" => User::getAllUsers(),
            "roles" => User::roles(),
        ]);
    }

    public function store(): \Illuminate\Http\JsonResponse
    {
        $name = request("name");
        $email = request("email");
        $password = request("password");
        $role = request("role");
        $controlEmail = User::where("email", $email)->first();
        if ($controlEmail) {
            return response()->json([
                "status" => false,
                "message" => "Bu E-Posta Adresi Zaten Kullanımda.",
            ]);
        }
        $newUser = new User();
        $newUser->name = $name;
        $newUser->email = $email;
        $newUser->password = bcrypt($password);
        $newUser->role = $role;
        if ($newUser->save()) {
            return response()->json([
                "status" => true,
                "message" => "Kullanıcı Başarıyla Eklendi.",
                "users" => User::getAllUsers(),
            ]);
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kullanıcı Eklenirken Bir Hata Oluştu.",
            ]);
        }
    }

    public function update($id)
    {
        $user = User::find($id);
        if ($user) {
            if ($user->role == "engineer" && auth()->user()->role != "engineer") {
                return response()->json([
                    "status" => false,
                    "message" => "Yazılım Üreticisi Güncellenemez.Buna Yetkiniz Yok.",
                ]);
            }
            if ($user->id == auth()->id()) {
                return response()->json([
                    "status" => false,
                    "message" => "Kendi Hesabınızı Güncellemek İçin Profil Sayfasına Gidin.",
                ]);
            }
            $name = request("name");
            $email = request("email");
            $role = request("role");
            $controlEmail = User::where("email", $email)->where("id", "!=", $id)->first();
            if ($controlEmail) {
                return response()->json([
                    "status" => false,
                    "message" => "Bu E-Posta Adresi Zaten Kullanımda.",
                ]);
            }
            $user->name = $name;
            $user->email = $email;
            $user->role = $role;
            if (request()->has("password")) {
                $password = request("password");
                $user->password = bcrypt($password);
            }
            if ($user->save()) {
                return response()->json([
                    "status" => true,
                    "message" => "Kullanıcı Başarıyla Güncellendi.",
                    "users" => User::getAllUsers(),
                ]);
            } else {
                return response()->json([
                    "status" => false,
                    "message" => "Kullanıcı Güncellenirken Bir Hata Oluştu.",
                ]);
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kullanıcı Bulunamadı.",
            ]);
        }
    }

    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        $user = User::find($id);
        if ($user) {
            if ($user->id == auth()->id()) {
                return response()->json([
                    "status" => false,
                    "message" => "Kendi Hesabınızı Silmek İçin Profil Sayfasına Gidin.",
                ]);
            }
            if ($user->role == "engineer" && auth()->user()->role != "engineer") {
                return response()->json([
                    "status" => false,
                    "message" => "Yazılım Üreticisi Silinemez.Buna Yetkiniz Yok.",
                ]);
            } else {

                if ($user->delete()) {
                    return response()->json([
                        "status" => true,
                        "message" => "Kullanıcı Başarıyla Silindi.",
                    ]);
                } else {
                    return response()->json([
                        "status" => false,
                        "message" => "Kullanıcı Silinirken Bir Hata Oluştu.",
                    ]);
                }
            }
        } else {
            return response()->json([
                "status" => false,
                "message" => "Kullanıcı Bulunamadı.",
            ]);
        }
    }
}
