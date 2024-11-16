import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useEffect, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {InputText} from "primereact/inputtext";
import {MultiSelect} from 'primereact/multiselect';
import {Button} from "primereact/button";
import {BlockUI} from 'primereact/blockui';
import {Toast} from "primereact/toast";

const Create = ({auth, csrf_token}) => {
    const toast = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState("");
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const getCustomers = () => {
        fetch(route("customers.getListForSms"), {
            method: "POST",
            headers: {
                'X-CSRF-TOKEN': csrf_token
            }
        }).then(r => r.json()).then(({customers}) => {
            setCustomers(customers);
        }).catch((err) => {
            setCustomers([])
        });
    }
    useEffect(() => {
        getCustomers()
    }, []);
    const onSave = () => {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('customers', selectedCustomers.map(c => c.id).join(","));
        setLoading(true);
        fetch(route("groups.store"), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf_token
            },
            body: formData
        }).then(response => response.json()).then(data => {
            if (data.status) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: data.message
                });
                setSelectedCustomers(null);
                setName("");
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: data.message
                });
            }
        }).finally(() => {
            setLoading(false);
        });
    }
    return <Authenticated info={[
        {
            icon: "pi-clocks",
            text: ''
        }
    ]} header="Yeni Grup Oluştur" user={auth.user} buttons={[
        {
            size: "small",
            icon: "pi pi-arrow-left",
            tooltip: "Geri (Gruplar)",
            severity: "secondary",
            tooltipOptions: {
                position: "bottom"
            },
            onClick: () => {
                router.visit(route("groups.index"));
            }
        },
    ]}>
        <Head title="Yeni Grup Oluştur"/>
        <Toast ref={toast}/>
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">

                    <BlockUI blocked={loading}
                             template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                        <div
                            className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-fluid">
                            <div className={"mb-3"}>
                                <label htmlFor="name" className="font-bold">
                                    Grup Adı <span className={"font-semibold text-red-400"}>*</span>
                                </label>
                                <InputText id="name" type={"text"} name={"name"} value={name}
                                           onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className={"mb-3"}>
                                <label htmlFor="name" className="font-bold">
                                    Grup Üyeleri <span className={"font-semibold text-red-400"}>*</span>
                                </label>
                                <MultiSelect value={selectedCustomers} filter virtualScrollerOptions={{itemSize: 43}}
                                             selectedItemsLabel={`${selectedCustomers?.length} Müşteri Seçildi`}
                                             onChange={(e) => setSelectedCustomers(e.value)} options={customers}
                                             optionLabel="name"
                                             placeholder="Müşterileri Seçiniz" maxSelectedLabels={3}
                                             className="w-full md:w-20rem"/>
                            </div>
                            <div className={"mb-3 inline-flex"}>
                                <Button label={"Kaydet"} size={"small"} icon={"pi pi-save"}
                                        loading={loading}
                                        onClick={onSave}
                                        disabled={name.length === 0 || selectedCustomers === null || selectedCustomers?.length === 0}/>
                            </div>
                        </div>
                    </BlockUI>
                </div>
            </div>
        </div>
    </Authenticated>
}
export default Create;
