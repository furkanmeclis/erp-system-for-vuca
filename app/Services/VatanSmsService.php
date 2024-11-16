<?php

namespace App\Services;

use App\Models\SendedMessages;
use Illuminate\Support\Facades\Http;


class VatanSmsService
{
    protected static $apiId;
    protected static $apiKey;
    protected static $sender;
    protected static $endpoint;
    protected static $single = false;
    public static function init()
    {
        self::$apiId = env('VATAN_SMS_API_ID');
        self::$apiKey = env('VATAN_SMS_API_KEY');
        self::$sender = env('VATAN_SMS_SENDER');
        self::$endpoint = 'https://api.vatansms.net/api/v1';
    }

    public static function formatPhoneNumber(string $phone): ?string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        $phone = substr($phone, -10);
        return (substr($phone, 0, 1) === '5') ? $phone : null;
    }

    public static function filterAndFormatPhones(array $phones): array
    {
        $formattedPhones = [];
        $invalidPhones = [];

        foreach ($phones as $phone) {
            $formattedPhone = self::formatPhoneNumber($phone);
            if ($formattedPhone) {
                $formattedPhones[] = $formattedPhone;
            } else {
                $invalidPhones[] = $phone;
            }
        }

        return [$formattedPhones, $invalidPhones];
    }

    public static function sendSms(array $phones, string $message, string $messageType = 'turkce', string $messageContentType = 'bilgi')
    {
        self::init();
        list($formattedPhones, $invalidPhones) = self::filterAndFormatPhones($phones);

        if (empty($formattedPhones)) {
            return [
                'success' => false,
                'message' => 'Geçerli telefon numarası bulunamadı.',
                'invalidPhones' => $invalidPhones
            ];
        }

        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
            'sender' => self::$sender,
            'message_type' => $messageType,
            'message' => $message,
            'message_content_type' => $messageContentType,
            'phones' => $formattedPhones
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . '/1toN', $params);

        $transaction = [
            'success' => $response->successful(),
            'response' => $response->json(),
            'invalidPhones' => $invalidPhones
        ];
        $newMessage = new SendedMessages();
        $newMessage->phones = json_encode($formattedPhones);
        $newMessage->message = $message;
        $newMessage->response = json_encode($transaction);
        self::$single == false && $newMessage->save();
        if(cache()->has("sms_count")){
            cache()->forget("sms_count");
        }
        return $transaction;
    }

    public static function sendSingleSms(string $phone, string $message, string $messageType = 'normal', string $messageContentType = 'bilgi')
    {
        self::init();
        $formattedPhone = self::formatPhoneNumber($phone);

        if (!$formattedPhone) {
            return [
                'success' => false,
                'message' => 'Geçerli telefon numarası bulunamadı.',
                'invalidPhones' => [$phone]
            ];
        }
        self::$single = true;
        $transaction = self::sendSms([$formattedPhone], $message, $messageType, $messageContentType);
        $newMessage = new SendedMessages();
        $newMessage->phone = $formattedPhone;
        $newMessage->message = $message;
        $newMessage->response = json_encode($transaction);
        $newMessage->save();
        return $transaction;
    }

    public static function getSenderNames()
    {
        self::init();
        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . '/senders', $params);

        return $response->json();
    }

    public static function getUserInfo()
    {
        self::init();
        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . '/user/information', $params);

        return $response->json();
    }

    public static function getReportDetail(int $reportId, int $page = 1, int $pageSize = 20)
    {
        self::init();
        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
            'report_id' => $reportId
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . "/report/detail?page={$page}&pageSize={$pageSize}", $params);

        return $response->json();
    }

    public static function getReportBetweenDates(string $startDate, string $endDate)
    {
        self::init();
        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
            'start_date' => $startDate,
            'end_date' => $endDate
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . '/report/between', $params);

        return $response->json();
    }

    public static function getSingleReport(int $reportId)
    {
        self::init();
        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
            'report_id' => $reportId
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . '/report/single', $params);

        return $response->json();
    }

    public static function cancelFutureSms(int $reportId)
    {
        self::init();
        $params = [
            'api_id' => self::$apiId,
            'api_key' => self::$apiKey,
            'id' => $reportId
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post(self::$endpoint . '/cancel/future-sms', $params);

        return $response->json();
    }
}
