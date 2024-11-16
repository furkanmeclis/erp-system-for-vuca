<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string("phone");
            $table->string("officer")->comment("Giriş Yapan Personel");
            $table->string("status")->default("Beklemede")->comment("Paket Durumu:Beklemede,Paketlendi,Kargolandı");
            $table->string("prepared")->nullable()->comment("Paketi Hazırlayan Personel");
            $table->string("packer")->nullable()->comment("Paketleyen Personel");
            $table->string("note")->nullable()->comment("Not");
            $table->string("address")->nullable()->comment("Adres");
            $table->string("city")->nullable()->comment("Şehir");
            $table->string("district")->nullable()->comment("İlçe");
            $table->integer("quantity")->nullable()->default(1)->comment("Koli Adedi");
            $table->boolean("is_sms_sent")->default(false)->comment("SMS Gönderildi mi?");
            $table->string("tracking_code")->nullable()->comment("Takip Kodu");
            $table->string("shipping_company")->nullable()->default("Yurt İçi Kargo")->comment("Kargo Şirketi");
            $table->enum("record_type",["firebase","web"])->default("web")->comment("Kayıt Türü");
            $table->string("record_id")->nullable()->comment("Kayıt ID");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
