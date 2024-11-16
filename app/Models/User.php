<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public static function roles(): array
    {
        return [
            [
                "role" => "engineer",
                "label" => "Yazılım Üreticisi",
                "description" => "Tüm Her Yere Erişimi Vardır.",
                "severity" => "danger"
            ],
            [
                "role" => "admin",
                "label" => "Yönetici",
                "description" => "Mevcut Tüm Verileri Yönetebilir.",
                "severity" => "help",
            ],
            [
                "role" => "salesman",
                "label" => "Satış Temsilcisi",
                "description" => "Ürünler,Paketler,Müşteriler,Gruplar,Katalog Sayfasına Erişimi Vardır.",
                "severity" => "info"
            ],
            [
                "role" => "worker",
                "label" => "Çalışan",
                "description" => "Paketler ve Katalog Sayfasına Erişimi Vardır.",
                "severity" => "success"
            ]
        ];
    }

    public function getRole(): array
    {
        $roles = self::roles();
        $role = $roles[0];
        foreach ($roles as $r) {
            if ($r["role"] === $this->role) {
                $role = $r;
                break;
            }
        }
        return $role;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function getAllUsers(): \Illuminate\Database\Eloquent\Collection
    {
        $users = User::all();
        foreach ($users as $user) {
            $user->role = $user->getRole();
        }
        return $users;
    }
}
