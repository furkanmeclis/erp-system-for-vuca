import {Head, router} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

import React, {useState, useRef, useEffect} from 'react';
import {classNames} from 'primereact/utils';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {InputText} from 'primereact/inputtext';
import {Image} from 'primereact/image';
import {Button} from 'primereact/button';
import {Tooltip} from "primereact/tooltip";
import {ConfirmPopup, confirmPopup} from 'primereact/confirmpopup';
import {Toolbar} from 'primereact/toolbar';
import {Dialog} from 'primereact/dialog';
import {Toast} from 'primereact/toast';
import {OverlayPanel} from 'primereact/overlaypanel';
import {Checkbox} from 'primereact/checkbox';
import Create from "@/Pages/Customers/Create.jsx";
import Update from "@/Pages/Customers/Update.jsx";
import {Avatar} from "primereact/avatar";
import {useLocalStorage} from "primereact/hooks"
import MessageDialog from "@/Components/MessageDialog.jsx";
import {getCustomers} from "@/helpers/helper.js";

export default function Index({auth, csrf_token, page = true}) {
    const [smsVisible, setSmsVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const toast = useRef(null);
    const op = useRef(null);
    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
        name: {value: null, matchMode: FilterMatchMode.CONTAINS},
        email: {value: null, matchMode: FilterMatchMode.CONTAINS},
        phone: {value: null, matchMode: FilterMatchMode.CONTAINS},
        city: {value: null, matchMode: FilterMatchMode.CONTAINS},
        district: {value: null, matchMode: FilterMatchMode.CONTAINS},
        address: {value: null, matchMode: FilterMatchMode.CONTAINS},
        created_at: {value: null, matchMode: FilterMatchMode.CONTAINS},
        updated_at: {value: null, matchMode: FilterMatchMode.CONTAINS},

    });

    const [loading, setLoading] = useState(true);
    const [loadingX, setLoadingX] = useState(false);
    const [loadingXC, setLoadingXC] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [updateWorker, setUpdateWorker] = useState({});
    const formRef = useRef();
    const formRefCreate = useRef();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getCustomers(csrf_token).then((response) => {
            if (response.status) {
                setUsers(response.data)
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Müşteriler yüklenirken bir hata oluştu.'
                })
            }
        }).catch((err) => {
            console.log(err);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Müşteriler yüklenirken bir hata oluştu.'
            })
        }).finally(() => setLoading(false));
    }, []);
    const columns = [
        'id',
        'name',
        'email',
        'phone',
        'city',
        'district',
        'address',
        'updated_at',
        'created_at',
        'actions'
    ];
    const columnsTurkishNames = {
        'id': 'ID',
        'name': 'Adı',
        'phone': 'Telefon',
        'email': 'Email',
        'address': 'Adresi',
        'city': 'Şehir',
        'district': 'İlçe',
        'updated_at': 'Güncellenme Tarihi',
        'created_at': 'Eklenme Tarihi',
        'actions': 'İşlemler'
    }
    const LocalStorageName = "ckymoto-customers-table-columns";
    const [selectedColumns, setSelectedColumns] = useLocalStorage([
        'id',
        'name',
        'email',
        'phone',
        'address',
        'updated_at',
        'created_at',
        'actions'
    ], LocalStorageName)
    const [updateModal, setUpdateModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const onGlobalFilterChange = (e, action = false) => {
        const value = action ? e : e.target.value;
        let _filters = {...filters};

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleCloseModal = () => {
        if (updateModal) {
            setUpdateModal(false);
        }
    };
    const handleCloseModalCreate = () => {
        if (createModal) {
            setCreateModal(false);
        }
    };
    const renderHeader = () => {
        return (
            <>
                <Toolbar start={() => <>
                    <Button icon="pi pi-bars" size={"small"} severity={"info"} tooltip={"Kolonları Yönet"}
                            tooltipOptions={{
                                position: 'top'
                            }} onClick={(event) => {
                        op.current.toggle(event);
                    }} className="mr-2"/>
                    {selectedUsers.length > 0 && (<>
                        <Button size={"small"}
                                icon="pi pi-times" className="p-button-warning mr-2"
                                onClick={() => setSelectedUsers([])} tooltip={"Seçimi Temizle"} tooltipOptions={{
                            position: 'top'
                        }}/>
                    </>)}
                </>}
                />
            </>
        );
    };
    const header = renderHeader();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formSubmittedC, setFormSubmittedC] = useState(false);
    const updateWorkerPrepare = (user) => {
        if (!updateModal) {
            setUpdateWorker(user);
            setUpdateModal(true);
        }
    };

    const TableContent = () => {
        return <>
            <Tooltip target=".custom-target-icon"/>
            <ConfirmPopup/>
            <Toast ref={toast}/>
            <OverlayPanel ref={op}>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3>Kolonları Yönet</h3>
                    </div>
                    <div className="flex flex-col">
                        {columns.map((column, index) => {
                            return <div key={index} className="flex my-1 items-center">
                                <Checkbox inputId={column} checked={selectedColumns.includes(column)} onChange={(e) => {
                                    let _selectedColumns = [...selectedColumns];
                                    if (e.checked) {
                                        _selectedColumns.push(column);
                                    } else {
                                        _selectedColumns = _selectedColumns.filter(col => col !== column);
                                    }
                                    setSelectedColumns(_selectedColumns);
                                }}/>
                                <label htmlFor={column} className="ml-2">{columnsTurkishNames[column]}</label>
                            </div>
                        })}
                        <div className="flex justify-end mt-4">
                            <Button label="Kaydet" severity={"success"} size={"small"} onClick={() => {
                                op.current.hide();
                            }}/>
                        </div>
                    </div>
                </div>
            </OverlayPanel>
            <DataTable value={users} removableSort paginator
                       filterDisplay="row"
                       paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                       rowsPerPageOptions={[5, 10, 25, 50]} rows={10} dataKey="id" filters={filters}
                       loading={loading}
                       globalFilterFields={['name', 'email', 'phone', 'address', 'city', 'district']}
                       header={header}
                       emptyMessage="Müşteri bulunamadı."
                       currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan">
                {selectedColumns.includes('id') && <Column field="id" sortable header="#"/>}
                {selectedColumns.includes('name') &&
                    <Column filter showFilterMenu={false} filterPlaceholder={"İsime Göre"} field="name" sortable
                            header="Adı"/>}
                {selectedColumns.includes('email') &&
                    <Column filter showFilterMenu={false} filterPlaceholder={"E-mail'e Göre"} field="email" sortable
                            header="Email"/>}
                {selectedColumns.includes('phone') &&
                    <Column filter showFilterMenu={false} filterPlaceholder={"Telefona Göre"} field="phone" sortable
                            header="Telefon No"/>}
                {selectedColumns.includes('city') &&
                    <Column filter showFilterMenu={false} filterPlaceholder={"Şehire Göre"} field="city" sortable
                            header="Şehir"/>}
                {selectedColumns.includes('district') &&
                    <Column filter showFilterMenu={false} filterPlaceholder={"İlçeye Göre"} field="district" sortable
                            header="İlçe"/>}
                {selectedColumns.includes('address') &&
                    <Column filter showFilterMenu={false} filterPlaceholder={"Adrese Göre"} field="address" sortable
                            header="Adresi"/>}
                {selectedColumns.includes('created_at') &&
                    <Column field="created_at" sortable header="Eklenme Tarihi" filter showFilterMenu={false}
                            filterPlaceholder={"Eklenme Tarihine Göre"}
                            body={(rowData) => new Date(rowData.created_at).toLocaleString()}/>}
                {selectedColumns.includes('updated_at') &&
                    <Column field="updated_at" sortable header="Güncellenme Tarihi" filter showFilterMenu={false}
                            filterPlaceholder={"Güncelleme Tarihine Göre"}
                            body={(rowData) => new Date(rowData.updated_at).toLocaleString()}/>}
                {selectedColumns.includes('actions') && <Column header="İşlemler" body={(user) => {
                    return <div className={"flex justify-center gap-x-2"}>
                        <Button icon="pi pi-send" size={"small"} tooltip={"Mesaj Gönder"} severity={"help"}
                                tooltipOptions={{
                                    position: 'top'
                                }} onClick={() => {
                            setSelectedCustomer({
                                id: user.id,
                                name: user.name,
                            });
                            setSmsVisible(true);
                        }}/>
                        <Button icon="pi pi-pencil" size={"small"} tooltip={"Müşteriyi Düzenle"}
                                tooltipOptions={{
                                    position: 'top'
                                }} severity={"warning"} onClick={() => {
                            updateWorkerPrepare(user);
                        }}/>
                        <Button icon="pi pi-trash" size={"small"} tooltip={"Müşteriyi Sil"} tooltipOptions={{
                            position: 'top'
                        }} onClick={(event) => {
                            confirmPopup({
                                target: event.currentTarget,
                                message: 'Müşteriyi silmek istediğinize emin misiniz?',
                                icon: 'pi pi-exclamation-triangle',
                                acceptClassName: 'p-button-danger',
                                accept: () => {
                                    fetch(route('customers.destroy', user.id), {
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
                                                setUsers(users.filter((u) => {
                                                    return u.id !== user.id;
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
                                    toast.current.show({
                                        severity: 'info',
                                        summary: 'İptal Edildi',
                                        detail: 'Silme işlemi iptal edildi.'
                                    });
                                },
                                acceptLabel: 'Sil',
                                rejectLabel: 'İptal'
                            })
                        }} severity={"danger"}/>
                    </div>
                }}/>}
            </DataTable>
            <Dialog header="Müşteriyi Düzenle" style={{width: '50vw'}} breakpoints={{'960px': '75vw', '641px': '100vw'}}
                    onHide={handleCloseModal} maximizable visible={updateModal} footer={<>
                <Button label="Vazgeç" icon="pi pi-times" size={"small"} link onClick={handleCloseModal}
                        loading={loadingX}/>
                <Button label="Kaydet" icon="pi pi-save" size={"small"} className="p-button-success" loading={loadingX}
                        onClick={() => {
                            setFormSubmitted(true);
                            formRef.current.click();
                        }}/>
            </>}>
                <Update updateModal={updateModal} user={updateWorker} csrf_token={csrf_token} toast={toast}
                        onHide={handleCloseModal} setUsers={setUsers} formRef={formRef}
                        setFormSubmitted={setFormSubmitted}
                        formSubmitted={formSubmitted} loading={loadingX} setLoading={setLoadingX} page={page}/>
            </Dialog>
            <Dialog header="Müşteri Ekle" style={{width: '50vw'}} breakpoints={{'960px': '75vw', '641px': '100vw'}}
                    onHide={handleCloseModalCreate} maximizable visible={createModal} footer={<>
                <Button label="Vazgeç" icon="pi pi-times" size={"small"} link onClick={handleCloseModalCreate}
                        loading={loadingXC}/>
                <Button label="Ekle" icon="pi pi-save" size={"small"} className="p-button-success" type={"button"}
                        loading={loadingXC}
                        onClick={() => {
                            setFormSubmittedC(true);
                            formRefCreate.current.click();
                        }}/>
            </>}>
                <Create csrf_token={csrf_token} toast={toast} formSubmitted={formSubmittedC}
                        onHide={handleCloseModalCreate} setUsers={setUsers} formRef={formRefCreate}/>
            </Dialog>
        </>
    }
    return <AuthenticatedLayout
        user={auth.user}
        header="Müşteri Yönetimi"
        info={[
            {
                icon: "pi-users",
                text: `Toplam ${users.length} Müşteri`
            },
            {
                icon: "pi-user-plus",
                text: `Bugün ${users.filter((user) => {
                    return new Date(user.created_at).toLocaleDateString() === new Date().toLocaleDateString()
                }).length} Müşteri Eklendi`,
            }
        ]}
        buttons={[
            {
                icon: "pi pi-plus",
                tooltip: "Yeni Müşteri Ekle",
                severity: "success",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                onClick: () => {
                    setCreateModal(true);
                }
            },
            {
                icon: "pi pi-users",
                tooltip: "Grupları Görüntüle",
                severity: "info",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                onClick: () => {
                    router.visit(route('groups.index'));
                }
            }, {
                icon: "pi pi-send",
                tooltip: "Yeni Mesaj Gönder",
                severity: "warning",
                tooltipOptions: {
                    position: "bottom"
                },
                size: "small",
                onClick: () => {
                    setSelectedCustomer(null);
                    setSmsVisible(!smsVisible);
                }
            }
        ]}
    >
        <Head title="Müşteriler"/>

        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <MessageDialog auth={auth} csrf_token={csrf_token} visible={smsVisible} setVisible={setSmsVisible}
                                   initialCustomer={selectedCustomer}/>
                    <TableContent/>
                </div>
            </div>
        </div>

    </AuthenticatedLayout>
}
