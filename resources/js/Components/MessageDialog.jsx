import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import {useState, useEffect, useRef} from "react";
import {Dropdown} from "primereact/dropdown";
import {InputTextarea} from "primereact/inputtextarea";
import useSmsCounter from "@/libs/useSmsCounter.js";
import {Toast} from "primereact/toast";
import {BlockUI} from "primereact/blockui";
import {ConfirmPopup, confirmPopup} from 'primereact/confirmpopup';
import {Accordion, AccordionTab} from 'primereact/accordion';
import {InputText} from "primereact/inputtext";
import {SelectButton} from 'primereact/selectbutton';

const MessageDialog = ({
                           csrf_token, initialCustomer = null, visible = false, setVisible = () => {
    }, auth, initialOpened = "sms"
                       }) => {
    const fileInput = useRef(null);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const {message, setMessage, smsCount, charCount} = useSmsCounter();
    const [file, setFile] = useState(null);
    const [sendType, setSendType] = useState(initialOpened === "sms" ? 0 : 1);
    const [redirectOptions, setRedirectOptions] = useState([
        {
            icon: "pi pi-file",
            label: "Dosyaya Yönlendirme",
            key: "file"
        },
        {
            icon: "pi pi-link",
            label: "Url Yönlendirme",
            key: "url"
        },
    ]);
    const [redirectType, setRedirectType] = useState(redirectOptions[0]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");

    const getCustomers = () => {
        fetch(route('customers.getListForSms'), {
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
        if (initialCustomer !== null) {
            setSelectedCustomer(initialCustomer);
        }
        getCustomers();
    }, [])
    useEffect(() => {
        if (initialCustomer !== null) {
            setSelectedCustomer(initialCustomer);
        } else {
            setSelectedCustomer(null);
        }
        if (visible) {
            if (!["admin", "salesman", "engineer"].includes(auth?.user?.role)) {
                toast.current.show({severity: 'warn', summary: 'Hata', detail: "Bu İşlem İçin Yetkiniz Yok",});
                setLoading(true);
                setTimeout(() => {
                    setVisible(false);
                }, 100);
            }
        }
        setMessage("");
    }, [visible])
    const onHide = () => {
        setVisible(false);
    }


    const sendMessage = (event) => {
        if (selectedCustomer === null) {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "Müşteri Seçiniz",
                life: 3000
            });
            return;
        }
        if (charCount === 5) {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "Mesajınız Boş Olamaz",
                life: 3000
            });
            return;
        }
        confirmPopup({
            target: event.currentTarget,
            message: `Bu Mesaj İçin Toplam ${smsCount} SMS Kullanılacaktır. Onaylıyor Musunuz?`,
            icon: "pi pi-info-circle",
            acceptLabel: "Gönder",
            acceptIcon: "pi pi-send",
            rejectIcon: "pi pi-times",
            rejectLabel: "Vazgeç",
            defaultFocus: 'accept',
            accept: () => {
                setLoading(true);
                let formData = new FormData();
                formData.append('customer_id', selectedCustomer.id);
                formData.append('message', message);
                fetch(route('customers.sendMessage', `${selectedCustomer.id}`), {
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
                            detail: data.message,
                            life: 3000
                        });
                        onHide();
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Hata',
                            detail: data.message,
                            life: 3000
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
            }
        });
    }
    const sendNotification = (event) => {
        if (title === "") {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "Başlık Boş Olamaz",
                life: 3000
            });
            return;
        }
        if (content === "") {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "İçerik Boş Olamaz",
                life: 3000
            });
            return;
        }
        if (redirectType.key === "file" && file === null) {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "Dosya Seçiniz",
                life: 3000
            });
            return;
        }
        if (redirectType.key === "url" && url === "") {
            toast.current.show({
                severity: 'warn',
                summary: 'Hata',
                detail: "Url Boş Olamaz",
                life: 3000
            });
            return;
        }
        confirmPopup({
            target: event.currentTarget,
            message: `Bu Bildirim Gönderimi İçin Onaylıyor Musunuz?`,
            icon: "pi pi-info-circle",
            acceptLabel: "Gönder",
            acceptIcon: "pi pi-send",
            rejectIcon: "pi pi-times",
            rejectLabel: "Vazgeç",
            defaultFocus: 'accept',
            accept: () => {
                setLoading(true);
                let formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                formData.append('redirect_type', redirectType.key);
                if (redirectType.key === "file") {
                    formData.append('file', file);
                } else {
                    formData.append('url', url);
                }
                fetch(route('notifications.send'), {
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
                            detail: data.message,
                            life: 3000
                        });
                        onHide();
                    } else {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Hata',
                            detail: data.message,
                            life: 3000
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
        });
    }
    const onClickSend = (event) => {
        if (sendType === 0) {
            sendMessage(event);
        } else if (sendType === 1) {
            sendNotification(event);
        }
    }
    const renderFooter = (name) => {
        return (
            <div>
                <Button label={loading ? "Gönderiliyor" : "Gönder"} icon="pi pi-send" loading={loading}
                        severity={"success"} size={"small"} onClick={onClickSend}/>
            </div>
        );
    }
    return <>
        <Toast ref={toast}/>
        <ConfirmPopup/>
        <Dialog onHide={onHide} visible={visible} style={{width: '550px'}} header="Yeni Mesaj Gönder" draggable={true}
                position={"bottom-right"} footer={renderFooter('displayBasic')}>
            <BlockUI blocked={loading} template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                <Accordion activeIndex={sendType} onTabChange={(event) => {
                    setSendType(event.index);
                }}>
                    <AccordionTab header="SMS Gönder">
                        <div className="p-fluid">
                            <div className="p-field mb-3">
                                <label htmlFor="name" className={"font-semibold"}>Müşteri Seç</label>
                                <Dropdown optionLabel="name" filter value={selectedCustomer} options={customers}
                                          onChange={(e) => {
                                              setSelectedCustomer(e.value);
                                          }} placeholder="Müşteri Seç"/>
                            </div>
                            <div className="p-field">
                                <label htmlFor="name" className={"font-semibold"}>Mesaj [{charCount} Karakter
                                    / {smsCount} SMS]</label>
                                <InputTextarea id="message" value={message} onChange={(e) => setMessage(e.target.value)}
                                               rows={3} cols={20} autoResize placeholder="Mesajınızı Giriniz"/>
                            </div>
                        </div>
                    </AccordionTab>
                    <AccordionTab header="Bildirim Gönder">
                        <div className="p-fluid">
                            <div className="p-field mb-3">
                                <label htmlFor="title" className={"font-semibold"}>Başlık</label>
                                <InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                                           placeholder="Başlık Giriniz"/>
                            </div>
                            <div className="p-field mb-3">
                                <label htmlFor="content" className={"font-semibold"}>İçerik</label>
                                <InputTextarea id="content" value={content} onChange={(e) => setContent(e.target.value)}
                                               rows={3} cols={20} autoResize placeholder="Bildirim İçeriğini Giriniz"/>
                            </div>
                            <div className="p-field mb-3">
                                <label htmlFor="redirectType" className={"font-semibold"}>Yönlendirme Türü</label>
                                <SelectButton value={redirectType} allowEmpty={false} itemTemplate={(option) => <span><i
                                    className={option.icon}></i> {option.label}</span>} options={redirectOptions}
                                              onChange={(e) => setRedirectType(e.value)}/>
                            </div>
                            {redirectType?.key === "file" && <div className="p-field mb-3">
                                <label htmlFor="fileInput" className={"font-semibold"}>Dosya Seçimi </label>
                                <Button disabled={loading}
                                        label={(file !== null ? `'${file?.name}' Dosyası Seçili` : "Dosya Seç")}
                                        icon={"pi pi-image"} type={"button"}
                                        severity={file !== null ? "success" : "info"}
                                        onClick={() => {
                                            fileInput.current.click();
                                        }}/>
                                <input type="file" name="files" id="fileInput" onChange={(event) => {
                                    let files = event.target.files[0];
                                    if (files) {
                                        setFile(files);
                                    }

                                }}
                                       style={{display: 'none'}}
                                       ref={fileInput}/>
                                <small>(Seçilmesi Durumunda Bildirime Tıklandığında Dosyaya Yönlendirilir.)</small>
                            </div>}
                            {redirectType?.key === "url" && <div className="p-field mb-3">
                                <label htmlFor="url" className={"font-semibold"}>Url</label>
                                <InputText id="url" value={url} onChange={(e) => setUrl(e.target.value)}
                                           placeholder="Bir URL Giriniz"/>
                                <small>(Gireceğiniz URL'e Yönlendirilir.)</small>
                            </div>}
                        </div>
                    </AccordionTab>
                </Accordion>
            </BlockUI>
        </Dialog>
    </>
}
export default MessageDialog;
