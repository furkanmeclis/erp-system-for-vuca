import {Toolbar} from 'primereact/toolbar';
import {Button} from "primereact/button";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Image} from "primereact/image";
import React, {useEffect, useRef} from "react";
import {Skeleton} from 'primereact/skeleton';
import {Head, router} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import PreCrate from "@/Pages/Package/PreCreate.jsx";
import {Toast} from "primereact/toast";

const Show = ({packageData, files, auth, csrf_token}) => {
    const [visible, setVisible] = React.useState(false);
    const [smsVisible, setSmsVisible] = React.useState(false);
    const toast = useRef(null);
    const packageDetails = [
        {field: 'recipientName', label: 'Alıcı Adı', value: packageData.name},
        {field: 'recipientPhone', label: 'Alıcı Telefon Numarası', value: packageData.phone},
        {field: 'recipientPhone', label: 'Alıcı İl', value: packageData.city},
        {field: 'recipientPhone', label: 'Alıcı İlçe', value: packageData.district},
        {field: 'recipientPhone', label: 'Alıcı Adresi', value: packageData.address},
        {field: 'trackingCode', label: 'Gönderi Kodu', value: packageData.tracking_code},
        {field: 'packagingDate', label: 'Paketlenme Tarihi', value: new Date(packageData.updated_at).toLocaleString()},
        {field: 'preparedBy', label: 'Giriş Yapan Personel', value: packageData.officer},
        {field: 'preparedBy', label: 'Hazırlayan Personel', value: packageData.prepared},
        {field: 'packedBy', label: 'Paketleyen Personel', value: packageData.packer},
        {field: 'boxCount', label: 'Koli Adedi', value: packageData.quantity + " Koli"},
        {field: 'note', label: 'Sipariş Notu', value: packageData.note}
    ];
    const Content = () => {
        return <>
            <div className="py-6">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    <div
                        className={!auth.logined && "bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"}>
                        {!auth.logined && <Toolbar className={"mb-3"} start={<div>
                            <img src={"/storage/images/logo.png"} alt={"CKYMOTO LOGO"} className={"w-56 h-auto"}/>
                        </div>} end={<div>
                            <Button label={"Kargo Takibi"} size={"small"} severity={"warning"} icon="pi pi-truck"
                                    onClick={() => {
                                        let url = "https://selfservis.yurticikargo.com/reports/SSWDocumentDetail.aspx?DocId=" + packageData.tracking_code;
                                        window.open(url, '_blank');
                                    }}/>
                        </div>}/>}
                        <Card title={"Paket Bilgileri"} className={"border my-3"}>
                            <DataTable value={packageDetails} className="p-datatable-striped" showGridlines>
                                <Column field="label" header="Bilgi"></Column>
                                <Column field="value" header="Değer" align={"right"}
                                        body={({value}) => <span className={"font-bold"}>{value}</span>}></Column>
                            </DataTable>

                        </Card>

                        <Accordion className={"mb-3"} hidden={!files.images.length > 0}>
                            <AccordionTab header={"Resimler (" + (files.images.length) + " Adet Resim)"}>
                                <div className={"grid grid-cols-2 gap-3 lg:grid-cols-3"}>
                                    {files.images.map((file, index) => {
                                        return <Image src={file} alt={"Resim"} loading={"lazy"} downloadable key={index}
                                                      preview className={"w-full h-full"}/>
                                    })}
                                </div>
                            </AccordionTab>
                        </Accordion>
                        <Accordion className={"my-3"} hidden={!files.videos.length > 0}>
                            <AccordionTab header={"Videolar (" + (files.videos.length) + " Adet Video)"}>
                                <div className={"grid grid-cols-2 gap-3 lg:grid-cols-3"}>
                                    {files.videos.map((file, index) => {
                                        return <video src={file} alt={"Video"} controls={true} autoPlay={false}
                                                      key={index} className={"w-full h-full"}/>
                                    })}
                                </div>
                            </AccordionTab>
                        </Accordion>
                        {!auth.logined && <Toolbar className={"my-3"} hidden={auth.logined} start={<div>
                            <img src={"/storage/images/logo.png"} alt={"CKYMOTO LOGO"} className={"w-56 h-auto"}/>
                        </div>} end={<div>
                            <Button label={"Müşteri Telefonu"} size={"small"} severity={"info"} icon="pi pi-phone"
                                    onClick={() => {
                                        window.location.href = "tel:" + packageData.phone;
                                    }}/>
                        </div>}/>}
                    </div>
                </div>
            </div>

        </>
    }
    return <>
        <Toast ref={toast}/>
        <Head title={"Paket Takibi - " + packageData.name}/>
        {auth.logined && <AuthenticatedLayout
            user={auth.user}
            header="Paket Detayları"
            info={[
                {
                    icon: "pi-user",
                    text: "Müşteri : "+packageData.name,
                },
                {
                    icon: "pi-phone",
                    text: packageData.phone,
                },
                {
                    icon:"pi-calendar",
                    text:new Date(packageData.updated_at).toLocaleString()
                }
            ]}
            buttons={[
                {
                    icon:"pi pi-phone",
                    tooltip:"Müşteri Telefonu",
                    severity:"info",
                    tooltipOptions:{
                        position:"bottom"
                    },
                    size:"small",
                    onClick:()=>{
                        window.location.href = "tel:"+packageData.phone;
                    }
                },
                {
                    icon: "pi pi-truck",
                    tooltip: "Kargo Takibi",
                    className:packageData.tracking_code?"":"p-disabled",
                    severity: "help",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    onClick: () => {
                        let url = "https://selfservis.yurticikargo.com/reports/SSWDocumentDetail.aspx?DocId=" + packageData.tracking_code;
                        window.open(url, '_blank');
                    }
                },

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
            ]}
        >
            <Content/>
            <PreCrate visible={visible} setVisible={setVisible} csrf_token={csrf_token} toast={toast} auth={auth}/>
        </AuthenticatedLayout>}
        {!auth.logined && <Content/>}
    </>
}
export default Show;
