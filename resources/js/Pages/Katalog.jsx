import ApplicationLogo from "@/Components/ApplicationLogo.jsx";
import {Button} from "primereact/button";
import React, {useEffect, useRef, useState} from 'react';
import 'primereact/resources/primereact.css';
import Catalog from "@/Components/Catalog.jsx";
import {Head, router} from "@inertiajs/react";
import {BlockUI} from "primereact/blockui";
import {InputOtp} from 'primereact/inputotp';
import {useLocalStorage} from "primereact/hooks";
import {getCatalogProducts} from "@/helpers/helper.js";
import {Toast} from "primereact/toast";
import {messaging} from "@/firebase/index.js";
import {getToken, onMessage} from "firebase/messaging";

const Katalog = ({categories, phoneNumber, password, csrf_token}) => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [productsAll, setProductsAll] = useState([]);
    const [cartVisible, setCartVisible] = useState(false);
    const [logined, setLogined] = useLocalStorage(false, 'loginedCatalogForCkyMoto');
    useEffect(() => {
        getCatalogProducts(csrf_token).then(({status, data}) => {
            if (status) {
                setProductsAll(data);
            } else {
                toast.current.show({
                    severity: 'error', summary: 'Hata', detail: 'Ürünler yüklenirken bir hata oluştu.', life: 3000
                });
            }
        }).catch((err) => {
            console.error(err);
            toast.current.show({
                severity: 'error', summary: 'Hata', detail: 'Ürünler yüklenirken bir hata oluştu.', life: 3000
            });
        }).finally(() => {
            setLoading(false);

        })
    }, []);
    const {VITE_APP_VAPID_KEY} = import.meta.env;
    const [serviceWorker, setServiceWorker] = useState(null);
    const onMessageBrowser = () => {
        onMessage(messaging, payload => {
            const icon = payload.data.icon ? payload.data.icon : 'https://ckymoto.com/dosya/icon-256x256.png';
            const notificationTitle = payload.data.title;
            const notificationOptions = {body: payload.data.body, icon: icon, data: {url: payload.data.url}};
            new Notification(notificationTitle, notificationOptions);
        })
    }
    useEffect(() => {
        onMessageBrowser();
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/messaging-sw.js')
                .then(function (registration) {
                    console.log('Service Worker Kaydı Başarılı:', registration);
                    setServiceWorker(registration);

                })
                .catch(function (error) {
                    console.log('Service Worker kaydı başarısız:', error);
                });
        }
    }, []);

    async function requestPermission() {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: VITE_APP_VAPID_KEY, serviceWorkerRegistration: serviceWorker
            });
            setLoading(true)
            let formdata = new FormData();
            formdata.append('token', token);
            formdata.append('platform', navigator.platform);
            fetch(route('notifications.addToken'), {
                method: 'POST', headers: {
                    'X-CSRF-TOKEN': csrf_token
                }, body: formdata

            }).then(response => response.json()).then(data => {
                if (data.status) {
                    toast.current.show({
                        severity: 'success', summary: 'Başarılı', detail: data.message, life: 3000
                    });

                } else {
                    toast.current.show({
                        severity: 'error', summary: 'Hata', detail: data.message
                    });
                }
            }).catch((error) => {
                toast.current.show({
                    severity: 'error', summary: 'Hata', detail: "CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."
                });
            }).finally(() => {
                setLoading(false);
            });

        } else if (permission === "denied") {
            toast.current.show({
                severity: 'error', summary: 'Hata', detail: 'Bildirimler Engellendi', life: 3000
            });
        }
    }

    const openBrowserNotifications = () => {
        if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
            if ('Notification' in window) {
                setLoading(true)
                requestPermission().then(r => console.log());
            } else {
                toast.current.show({
                    severity: 'info',
                    summary: 'Hata',
                    detail: 'Bildirimleri almak için tarayıcınızın URL bölümünde bulunan paylaş butonunu kullanarak uygulamamızı ana ekrana ekleyin. Bu sayede, uygulama yüklemeden hizmetlerinizi anında takip edebilirsiniz.',
                    life: 10000
                });
            }
        } else {
            setLoading(true)
            requestPermission().then(r => console.log());
        }

    }
    return (<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Toast ref={toast}/>
        <Head title="Katalog"/>
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">

                            <ApplicationLogo
                                className="block h-8 w-auto fill-current text-gray-800 dark:text-gray-200"/>
                        </div>

                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ms-6">
                        <div className="ms-3 relative">
                            <Button label={"Bildirimleri Aç"} icon="pi pi-bell" size={"small"}
                                    className="p-button-rounded mr-2"
                                    severity={"warning"} tooltip={"Bildirimleri Aç"}
                                    onClick={() => openBrowserNotifications()}
                                    tooltipOptions={{
                                        position: "bottom"
                                    }}/>
                            <Button label={"Sepetim"} icon="pi pi-shopping-cart" size={"small"}
                                    className="p-button-rounded mr-2"
                                    severity={"info"} tooltip={"Sepetim"}
                                    onClick={() => setCartVisible(!cartVisible)}
                                    tooltipOptions={{
                                        position: "bottom"
                                    }}/>
                            <Button label={"Giriş"} icon="pi pi-sign-in" size={"small"}
                                    className="p-button-rounded "
                                    severity={"success"} tooltip={"Panel'e Giriş"} tooltipOptions={{
                                position: "bottom"
                            }}
                                    onClick={() => {
                                        router.visit(route("login"));
                                    }}
                            />
                        </div>
                    </div>

                    <div className="-me-2 flex items-center sm:hidden">
                        <Button icon="pi pi-shopping-cart" size={"small"} className="p-button-rounded mr-2"
                                severity={"info"} tooltip={"Sepetim"}
                                onClick={() => setCartVisible(!cartVisible)}
                                tooltipOptions={{
                                    position: "bottom"
                                }}/>
                        <Button icon="pi pi-sign-in" size={"small"} className="p-button-rounded "
                                severity={"success"} tooltip={"Panel'e Giriş"} tooltipOptions={{
                            position: "bottom"
                        }}
                                onClick={() => {
                                    router.visit(route("login"));
                                }}
                        />
                    </div>
                </div>
            </div>

        </nav>
        <BlockUI blocked={loading} fullScreen
                 template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
            <div className={"mt-[-2px]"}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded">
                        {logined && !loading &&
                            <Catalog productsAll={productsAll} categories={categories} cartVisible={cartVisible}
                                     setCartVisible={setCartVisible} phoneNumber={phoneNumber}/>}
                        {!logined && <div className={"my-8 flex justify-center items-center"}>
                            <div>
                                <h3 className={"font-semibold text-xl text-center mb-3"}>Kataloğu Görmek <br/>İçin
                                    Şifrenizi Giriniz</h3>
                                <InputOtp mask type={"number"} onChange={(e) => {
                                    if (e.value === password) {
                                        setLogined(true);
                                    }
                                }}/>
                            </div>
                        </div>}

                    </div>
                </div>
            </div>
        </BlockUI>
    </div>);
}
export default Katalog;
