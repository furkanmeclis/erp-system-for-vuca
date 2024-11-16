import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import React, {useEffect, useRef, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {Toast} from "primereact/toast";
import {FilterMatchMode} from "primereact/api";
import {getGroups} from "@/helpers/helper.js";

const Index = ({auth, csrf_token}) => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    useEffect(() => {
        getGroups(csrf_token).then((response) => {
            if (response.status) {
                setGroups(response.data)
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Gruplar yüklenirken bir hata oluştu.'
                })
            }
        }).catch((err) => {
            console.log(err);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Gruplar yüklenirken bir hata oluştu.'
            })
        }).finally(() => setLoading(false));
    }, [])
    return <Authenticated info={[
        {
            icon: "pi-users",
            text: `Toplam ${groups.length} Grup`
        }
    ]} header="Gruplar" user={auth.user} buttons={[
        {
            size: "small",
            icon: "pi pi-plus",
            tooltip: "Grup Oluştur",
            severity: "info",
            tooltipOptions: {
                position: "bottom"
            },
            onClick: () => {
                router.visit(route("groups.create"));
            }
        },
    ]}>
        <Head title="Gruplar"/>
        <Toast ref={toast}/>
        <ConfirmPopup/>
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <DataTable value={groups} removableSort paginator emptyMessage="Grup bulunamadı."
                                   filters={{
                                       name: {value: null, matchMode: FilterMatchMode.CONTAINS}
                                   }}
                                   loading={loading}
                                   filterDisplay={"row"}
                                   currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                   rowsPerPageOptions={[5, 10, 25, 50]} rows={10} dataKey="id">
                            <Column field="name" header="Grup Adı" filter
                                    filterPlaceholder={"Grup Adına Göre Filtreleyin"} showFilterMenu={false}
                                    showAddButton sortable></Column>
                            <Column field="membersCount" header="Üye Sayısı" sortable></Column>
                            <Column field="actions" header="İşlemler" body={(group) => {
                                return <div className={"flex justify-end gap-x-2"}>
                                    <Button size={"small"} icon={"pi pi-send"} severity={"info"}
                                            tooltip={"Gruba Mesaj Gönder"} tooltipOptions={{
                                        position: "top"
                                    }} onClick={() => {
                                        router.visit(route('groups.show', group.id));
                                    }}/>
                                    <Button size={"small"} icon={"pi pi-pencil"} severity={"warning"}
                                            tooltip={"Grubu Düzenle"} tooltipOptions={{
                                        position: "top"
                                    }} onClick={() => {
                                        router.visit(route('groups.edit', group.id));
                                    }}/>

                                    <Button size={"small"} icon={"pi pi-trash"} severity={"danger"}
                                            tooltip={"Grubu Sil"} tooltipOptions={{
                                        position: "top"
                                    }} onClick={(event) => {
                                        confirmPopup({
                                            target: event.currentTarget,
                                            message: 'Grubu silmek istediğinize emin misiniz?',
                                            icon: 'pi pi-exclamation-triangle',
                                            acceptClassName: 'p-button-danger',
                                            accept: () => {
                                                fetch(route('groups.destroy', group.id), {
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
                                                        setTimeout(() => {
                                                            setGroups(groups.filter((u) => {
                                                                return u.id !== group.id;
                                                            }));
                                                        }, 1000)

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
                                                })
                                            },
                                            reject: () => {
                                            },
                                            acceptLabel: 'Sil',
                                            rejectLabel: 'İptal'
                                        })
                                    }}/>
                                </div>
                            }}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </Authenticated>
}
export default Index;
