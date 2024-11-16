<?php

namespace App\Notifications;

use App\Models\DeviceTokens;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Kreait\Firebase\Exception\FirebaseException;
use Kreait\Firebase\Exception\MessagingException;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\MulticastSendReport;

class FirebaseNotification extends Notification
{
    use Queueable;

    private $title;
    private $body;
    private $tokens;
    private $url;

    public function __construct($title, $body, $tokens, $url = null)
    {
        $this->title = $title;
        $this->body = $body;
        $this->tokens = is_array($tokens) ? $tokens : [$tokens]; // Eğer tek bir token gelirse, onu diziye dönüştür
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Send the push notification using Firebase.
     */
    public function sendPushNotification(): bool
    {
        $firebase = (new Factory)
            ->withServiceAccount(__DIR__ . '/../../resources/config/firebase_credentials2.json');

        $messaging = $firebase->createMessaging();

        $message = CloudMessage::fromArray([
            'data' => [
                'title' => $this->title,
                'body' => $this->body,
                'icon' => url("uploads/images/default.png"),
                'url' => $this->url ?? env("APP_URL") . '/',
            ],
            'webpush' => [
                'fcm_options' => [
                    'link' => $this->url ?? env("APP_URL") . '/',
                ],
            ],
        ]);
        $error = false;
        if (count($this->tokens) > 1) {
            $report = $messaging->sendMulticast($message, $this->tokens);
        } else {
            try {
                $messaging->send($message, $this->tokens[0]);
            } catch (MessagingException|FirebaseException $e) {
                $error = true;
            }
        }
        return $error;

    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            'title' => $this->title,
            'body' => $this->body,
        ];
    }
}
