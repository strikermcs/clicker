<?php

$apiKey = '7490661918:AAF_jM6rxU77J-POOcJl0JzVqBi5bZ-RNhU'; // Your Telegram bot API key
$apiUrl = "https://api.telegram.org/bot$apiKey/";

// Get the incoming message
$content = file_get_contents("php://input");
$update = json_decode($content, true);

if (isset($update['message'])) {
    // Extract necessary information from the update
    $chat_id = $update['message']['chat']['id'];
    $text = $update['message']['text'];
    $message_id = $update['message']['message_id'];
    $user_id = $update['message']['from']['id'];
    $user_first_name = $update['message']['from']['first_name'];
    $user_last_name = isset($update['message']['from']['last_name']) ? $update['message']['from']['last_name'] : 'Not provided';
    $user_username = isset($update['message']['from']['username']) ? $update['message']['from']['username'] : 'Not provided'; // Get user's username
    $user_language_code = isset($update['message']['from']['language_code']) ? $update['message']['from']['language_code'] : 'Not provided';

    // Send a video with caption
    $videoPath = 'start.mp4'; // Local path to the video

    // Check if the "/start" command has a referral
    if (strpos($text, '/start') === 0) {
        // Extract the referrer ID from the referral link (if present)
        $referrer_id = null;
        if (strpos($text, '/start r') === 0) {
            $referrer_id = substr($text, 8);
        }

        // If there's a referrer, notify them
        if ($referrer_id) {
            $notificationText = "$user_first_name joined using your referral link! 🎉";

            $ch_notify = curl_init();
            curl_setopt($ch_notify, CURLOPT_URL, $apiUrl . "sendMessage");
            curl_setopt($ch_notify, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch_notify, CURLOPT_POST, 1);

            $post_notify = [
                'chat_id' => $referrer_id,
                'text' => $notificationText
            ];

            curl_setopt($ch_notify, CURLOPT_POSTFIELDS, $post_notify);
            curl_setopt($ch_notify, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch_notify, CURLOPT_SSL_VERIFYHOST, 0);

            $result = curl_exec($ch_notify);
            if ($result === false) {
                error_log("CURL Error: " . curl_error($ch_notify));
            }
            curl_close($ch_notify);
        }

        // Standard /start welcome message with video
        if ($text === '/start' || $referrer_id) {
            $caption = "
            👋 This is Yescoin, the real one.

            Tap on the coin and watch your balance grow.

            How much is Yescoin worth? No one knows, probably something.

            Got any friends? Get them in the game. That way you'll get even more coins together.

            Yescoin is everything you ever wanted . That's all you need to know.";

            $referralLink = $referrer_id ? "https://yescoin.cbroclients.com/?ref=$referrer_id" : "https://yescoin.cbroclients.com";

            if (file_exists($videoPath)) {
                $realPath = realpath($videoPath);

                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $apiUrl . "sendVideo");
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_POST, 1);

                $post_fields = [
                    'chat_id' => $chat_id,
                    'video' => new CURLFILE($realPath),
                    'caption' => $caption,
                    'parse_mode' => 'Markdown',
                    'reply_markup' => json_encode([
                        'inline_keyboard' => [
                            [
                                ['text' => 'Play Now', 'web_app' => ['url' => $referralLink]],
                                ['text' => 'Buy now', 'url' => 'https://x.com/itking007'],
                                ['text' => 'Join Our Community', 'url' => 'https://t.me/companybrodigital']
                            ]
                        ]
                    ])
                ];

                curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

                $result = curl_exec($ch);
                if ($result === false) {
                    error_log("CURL Error: " . curl_error($ch));
                }

                curl_close($ch);
            } else {
                error_log("Video not found: " . $videoPath);
            }
        }

    }
}

?>
