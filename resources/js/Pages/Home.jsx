import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, router} from '@inertiajs/react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import MessageDialog from "@/Components/MessageDialog.jsx";
import PreCrate from "@/Pages/Package/PreCreate.jsx";
import React, {useEffect, useState} from "react";
import {Toast} from "primereact/toast";
import {ProgressBar} from "primereact/progressbar";
import {Chip} from "primereact/chip";
import {Tag} from "primereact/tag";
import CurrencyUpdate from "@/Components/CurrencyUpdate.jsx";
import {BlockUI} from "primereact/blockui";
import {getStatsData} from "@/helpers/helper.js";

export default function Home({auth, csrf_token, sms}) {
    const [loading, setLoading] = React.useState(true);
    const [space, setSpace] = React.useState(null);
    const [counts, setCounts] = React.useState(null);
    const [password, setPassword] = React.useState("");
    const toast = React.useRef(null);
    const [smsVisible, setSmsVisible] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const createModal = useState(false);
    useEffect(() => {
        getStatsData(csrf_token).then(({status, data}) => {
            if (status) {
                setSpace(data.space);
                setCounts(data.counts);
                setPassword(data.password);
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Veriler yüklenirken bir hata oluştu.',
                    life: 3000
                });
            }
        }).catch(err => {
            console.error(err);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Veriler yüklenirken bir hata oluştu.',
                life: 3000
            });
        }).finally(() => {
            setLoading(false);

        })
    }, []);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={"Anasayfa"}

        >
            <Head title={"Anasayfa"}/>
            <Toast ref={toast}/>
            <div className="py-6">
                <div className="max-w-[85rem] mx-auto sm:px-6 lg:px-8">
                    <BlockUI blocked={loading}
                             template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                        {!loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <Card title={"Paketler"}
                                  subTitle={<><i className="pi pi-folder-open"></i> {counts.packages} Adet Paket</>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Yeni Paket Ekle" icon="pi pi-cart-plus" size={"small"}
                                            className="p-button-success" onClick={() => {
                                        setVisible(!visible);

                                    }}/>
                                    <Button label="Paketler" icon="pi pi-folder-open" size={"small"}
                                            className="p-button-info"
                                            onClick={() => {
                                                router.visit(route('packages.index'))

                                            }}/>
                                </div>
                            </Card>
                            <Card title={"Müşteriler"}
                                  subTitle={<><i className="pi pi-users"></i> {counts.customers} Adet Müşteri</>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Yeni Müşteri Ekle" icon="pi pi-user-plus" size={"small"}
                                            onClick={() => createModal[1](true)}
                                            className="p-button-success"/>
                                    <Button label="Müşteriler" icon="pi pi-users"
                                            onClick={() => router.visit(route('customers.index'))} size={"small"}
                                            className="p-button-info"/>
                                </div>
                            </Card>
                            <Card title={"Gruplar"}
                                  subTitle={<><i className="pi pi-users"></i> {counts.groups} Adet Grup</>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Yeni Grup Ekle" icon="pi pi-user-plus" size={"small"}
                                            onClick={() => router.visit(route('groups.create'))}
                                            className="p-button-success"/>
                                    <Button label="Gruplar" icon="pi pi-users"
                                            onClick={() => router.visit(route('groups.index'))} size={"small"}
                                            className="p-button-info"/>
                                </div>
                            </Card>
                            <Card title={"Ürünler"}
                                  subTitle={<><i className="pi pi-box"></i> {counts.products} Adet Ürün</>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Yeni Ürün Ekle" icon="pi pi-plus-circle" size={"small"}
                                            onClick={() => router.visit(route('products.index'))}
                                            className="p-button-success"/>
                                    <Button label="Ürünler" icon="pi pi-box"
                                            onClick={() => router.visit(route('products.index'))} size={"small"}
                                            className="p-button-info"/>
                                </div>
                            </Card>
                            <Card title={"Katalog"}
                                  subTitle={<><i className={"pi pi-key"}></i> Katalog Şifresi : <b>{password}</b></>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Katalog(Firma İçi)" icon="pi pi-images" size={"small"}
                                            onClick={() => router.visit(route('products.katalog'))}
                                            className="p-button-success"/>
                                    <Button label="Katalog" icon="pi pi-external-link"
                                            onClick={() => router.visit(route('home'))} size={"small"}
                                            className="p-button-info"/>
                                </div>
                            </Card>
                            <Card title={"Araçlar"}
                                  subTitle={<><i className={"pi pi-file-excel"}></i> Excel Çıktısı Verir.</>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Ideasoft" icon="pi pi-file-excel" size={"small"}
                                            onClick={() => {
                                                fetch(route("export.ideasoft"), {
                                                    method: 'GET',
                                                    headers: {
                                                        'X-CSRF-TOKEN': csrf_token,
                                                    },
                                                }).then(response => {
                                                    return response.blob()
                                                }).then(blob => {
                                                    const url = window.URL.createObjectURL(new Blob([blob]));
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    let randomFileName = Math.random().toString(36).substring(7);
                                                    link.setAttribute('download', randomFileName + `_ideasoft.xls`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.parentNode.removeChild(link);
                                                }).catch((error) => console.error(error))
                                            }}
                                            className="p-button-success"/>
                                    <Button label="Logo" icon="pi pi-file-excel"
                                            onClick={() => {
                                                fetch(route("export.logo"), {
                                                    method: 'GET',
                                                    headers: {
                                                        'X-CSRF-TOKEN': csrf_token,
                                                    },
                                                }).then(response => {
                                                    return response.blob()
                                                }).then(blob => {
                                                    const url = window.URL.createObjectURL(new Blob([blob]));
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    let randomFileName = Math.random().toString(36).substring(7);
                                                    link.setAttribute('download', randomFileName + `_logo.xls`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.parentNode.removeChild(link);
                                                }).catch((error) => console.error(error))
                                            }}
                                            size={"small"}
                                            className="p-button-info"/>
                                </div>
                            </Card>

                            <Card title={"Disk Kullanımı"}
                                  subTitle={`% ${space.percentageUsed} - Boş : ${space.freeSpace}`}>
                                <ProgressBar value={space.percentageUsed} displayValueTemplate={(value) => <>
                                    {space.usedSpace} / {space.totalSpace}
                                </>}
                                             color={space.percentageUsed > 75 ? (space.percentageUsed > 85 ? "var(--red-500)" : "var(--orange-500)") : "var(--green-500)"}/>
                            </Card>
                            <Card title={"Bildirim Servisi"}
                                  subTitle={<><i className={"pi pi-mobile"}></i> Kayıtlı Cihaz Sayısı
                                      : <b>{counts.deviceTokens}</b></>}>
                                <div className={"flex justify-between gap-x-2"}>
                                    <Button label="Bildirim Gönder" icon="pi pi-bell" size={"small"}
                                            onClick={() => setSmsVisible(true)}
                                            className="p-button-success"/>
                                </div>
                            </Card>
                            {sms && <Card title={"SMS Servisi"}
                                          subTitle={`${sms?.data?.company_name} (${sms?.data?.username})`}>
                                <Tag value={"Kalan SMS"} severity={"success"} icon={"pi pi-envelope"}
                                     className={"mr-2"}/>
                                <Tag value={`${sms?.data?.credit} Kredi`} severity={"info"} icon={"pi pi-send"}/>

                            </Card>}
                            {(auth.user.role === "admin" || auth.user.role === "engineer") &&
                                <CurrencyUpdate csrf_token={csrf_token}/>}
                        </div>}
                    </BlockUI>
                </div>
            </div>
            <MessageDialog csrf_token={csrf_token} visible={smsVisible} setVisible={setSmsVisible} auth={auth} initialOpened={"bell"}/>
            <PreCrate visible={visible} setVisible={setVisible} csrf_token={csrf_token} toast={toast} auth={auth}
                      create={createModal}/>
        </AuthenticatedLayout>
    );
}
