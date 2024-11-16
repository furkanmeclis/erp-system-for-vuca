import {Head, router} from "@inertiajs/react";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import CalendarComp from "@/Components/CalendarComp.jsx";
import MessageDialog from "@/Components/MessageDialog.jsx";
import PreCrate from "@/Pages/Package/PreCreate.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useEffect} from "react";
import {FilterMatchMode} from "primereact/api";
import {Toolbar} from "primereact/toolbar";
import {Column} from "primereact/column";
import {confirmPopup} from "primereact/confirmpopup";
import {DataTable} from "primereact/datatable";

const Search = ({auth,csrf_token,parameter,searched,packagesAll}) => {
    const [packages, setPackages] = React.useState(packagesAll);
    const toast = React.useRef(null);
    const [smsVisible, setSmsVisible] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setPackages(packages_new => {
            return packages_new.map((item) => ({
                ...item,
                city_district: item.city + " / " + item.district,
                prepared_packer: item.prepared + " / " + item.packer
            }))
        })
    }, []);
    return <AuthenticatedLayout
        user={auth.user}
        header="Paket Sorgulama"
        info={[
            {
                icon:"pi-filter",
                text:(parameter === "date"?"Tarihe Göre Filtrelendi:":"Müşteri Adına Göre Filtrelendi : ")+searched,
            },
            {
                icon:"pi-folder",
                text:"Toplam "+packages.length+" Kayıt Bulundu."
            }
        ]}
        buttons={[
            {
                icon: "pi pi-arrow-left",
                tooltip: "Geri Dön",
                severity: "secondary",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                onClick: () => {
                    router.visit(route("sorgulama"));
                }
            },{
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
                                       <Button icon="pi pi-sync" label={"Yeniden Yükle"} loading={loading}
                                               size={"small"}
                                               severity={"help"} tooltip={"Yeniden Yükle"}
                                               tooltipOptions={{
                                                   position: 'top'
                                               }} onClick={(event) => {
                                           router.visit(route("packages.arama")+"?"+parameter+"="+searched);
                                       }} className="mr-2"/>
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
                                    if (record.status === "Beklemede") {
                                        return <span className="p-tag p-tag-contrast">{record.status}</span>
                                    }else if (record.status === "Paketlendi") {
                                        return <span className="p-tag p-tag-info">{record.status}</span>
                                    } else if (record.status === "Kargolandı") {
                                        return <>
                                            <span className="p-tag p-tag-success">{record.status}</span>
                                            {record.is_sms_sent === 0 && <><br/><span
                                                className="p-tag p-tag-danger">Sms Gönderilemedi</span></>}
                                        </>
                                    }
                                }}/>
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
                                <Button icon={"pi pi-eye"} size={"small"} tooltip={"Paketi Görüntüle"} tooltipOptions={{
                                    position: 'top'
                                }} severity={"info"} onClick={() => {
                                    router.visit(route('packages.show', record.record_id));
                                }}/>
                                <Button icon={"pi pi-external-link"} size={"small"} tooltip={"Yeni Sekmede Görüntüle"} tooltipOptions={{
                                    position: 'top'
                                }} severity={"help"} onClick={() => {
                                    window.open(route('packages.show', record.record_id), '_blank');
                                }}/>
                                <Button icon="pi pi-trash" size={"small"} tooltip={"Paket Kaydını Sil"}
                                        tooltipOptions={{
                                            position: 'top'
                                        }} severity={"danger"} onClick={(event) => {
                                    let message = "Paketi silmek istediğinize emin misiniz?";
                                    if(record.status === "Kargolandı"){
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
                    <MessageDialog csrf_token={csrf_token} visible={smsVisible} setVisible={setSmsVisible} auth={auth} />
                    <PreCrate visible={visible} setVisible={setVisible} csrf_token={csrf_token} toast={toast} auth={auth} />
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}
export default Search;
