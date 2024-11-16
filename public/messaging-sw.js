const VERSION = 'v1.0.0'; // Service Worker versiyonu

importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js');

const defaultConfig = {
    apiKey: "AIzaSyCN7BvJ97NkR-19ukoDEQxhIExBFdWhU0Y",
    projectId: "erp-for-vuca",
    messagingSenderId: "255523054947",
    appId: "1:255523054947:web:2b3010f8b99138f2199f56"
};

firebase.initializeApp(defaultConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const icon = payload.data.icon ? payload.data.icon : 'https://ckymoto.com/dosya/icon-256x256.png';
    const notificationTitle = payload.data.title;
    const notificationOptions = {body: payload.data.body, icon: icon, data: {url: payload.data.url}};
    self.registration.showNotification(notificationTitle, notificationOptions).then(r => {
    });
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (client.url === event.notification.data.url && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
        }
    }));
});

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('service-worker-version').then((cache) => {
        return cache.put('version', new Response(VERSION));
    }));
});
