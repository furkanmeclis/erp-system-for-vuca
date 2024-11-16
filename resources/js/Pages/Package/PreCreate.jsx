import React, {useEffect, useRef, useState} from "react";
import {Sidebar} from 'primereact/sidebar';
import {Dropdown} from "primereact/dropdown";
import {Accordion, AccordionTab} from "primereact/accordion";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Update from "@/Pages/Customers/Update.jsx";
import CreateCustomer from "@/Pages/Customers/Create.jsx";
import {BlockUI} from "primereact/blockui";

const PreCreate = ({
                       visible, setVisible, csrf_token, toast, onSave = null, auth, create = useState(false)
                   }) => {
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const getCustomers = (id = null) => {
        let formData = new FormData();
        formData.append("detail", 1);
        fetch(route("customers.getListForSms"), {
            method: "POST",
            headers: {
                'X-CSRF-TOKEN': csrf_token
            },
            body: formData
        }).then(r => r.json()).then(({customers}) => {
            if (id) {
                setSelectedCustomer(customers.find(customer => customer.id === id));
            }
            setCustomers(customers);
        }).catch((err) => {
            setCustomers([])
        });
    }
    useEffect(() => {
        if (visible) {
            if (["admin", "salesman", "engineer"].includes(auth?.user?.role)) {
                getCustomers();
            } else {
                toast.current.show({severity: 'warn', summary: 'Hata', detail: 'Yetkisiz Erişim'});
                setVisible(false);
            }
        }
    }, [visible]);
    const [updateModal, setUpdateModal] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const formRef = useRef(null);
    let createModal = create[0];
    let setCreateModal = create[1];

    const [formSubmittedCreate, setFormSubmittedCreate] = useState(false);
    const formRefCreate = useRef(null);
    const handleCloseModalCreate = () => {
        if (createModal) {
            setCreateModal(false);
        }
    }
    const handleCloseModal = () => {
        if (updateModal) {
            setUpdateModal(false);
        }
    };
    const onSubmit = () => {
        if (selectedCustomer === null) {
            toast.current.show({severity: 'warn', summary: 'Hata', detail: 'Müşteri Seçimi Zorunludur.'});
            return;
        } else {
            setLoading(true)
            let formData = new FormData();
            formData.append("customer_id", selectedCustomer.id);
            if (onSave !== null) {
                formData.append("onSave", "true");
            }
            fetch(route("packages.preCreate"), {
                method: "POST",
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                body: formData
            }).then(r => r.json()).then((response) => {
                let {status, message} = response;
                setLoading(false)
                if (status) {
                    toast.current.show({severity: "success", summary: "Başarılı", detail: message});
                    setSelectedCustomer(null);
                    setVisible(false);
                    if (onSave !== null) {
                        onSave(true, response.packages);
                    }
                } else {
                    if (onSave !== null) {
                        onSave(false, null);
                    }
                    toast.current.show({severity: "error", summary: "Hata", detail: message});
                }
            }).catch((err) => {
                if (onSave !== null) {
                    onSave(false, null);
                }
                setLoading(false)
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: "CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."
                });
            });
        }
    }
    return <>
        <Sidebar visible={visible} onHide={() => setVisible(false)} position={"right"}
                 header={<div className="font-medium text-xl text-900 py-3 sm:py-0">Yeni Paket Girişi</div>}
                 className="w-full md:w-[20rem] lg:w-[30rem]">

            <div className={"min-h-full relative"}>
                <BlockUI blocked={loading}
                         template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                    <div className="p-fluid">
                        <div className={"mb-3"}>
                            <label htmlFor="name" className="font-bold">
                                Müşteri Seçimi <span className={"font-semibold text-red-400"}>*</span>
                            </label>
                            <Dropdown value={selectedCustomer} filter
                                      virtualScrollerOptions={{itemSize: 43}}
                                      onChange={(e) => {
                                          setSelectedCustomer(e.value);
                                      }} options={customers}
                                      checkmark={true}
                                      optionLabel="name"
                                      placeholder="Müşteriyi Seçiniz"
                                      className="w-full md:w-20rem"/>
                        </div>
                        {selectedCustomer !== null && <Accordion className={"mb-3"}>
                            <AccordionTab
                                header={"Müşteri Bilgileri " + (selectedCustomer !== null ? "(Seçili)" : "(Seçilmedi)")}>
                                <div className={"grid grid-cols-1 gap-3"}>
                                    <div>
                                        <label htmlFor="name" className="font-bold">
                                            Müşteri Adı <span
                                            className={"font-semibold text-red-400"}>*</span>
                                        </label>
                                        <InputText id="name" type={"text"} name={"name"} value={selectedCustomer.name}
                                                   readOnly disabled/>
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="font-bold">
                                            Müşteri Telefonu <span
                                            className={"font-semibold text-red-400"}>*</span>
                                        </label>
                                        <InputText id="phone" type={"tel"} name={"phone"}
                                                   value={selectedCustomer.phone}
                                                   readOnly disabled
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="font-bold">
                                            Müşteri Adresi <span
                                            className={"font-semibold text-red-400"}>*</span>
                                        </label>
                                        <InputText id="address" type={"text"} name={"address"}
                                                   value={selectedCustomer.address}
                                                   readOnly disabled
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="font-bold">
                                            Müşteri İl <span
                                            className={"font-semibold text-red-400"}>*</span>
                                        </label>
                                        <InputText id="city" type={"text"} name={"city"} value={selectedCustomer.city}
                                                   readOnly disabled
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="district" className="font-bold">
                                            Müşteri İlçe <span
                                            className={"font-semibold text-red-400"}>*</span>
                                        </label>
                                        <InputText id="district" type={"text"} name={"district"}
                                                   value={selectedCustomer.district}
                                                   readOnly disabled
                                        />
                                    </div>
                                </div>
                            </AccordionTab>
                        </Accordion>}
                    </div>
                </BlockUI>
                <div className="absolute bottom-10 left-0 right-0">
                    <div className={"border-b border-black py-3 mb-3"}>
                        {selectedCustomer &&
                            <Button label={"Müşteriyi Düzenle"} size={"small"} icon={"pi pi-pencil"}
                                    type={"button"}
                                    severity={"warning"}
                                    loading={loading}
                                    className={"mr-2"}
                                    onClick={() => {
                                        setUpdateModal(true);
                                    }}/>}
                        <Button label={"Müşteri Ekle"} size={"small"} icon={"pi pi-user-plus"}
                                type={"button"}
                                severity={"help"}
                                loading={loading}
                                onClick={() => {
                                    setCreateModal(true);
                                }}/>
                    </div>
                    <div>
                        <Button label={"Paket Girişi Yap"} size={"small"} icon={"pi pi-check"}
                                type={"button"}
                                severity={"success"}
                                loading={loading}
                                onClick={() => {
                                    onSubmit();
                                }}/>
                    </div>
                </div>
            </div>
            <>
                <Dialog header="Müşteriyi Düzenle" style={{width: '50vw'}}
                        breakpoints={{'960px': '75vw', '641px': '100vw'}}
                        onHide={handleCloseModal} maximizable visible={updateModal} footer={<>
                    <Button label="Vazgeç" icon="pi pi-times" size={"small"} link onClick={handleCloseModal}
                            loading={loading}/>
                    <Button label="Kaydet" icon="pi pi-save" size={"small"} className="p-button-success"
                            loading={loading}
                            onClick={() => {
                                setFormSubmitted(true);
                                formRef.current.click();
                            }}/>
                </>}>
                    <Update updateModal={updateModal} user={selectedCustomer} csrf_token={csrf_token}
                            toast={toast}
                            onHide={handleCloseModal} setUsers={() => {
                    }} onSave={(status, user) => {
                        if (status) {
                            getCustomers(user.id);
                            setUpdateModal(status);
                        }
                    }} formRef={formRef} setFormSubmitted={setFormSubmitted}
                            formSubmitted={formSubmitted} loading={loading} setLoading={setLoading}
                            page={true}/>
                </Dialog>

            </>
        </Sidebar>
        <Dialog header="Müşteri Ekle" style={{width: '50vw'}}
                breakpoints={{'960px': '75vw', '641px': '100vw'}}
                onHide={handleCloseModalCreate} maximizable visible={createModal} footer={<>
            <Button label="Vazgeç" icon="pi pi-times" size={"small"} link
                    onClick={handleCloseModalCreate} loading={loading}/>
            <Button label="Ekle" icon="pi pi-save" size={"small"} className="p-button-success"
                    type={"button"} loading={loading}
                    onClick={() => {
                        setFormSubmittedCreate(true);
                        formRefCreate.current.click();
                    }}/>
        </>}>
            <CreateCustomer csrf_token={csrf_token} toast={toast}
                            formSubmitted={formSubmittedCreate}
                            onHide={handleCloseModalCreate} onSave={(status, user) => {
                if (status) {
                    getCustomers(user.id);
                }
            }} setUsers={() => {
            }} formRef={formRefCreate}/>
        </Dialog>
    </>

}
export default PreCreate;
