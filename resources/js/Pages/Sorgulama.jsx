import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import {Button} from 'primereact/button';
import {Calendar} from 'primereact/calendar';
import React, {useEffect, useRef, useState} from "react";
import CalendarComp from "@/Components/CalendarComp.jsx";
import {InputText} from "primereact/inputtext";
import MessageDialog from "@/Components/MessageDialog.jsx";
import PreCrate from "@/Pages/Package/PreCreate.jsx";
import {Toast} from "primereact/toast";
import {getQueryPageMetrics} from "@/helpers/helper.js";
import {BlockUI} from "primereact/blockui";

export default function Sorgulama({auth, csrf_token, errors}) {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        todayPackageCount: 0,
        todayPackageCountPrepared: 0,
        todayPackageCountShipped: 0,
        todaySendedMessagesCount: 0
    });
    const toast = useRef(null);
    const [smsVisible, setSmsVisible] = useState(false);
    const [date, setDate] = useState(null);
    const [customer, setCustomer] = useState("");
    const [code, setCode] = useState("");
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        getQueryPageMetrics(csrf_token).then(response => {
            if (response.status) {
                setMetrics(response.data);
            }
        }).catch((err) => {
            console.log(err);
            toast.current.show({
                severity: "error",
                summary: "Hata",
                detail: "Bir hata oluştu.Lütfen sayfayı yenileyin."
            });
        }).finally(() => {
            setLoading(false);

        })
        if (errors?.message) {
            toast.current.show({
                severity: "warn",
                summary: "Hata",
                detail: errors.message + ".Aranan Gönderi Kodu:" + errors.code
            });
        }
    }, []);
    const createSearchQuery = (value, type) => {
        if (String(value).trim().length > 2) {
            let query = "?" + type + "=" + String(value).trim();
            router.visit(route("packages.arama") + query);
        } else {
            toast.current.show({
                severity: "info",
                summary: "Hata",
                detail: "Arama yapabilmek için en az 3 karakter girmelisiniz.Şuanda " + String(value).trim().length + " karakter girdiniz."
            });
        }

    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Paket Sorgulama"
            info={[
                {
                    icon: "pi-cart-plus",
                    hidden: metrics.todayPackageCount === 0,
                    text: metrics.todayPackageCount === 0 ? "Bugün Paket Girişi Yapılmadı" : `${metrics.todayPackageCount} Paket Beklemede.Girişi Bekleniyor.`,
                },
                {
                    icon: "pi-box",
                    hidden: metrics.todayPackageCountPrepared === 0,
                    text: metrics.todayPackageCountPrepared === 0 ? "Bugün Paket Yapılmadı" : `Bugün ${metrics.todayPackageCountPrepared} Sipariş Paketlendi`,
                },
                {
                    icon: "pi-truck",
                    hidden: metrics.todayPackageCountShipped === 0,
                    text: metrics.todayPackageCountShipped === 0 ? "Bugün Paket Kargolanmadı" : `Bugün ${metrics.todayPackageCountShipped} Paket Kargolandı`,
                }, {
                    icon: "pi-envelope",
                    hidden: metrics.todaySendedMessagesCount === 0,
                    text: metrics.todaySendedMessagesCount === 0 ? "Bugün Mesaj Gönderilmedi" : `Bugün ${metrics.todaySendedMessagesCount} Mesaj Gönderildi`,
                },
            ]}
            buttons={[
                {
                    icon: "pi pi-plus",
                    tooltip: "Yeni Paket Girişi",
                    severity: "success",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    onClick: () => {
                        setVisible(true)
                    }
                },
                {
                    icon: "pi pi-users",
                    tooltip: "Müşterileri Görüntüle",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    severity: "info",
                    onClick: () => {
                        router.visit(route("customers.index"));
                    }
                },
                {
                    icon: "pi pi-send",
                    tooltip: "Yeni Mesaj Gönder",
                    severity: "warning",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    onClick: () => {
                        setSmsVisible(!smsVisible);
                    }
                }
            ]}
        >
            <Head title={"Paket Sorgulama"}/>
            <Toast ref={toast}/>
            <div className="py-6">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <BlockUI blocked={loading}
                                 template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                            <div className={"grid grid-cols-1 lg:grid-cols-3 gap-2 p-2"}>
                                <div>
                                    <p className={"font-semibold text-lg"}>Gönderi Koduna Göre</p>
                                    <InputText id="username" placeholder={"Gönderi Kodunu Giriniz"} className={"w-full"}
                                               value={code}
                                               onKeyDown={(e) => e.key === "Enter" && code.length > 0 && createSearchQuery(code, "code")}
                                               onChange={(e) => setCode(e.target.value)}/>
                                    <div className={"flex justify-end"}>
                                        <Button label={"Sorgula"} disabled={!String(code).trim().length > 0}
                                                tooltipOptions={{
                                                    position: "top"
                                                }} tooltip={"Arama Yapın"} icon={"pi pi-search"} severity={"success"}
                                                className={"mt-2"} size={"small"}
                                                onClick={() => createSearchQuery(code, "code")}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className={"font-semibold text-lg"}>Müşteri Bilgilerine Göre</p>
                                    <InputText id="username" placeholder={"Müşteri Bilgilerini Giriniz"}
                                               onKeyDown={(e) => e.key === "Enter" && customer.length > 0 && createSearchQuery(customer, "customer")}
                                               className={"w-full"} value={customer}
                                               onChange={(e) => setCustomer(e.target.value)}/>
                                    <div className={"flex justify-end"}>
                                        <Button label={"Sorgula"} disabled={!String(customer).trim().length > 0}
                                                tooltipOptions={{
                                                    position: "top"
                                                }}
                                                onClick={() => createSearchQuery(customer, "customer")}
                                                tooltip={"Arama Yapın"} icon={"pi pi-search"} severity={"success"}
                                                className={"mt-2"} size={"small"}/>
                                    </div>
                                </div>
                                <div>
                                    <p className={"font-semibold text-lg"}>Tarihe Göre</p>
                                    <div className={"flex justify-center"}>
                                        <CalendarComp value={date} setValue={setDate} onSearch={(value) => {
                                            createSearchQuery(value, "date")
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </BlockUI>
                        <MessageDialog csrf_token={csrf_token} visible={smsVisible} setVisible={setSmsVisible}
                                       auth={auth}/>
                        <PreCrate visible={visible} setVisible={setVisible} csrf_token={csrf_token} toast={toast}
                                  auth={auth}/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
