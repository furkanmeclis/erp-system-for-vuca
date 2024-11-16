import {Head, router} from "@inertiajs/react";
import MessageDialog from "@/Components/MessageDialog.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import PreCrate from "@/Pages/Package/PreCreate.jsx";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {FilterMatchMode} from "primereact/api";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {getNewPackages} from "@/helpers/helper.js";

const NewPackages = ({auth, csrf_token}) => {
    const [visible, setVisible] = useState(false);
    const [smsVisible, setSmsVisible] = useState(false);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);
    useEffect(() => {
        getNewPackages(csrf_token).then((response) => {
            if (response.status) {
                setPackages(response.data.map((u) => {
                    return {
                        ...u, city_district: u.city + " / " + u.district,
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
    return (<AuthenticatedLayout
            user={auth.user}
            header="Yeni Paketler"
            info={[{
                icon: "pi-exclamation-circle",
                text: "Bu sayfada sadece 'Beklemede' yani yeni giriş yapılmış olan paketleri görebilirsiniz.",
            }, {
                icon: "pi-box", text: packages.length + " Adet Paket Beklemede",
            },]}
            buttons={[{
                icon: "pi pi-plus",
                tooltip: "Yeni Paket Girişi",
                className: auth.user.role === "worker" && "hidden",
                severity: "success",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                onClick: () => {
                    setVisible(true)
                },
                loading,
            }, {
                icon: "pi pi-search",
                tooltip: "Paket Sorgula",
                className: auth.user.role === "worker" && "hidden",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                severity: "info",
                onClick: () => {
                    router.visit(route("sorgulama"));
                },
                loading,
            }, {
                icon: "pi pi-send",
                tooltip: "Yeni Mesaj Gönder",
                className: auth.user.role === "worker" && "hidden",
                severity: "warning",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                onClick: () => {
                    setSmsVisible(true)
                },
                loading,
            }]}
        >
            <Head title={"Paket Ekle"}/>
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
                        }}
                                   loading={loading}
                                   header={<>

                                       <Toolbar start={() => <>
                                           {auth.user.role !== "worker" &&
                                               <Button icon="pi pi-plus" label={"Yeni Paket Girişi"} loading={loading}
                                                       size={"small"}
                                                       severity={"success"} tooltip={"Yeni Paket Girişi"}
                                                       tooltipOptions={{
                                                           position: 'top'
                                                       }} onClick={(event) => {
                                                   setVisible(true)
                                               }} className="mr-2"/>}
                                       </>} center={() => <>{auth.user.role === "worker" &&
                                           <h2 className="text-lg font-semibold">Yeşil Buton İle Veri Girişi
                                               Yapabilirsiniz</h2>}</>}
                                       />
                                   </>}
                                   emptyMessage="Paket bulunamadı."
                                   currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan">
                            <Column field="id" body={(record) => <Button icon="pi-id-card pi" size={"small"}
                                                                         tooltip={"Paket'e Veri Girişi"}
                                                                         tooltipOptions={{
                                                                             position: 'top'
                                                                         }} severity={"success"} onClick={(event) => {
                                router.visit(route("packages.create", {id: record.id}));
                            }}/>}></Column>
                            <Column field="name" filter showFilterMenu={false} filterPlaceholder={"Müşteri Adına Göre"}
                                    sortable={true} header="Müşteri Adı"></Column>
                            <Column field="phone" filter showFilterMenu={false}
                                    filterPlaceholder={"Telefon Numarasına Göre"} sortable={true}
                                    header="Telefon Numarası"></Column>
                            <Column field="city_district" filter showFilterMenu={false}
                                    filterPlaceholder={"İl/İlçe'ye Göre"}
                                    sortable={true} header="İl/İlçe"/>
                            <Column field="created_at" filter showFilterMenu={false}
                                    filterPlaceholder={"Eklenme Tarihine Göre"} sortable={true}
                                    header="Eklenme Tarihi"
                                    body={({created_at}) => new Date(created_at).toLocaleString()}/>
                            <Column header="İşlemler" body={(record) => {
                                return <div className={"flex justify-center gap-x-2"}>
                                    <Button icon="pi-id-card pi" size={"small"} tooltip={"Paket'e Veri Girişi"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"success"} onClick={(event) => {
                                        router.visit(route("packages.create", {id: record.id}));
                                    }}/>
                                    <Button icon="pi pi-trash" size={"small"} tooltip={"Paket Kaydını Sil"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"danger"} onClick={(event) => {
                                        return confirmPopup({
                                            target: event.currentTarget,
                                            message: "Paketi silmek istediğinize emin misiniz?",
                                            icon: "pi pi-exclamation-triangle",
                                            acceptClassName: "p-button-danger",
                                            acceptLabel: "Sil",
                                            rejectLabel: "Vazgeç",
                                            accept: () => {
                                                setLoading(true);
                                                fetch(route('packages.destroy', record.id), {
                                                    method: 'DELETE', headers: {
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
                                                            severity: 'error', summary: 'Hata', detail: data.message
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
            <PreCrate visible={visible} setVisible={setVisible} csrf_token={csrf_token} toast={toast} auth={auth}
                      onSave={(status, responsePackages) => {
                          if (status) {
                              setPackages(responsePackages.map((item) => ({
                                  ...item, city_district: item.city + " / " + item.district
                              })));
                          }
                      }}/>
        </AuthenticatedLayout>);
}
export default NewPackages
