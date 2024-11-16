import {Head, router} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useState, useRef, useEffect} from 'react';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Image} from 'primereact/image';
import {Button} from 'primereact/button';
import {Tooltip} from "primereact/tooltip";
import {ConfirmPopup, confirmPopup} from 'primereact/confirmpopup';
import {Toolbar} from 'primereact/toolbar';
import {Toast} from 'primereact/toast';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Checkbox} from 'primereact/checkbox';
import {useLocalStorage} from "primereact/hooks"
import {Tag} from "primereact/tag";
import Create from "@/Pages/Users/Create.jsx";
import Update from "@/Pages/Users/Update.jsx";

export default function Index({auth, usersAll, csrf_token, roles}) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [createUser, setCreateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState(false);
    const [users, setUsers] = useState(usersAll);
    const header = (<>
        <Toolbar start={() => {
            return <>
                <Button icon={"pi pi-user-plus"} className={"mr-2"} tooltip={"Yeni Kullanıcı Ekle"} tooltipOptions={{
                    position: 'top'
                }} onClick={() => {
                    setCreateUser(true);
                }} severity={"success"}/>
                <Button icon="pi pi-refresh" severity={"info"} tooltip="Verileri Yenile" tooltipOptions={{
                    position: 'top'
                }} onClick={() => {
                    setLoading(true);
                    router.visit(route('users.index'));
                }}/>

            </>;
        }}/>
    </>);
    return <AuthenticatedLayout
        user={auth.user}
        header="Kullanıcı Yönetimi"
        info={[{
            text: `Toplamda ${users.length} Kullanıcı Var`, icon: "pi-users"
        }]}
        buttons={[{
            icon: "pi pi-user-plus", tooltip: "Yeni Kullanıcı Ekle", severity: "success", tooltipOptions: {
                position: "bottom"
            }, size: "small", onClick: () => {
                setCreateUser(true);
            }
        }]}
    >
        <Head title="Kullanıcılar"/>

        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <>
                        <ConfirmPopup/>
                        <Toast ref={toast}/>
                        <DataTable value={users} removableSort paginator
                                   filterDisplay="row"
                                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                   rowsPerPageOptions={[5, 10, 25, 50]} rows={10} dataKey="id"
                                   filters={{
                                       global: {value: null, matchMode: FilterMatchMode.CONTAINS},
                                       name: {value: null, matchMode: FilterMatchMode.CONTAINS},
                                       email: {value: null, matchMode: FilterMatchMode.CONTAINS},
                                       "role.label": {value: null, matchMode: FilterMatchMode.CONTAINS},
                                   }}
                                   loading={loading}
                                   globalFilterFields={['name', 'email', 'role']}
                                   header={header}
                                   emptyMessage="Kullanıcı bulunamadı."
                                   currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan">
                            <Column field="id" sortable header="#"/>
                            <Column filter showFilterMenu={false} filterPlaceholder={"İsime Göre"} field="name" sortable
                                    header="Adı"/>
                            <Column filter showFilterMenu={false} filterPlaceholder={"E-mail'e Göre"} field="email"
                                    sortable
                                    header="Email"/>
                            <Column filter showFilterMenu={false} filterPlaceholder={"Role Göre"} field="role.label"
                                    sortable
                                    header="Rol" body={({role}) => <Tag value={role.label} severity={role.severity}/>}/>
                            <Column field="created_at" sortable header="Eklenme Tarihi" filter showFilterMenu={false}
                                    filterPlaceholder={"Eklenme Tarihine Göre"}
                                    body={(rowData) => new Date(rowData.created_at).toLocaleString()}/>

                            <Column field="updated_at" sortable header="Güncellenme Tarihi" filter
                                    showFilterMenu={false}
                                    filterPlaceholder={"Güncelleme Tarihine Göre"}
                                    body={(rowData) => new Date(rowData.updated_at).toLocaleString()}/>
                            <Column header="İşlemler" body={(user) => {
                                return <div className={"flex justify-center gap-x-2"}>
                                    <Button icon="pi pi-pencil" size={"small"} tooltip={"Kullanıcıyı Düzenle"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"warning"} onClick={() => {
                                        if (user.role.role === "engineer" && (auth.user.role === "admin" || auth.user.role === "salesman" || auth.user.role === "worker")) {
                                            toast.current.show({
                                                severity: 'info',
                                                summary: 'Hata',
                                                detail: 'Yetkiniz Yok!'
                                            });
                                            return;
                                        }
                                        setSelectedUser(user);
                                        setUpdateUser(true);
                                    }}/>
                                    <Button icon="pi pi-trash" size={"small"} tooltip={"Kullanıcıyı Sil"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} onClick={(event) => {
                                        confirmPopup({
                                            target: event.currentTarget,
                                            message: 'Kullanıcıyı silmek istediğinize emin misiniz?',
                                            icon: 'pi pi-exclamation-triangle',
                                            acceptClassName: 'p-button-danger',
                                            accept: () => {
                                                setLoading(true)
                                                fetch(route('users.destroy', user.id), {
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
                                                        setTimeout(() => {
                                                            setUsers(users.filter((u) => {
                                                                return u.id !== user.id;
                                                            }));
                                                        }, 1000);

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
                                                });
                                            },
                                            acceptLabel: 'Sil',
                                            rejectLabel: 'İptal'
                                        })
                                    }} severity={"danger"}/>
                                </div>
                            }}/>
                        </DataTable>
                    </>
                    <Create auth={auth} csrf_token={csrf_token} toast={toast} visible={createUser}
                            onChange={(users_) => {
                                setUsers(users_);
                            }} setVisible={setCreateUser} roles={roles}/>
                    <Update user={selectedUser} auth={auth} csrf_token={csrf_token} toast={toast} visible={updateUser}
                            onChange={(users_) => {
                                setUsers(users_);
                            }} setVisible={setUpdateUser} roles={roles}/>
                </div>
            </div>
        </div>

    </AuthenticatedLayout>
}
