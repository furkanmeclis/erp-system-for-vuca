import React, {useEffect, useRef, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {Head, router} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {FilterMatchMode} from "primereact/api";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {confirmPopup} from "primereact/confirmpopup";
import MessageDialog from "@/Components/MessageDialog.jsx";
import PreCrate from "@/Pages/Package/PreCreate.jsx";
import {InputText} from "primereact/inputtext";
import {getTrackingCodeSetPackages} from "@/helpers/helper.js";


const TrackingCodeSet = ({auth, csrf_token, packagesAll}) => {
    const [visible, setVisible] = useState(false);
    const [smsVisible, setSmsVisible] = useState(false);
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState([]);
    useEffect(() => {
        getTrackingCodeSetPackages(csrf_token).then((response) => {
            if (response.status) {
                setPackages(response.data.map((u) => {
                    return {
                        ...u, city_district: u.city + " / " + u.district,
                        prepared_packer: u.prepared + " / " + u.packer
                    }
                }));
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: "Paketler Getirilirken Hata Oluştu."
                });
            }
        }).catch((err) => {
            console.error(err);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: "Paketler Getirilirken Hata Oluştu."
            });
        }).finally(() => setLoading(false));
    }, [])
    const [strings, setStrings] = useState({});
    const SetSenCodeElement = ({record}) => {
        const [trackingCode, setTrackingCode] = useState(record.tracking_code || "");
        const [loadingZ, setLoadingZ] = useState(false);
        const saveTrackingCode = () => {
            if (trackingCode === "") {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Hata',
                    detail: "Gönderi Kodu Boş Olamaz."
                });
                return;
            }
            if (trackingCode === record.tracking_code) {
                toast.current.show({
                    severity: 'info',
                    summary: 'Bilgi',
                    detail: "Gönderi Kodu Güncellenmedi.Değişiklik Yok."
                });
                return;
            }
            setLoadingZ(true);
            let formData = new FormData();
            formData.append('tracking_code', trackingCode);
            fetch(route('packages.trackingCodeSetStore', record.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                },
                body: formData
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: data.message
                    });
                    setPackages(data.packages.map((u) => {
                        return {...u, city_district: u.city + " / " + u.district,}
                    }));
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: data.message
                    });
                }
            }).catch((error) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: "CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."
                });
            }).finally(() => {
                setLoadingZ(false);
            })
        }
        return <div className="p-inputgroup flex-1">
            <InputText placeholder="Gönderi Kodu" disabled={loadingZ} value={trackingCode}
                       onChange={(e) => setTrackingCode(e.target.value)}/>
            <Button
                icon={"pi pi-" + ((trackingCode === record.tracking_code || trackingCode === "") ? "exclamation-circle" : "check")}
                onClick={saveTrackingCode} tooltip={"Gönderi Kodunu Güncelle"}
                disabled={trackingCode === record.tracking_code || trackingCode === ""} loading={loadingZ}
                severity={(trackingCode === record.tracking_code || trackingCode === "") ? "info" : "success"}/>
        </div>
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Gönderi Kodu Ayarla"
            info={[
                {
                    icon: "pi-exclamation-circle",
                    text: "Bu sayfada 'Paketlendi' statüsüne sahip olan tüm paketler ve 'Kargolandı' statüsüne sahip son 2 günlük paketler listelenmektedir."
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
                    },
                    loading,
                },
                {
                    icon: "pi pi-search",
                    tooltip: "Paket Sorgula",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    severity: "info",
                    onClick: () => {
                        router.visit(route("sorgulama"));
                    },
                    loading,
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
                        setSmsVisible(true)
                    },
                    loading,
                }
            ]}
        >
            <Head title={"Gönderi Kodu Ayarla"}/>
            <Toast ref={toast}/>
            <div className="py-6">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable value={packages} removableSort paginator
                                   filterDisplay="row"
                                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                   rowsPerPageOptions={[5, 10, 25, 50]} rows={10} dataKey="id" filters={{
                            name: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            email: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            phone: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            address: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            created_at: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            city_district: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            status: {value: null, matchMode: FilterMatchMode.CONTAINS},
                        }}
                                   loading={loading}
                                   header={<>
                                       <Toolbar start={() => <>
                                           <Button icon="pi pi-box" label={"Yeni Paketler"} loading={loading}
                                                   size={"small"}
                                                   severity={"info"} tooltip={"Yeni Paketler"}
                                                   tooltipOptions={{
                                                       position: 'top'
                                                   }} onClick={(event) => {
                                               router.visit(route("packages.index"));
                                           }} className="mr-2"/>
                                           <Button icon="pi pi-plus" label={"Yeni Paket Girişi"} loading={loading}
                                                   size={"small"}
                                                   severity={"success"} tooltip={"Yeni Paket Girişi"}
                                                   tooltipOptions={{
                                                       position: 'top'
                                                   }} onClick={(event) => {
                                               setVisible(true)
                                           }} className="mr-2"/>
                                       </>}
                                       />
                                   </>}
                                   emptyMessage="Paket bulunamadı."
                                   currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan">
                            <Column field="id" header="#" headerTooltip={"Veritabanı Kayıt Id"}/>
                            <Column field="name" filter showFilterMenu={false} filterPlaceholder={"Müşteri Adına Göre"}
                                    sortable={true} header="Müşteri Adı"></Column>
                            <Column field="phone" filter showFilterMenu={false}
                                    filterPlaceholder={"Telefon Numarasına Göre"} sortable={true}
                                    header="Telefon Numarası"></Column>
                            <Column field="city_district" filter showFilterMenu={false}
                                    filterPlaceholder={"İl/İlçe'ye Göre"}
                                    sortable={true} header="İl/İlçe"/>
                            <Column field="status" filter showFilterMenu={false}
                                    filterPlaceholder={"Statüye Göre"} sortable={true} header="Durumu"
                                    body={(record) => {
                                        if (record.status === "Paketlendi") {
                                            return <span className="p-tag p-tag-info">{record.status}</span>
                                        } else if (record.status === "Kargolandı") {
                                            return <>
                                                <span className="p-tag p-tag-success">{record.status}</span>
                                                {record.is_sms_sent === 0 && <><br/><span
                                                    className="p-tag p-tag-danger">Sms Gönderilemedi</span></>}
                                            </>
                                        }
                                    }}/>
                            <Column field="tracking_code" header="Gönderi Kodu"
                                    body={record => <SetSenCodeElement record={record}/>}/>
                            <Column field="updated_at" filter showFilterMenu={false}
                                    filterPlaceholder={"Güncellennme Tarihine Göre"} sortable={true}
                                    header="Güncellenme Tarihi"
                                    body={({updated_at}) => new Date(updated_at).toLocaleString()}/>
                            <Column header="İşlemler" body={(record) => {
                                return <div className={"flex justify-center gap-x-2"}>
                                    {(record.is_sms_sent === 0 && record.status === "Kargolandı") &&
                                        <Button icon={"pi pi-send"} size={"small"} tooltip={"Kargo Takip Sms'i Gönder"}
                                                tooltipOptions={{
                                                    position: 'top'
                                                }} severity={"help"} onClick={(event) => {
                                            return confirmPopup({
                                                target: event.currentTarget,
                                                message: "Kargo Takip Sms'i Göndermek İstediğinize Emin Misiniz?",
                                                icon: "pi pi-exclamation-triangle",
                                                acceptClassName: "p-button-help",
                                                acceptLabel: "Gönder",
                                                rejectLabel: "Vazgeç",
                                                accept: () => {
                                                    setLoading(true);
                                                    fetch(route('packages.sendSms', record.id), {
                                                        method: 'POST',
                                                        headers: {
                                                            'X-CSRF-TOKEN': csrf_token,
                                                        }
                                                    }).then((response) => {
                                                        return response.json();
                                                    }).then((data) => {
                                                        if (data.status) {
                                                            toast.current.show({
                                                                severity: 'success',
                                                                summary: 'Başarılı',
                                                                detail: data.message
                                                            });
                                                            setPackages(packages.map((u) => {
                                                                if (u.id === record.id) {
                                                                    u.is_sms_sent = 1;
                                                                }
                                                                return u;
                                                            }));
                                                        } else {
                                                            toast.current.show({
                                                                severity: 'error',
                                                                summary: 'Hata',
                                                                detail: data.message
                                                            });
                                                        }
                                                    }).catch((error) => {
                                                        toast.current.show({
                                                            severity: 'error',
                                                            summary: 'Hata',
                                                            detail: "CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."
                                                        });
                                                    }).finally(() => {
                                                        setLoading(false);
                                                    })
                                                }
                                            });
                                        }}/>}
                                    <Button icon="pi pi-trash" size={"small"} tooltip={"Paket Kaydını Sil"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"danger"} onClick={(event) => {
                                        let message = "Paketi silmek istediğinize emin misiniz?";
                                        if (record.status === "Kargolandı") {
                                            message = "Paket kargolandığı için silmek istediğinize emin misiniz?";
                                        }
                                        return confirmPopup({
                                            target: event.currentTarget,
                                            message: message,
                                            icon: "pi pi-exclamation-triangle",
                                            acceptClassName: "p-button-danger",
                                            acceptLabel: "Sil",
                                            rejectLabel: "Vazgeç",
                                            accept: () => {
                                                setLoading(true);
                                                fetch(route('packages.destroy', record.id), {
                                                    method: 'DELETE',
                                                    headers: {
                                                        'X-CSRF-TOKEN': csrf_token,
                                                    }
                                                }).then((response) => {
                                                    return response.json();
                                                }).then((data) => {
                                                    if (data.status) {
                                                        toast.current.show({
                                                            severity: 'success',
                                                            summary: 'Başarılı',
                                                            detail: data.message
                                                        });
                                                        setPackages(packages.filter((u) => {
                                                            return u.id !== record.id;
                                                        }));

                                                    } else {
                                                        toast.current.show({
                                                            severity: 'error',
                                                            summary: 'Hata',
                                                            detail: data.message
                                                        });
                                                    }
                                                }).catch((error) => {
                                                    toast.current.show({
                                                        severity: 'error',
                                                        summary: 'Hata',
                                                        detail: "CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."
                                                    });
                                                }).finally(() => {
                                                    setLoading(false);
                                                })
                                            }
                                        })
                                    }}/>
                                </div>
                            }}/>
                        </DataTable>
                    </div>
                </div>
            </div>

            <MessageDialog csrf_token={csrf_token} visible={smsVisible} setVisible={setSmsVisible} auth={auth}/>
            <PreCrate visible={visible} auth={auth} setVisible={setVisible} csrf_token={csrf_token} toast={toast}
                      onSave={(status, responsePackages) => {
                          if (status) {
                              router.visit(route("packages.index"));
                          }
                      }}

            />
        </AuthenticatedLayout>
    );
}
export default TrackingCodeSet;
