import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from "primereact/button";
import React, {useRef, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
import {Toast} from "primereact/toast";
import {Accordion, AccordionTab} from 'primereact/accordion';
import {InputTextarea} from "primereact/inputtextarea";
import useSmsCounter from "@/libs/useSmsCounter.js";
import {FilterMatchMode} from "primereact/api";
import {BlockUI} from "primereact/blockui";

const Show = ({auth, csrf_token, group}) => {
    const toast = useRef(null);
    const [groups, setGroups] = useState([]);
    const {message, setMessage, smsCount, charCount} = useSmsCounter();
    const [loading, setLoading] = useState(false);

    const sendMessage = (event) => {
        if (message.length === 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "Mesaj Boş Olamaz",
                life: 3000
            });
            return;
        }

        confirmPopup({
            target: event.currentTarget,
            message: `${group.members.length} Müşteriye ${smsCount * group.members.length} SMS Gönderilecek. Onaylıyor musunuz?`,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-success",
            acceptLabel: "Gönder",
            rejectLabel: "İptal",
            accept: () => {
                setLoading(true);
                let formData = new FormData();
                formData.append('message', message);
                formData.append('group', group.id);
                fetch(route("groups.sendMessage",group.id), {
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
                        setMessage("");
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
        });
    }
    return <Authenticated info={[
        {
            icon: "pi-users",
            text: `Toplam ${group.members.length} Müşteri`
        }
    ]} header={`"${group.name}" Adlı Grup`} user={auth.user} buttons={[
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
        {
            size: "small",
            icon: "pi pi-pencil",
            tooltip: "Grubu Düzenle",
            severity: "warn",
            tooltipOptions: {
                position: "bottom"
            },
            onClick: () => {
                router.visit(route("groups.edit", group.id));
            }
        },
    ]}>
        <Head title={`"${group.name}" Adlı Grup`}/>
        <Toast ref={toast}/>
        <ConfirmPopup/>
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <BlockUI blocked={loading} template={<i className="pi pi-spin pi-spinner"
                                                            style={{fontSize: '3rem'}}></i>}>
                        <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <Accordion multiple activeIndex={[0]}>
                                <AccordionTab header="Mesaj Gönder">

                                    <div className="p-fluid">
                                        <div className="p-field">
                                            <label htmlFor="name">Mesaj [{charCount} Karakter / {smsCount} SMS]</label>
                                            <InputTextarea id="message" value={message}
                                                           onChange={(e) => setMessage(e.target.value)} rows={3}
                                                           cols={20} autoResize placeholder="Mesajınızı Giriniz"/>
                                        </div>
                                        <div className={"inline-flex"}>
                                            <Button label="Gönder" icon="pi pi-send" severity={"success"}
                                                    onClick={sendMessage}
                                                    loading={loading}
                                                    size={"small"}/>
                                        </div>
                                    </div>

                                </AccordionTab>
                                <AccordionTab header="Grup Üyeleri">
                                    <DataTable value={group.members} filterDisplay="row" removableSort paginator
                                               filters={{
                                                   name: {value: null, matchMode: FilterMatchMode.CONTAINS},
                                                   phone: {value: null, matchMode: FilterMatchMode.CONTAINS},
                                               }} emptyMessage="Müşteri bulunamadı."
                                               currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                                               paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                               rowsPerPageOptions={[5, 10, 25, 50]} rows={10} dataKey="id">
                                        <Column field="name" header="Müşteri Adı" sortable filter showFilterMenu={false}
                                                filterPlaceholder="Müşteri Adına Göre Arama"></Column>
                                        <Column field="phone" header="Müşteri Telefon" sortable filter showFilterMenu={false}
                                                filterPlaceholder="Müşteri Telefonuna Göre Arama"></Column>
                                    </DataTable>
                                </AccordionTab>
                            </Accordion>
                        </div>
                    </BlockUI>
                </div>
            </div>
        </div>
    </Authenticated>
}
export default Show;
