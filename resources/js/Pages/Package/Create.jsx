import {Head, router} from "@inertiajs/react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import React, {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {BlockUI} from "primereact/blockui";
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {Accordion, AccordionTab} from 'primereact/accordion';
import {InputNumber} from 'primereact/inputnumber';
import {InputTextarea} from 'primereact/inputtextarea';
import { Image } from 'primereact/image';
import {ProgressBar} from "primereact/progressbar";
const Create = ({auth, csrf_token, prepareds,packageData}) => {
    const [completed, setCompleted] = useState(false);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const {values, handleChange, handleSubmit, handleBlur, setFieldValue, errors, dirty} = useFormik({
        initialValues: {
            note: "",
            quantity: 1,
            files: [],
            prepared: prepareds[0],
        },
        onSubmit: async (values) => {
            let acceptedFiles = 0;
            let formData = new FormData();
            formData.append("quantity", values.quantity);
            formData.append("note", values.note);
            formData.append("prepared", values.prepared.name);
            for (let i = 0; i < values.files.length; i++) {
                if(values.files[i].type.includes("image")) {
                    formData.append("images[]", values.files[i]);
                    acceptedFiles++;
                } else if(values.files[i].type.includes("video")){
                    formData.append("videos[]", values.files[i]);
                    acceptedFiles++;
                }
            }

            if(!(values.quantity > 0)){
                toast.current.show({
                    severity: 'warn',
                    summary: 'Hata',
                    detail: "Koli Adedi En Az 1 Olmalıdır.",
                });
                return;
            }
            if (acceptedFiles === 0) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Hata',
                    detail: "Lütfen En Az Bir Adet Resim Veya Video Seçiniz.",
                });
                return;
            }

            setLoading(true);
            let startTime = Date.now();

            let xhr = new XMLHttpRequest();
            xhr.open("POST", route("packages.store", packageData.id), true);
            xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);

            xhr.upload.onprogress = function(event) {
                if (event.lengthComputable) {
                    let percentComplete = (event.loaded / event.total) * 100;
                    setProgress(Math.floor(percentComplete));

                    let elapsedTime = (Date.now() - startTime) / 1000; // saniye olarak
                    let uploadSpeed = event.loaded / elapsedTime; // bytes per second
                    let remainingTime = (event.total - event.loaded) / uploadSpeed; // saniye olarak

                    let minutes = Math.floor(remainingTime / 60);
                    let seconds = Math.floor(remainingTime % 60);

                    setEstimatedTime(`${minutes}dk ${seconds}sn`);
                }
            };

            xhr.onload = function() {
                setLoading(false);
                let response = JSON.parse(xhr.responseText);
                let {status, message} = response;
                setProgress(0);
                setEstimatedTime(null);
                if (status) {
                    setCompleted(true);
                    toast.current.show({severity: "success", summary: "Başarılı", detail: message});
                    setTimeout(() => {
                        router.visit(route("packages.index"));
                    }, 1500);
                } else {
                    toast.current.show({severity: "error", summary: "Hata", detail: message});
                }
            };

            xhr.onerror = function() {
                setLoading(false);
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: "CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."
                });
            };

            xhr.send(formData);
        }
    });
    const fileInput = useRef(null);

    const onSave = () => {
        //TODO : Save
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Paket Verilerini Ekle"
            info={[
                {
                    icon: "pi-user",
                    text: packageData.name+" ("+packageData.phone+")",
                },{
                    icon: "pi-calendar",
                    text: new Date(packageData.created_at).toLocaleString(),
                },{
                    icon: "pi-desktop",
                    text: packageData.officer+" (Kayıt Personeli)",
                },
            ]}
            buttons={[
                {
                    icon: "pi pi-arrow-left",
                    tooltip: "Bekleyen Paketleri Görüntüle",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    severity: "secondary",
                    onClick: () => {
                        router.visit(route("packages.index"));
                    }
                }
            ]}
        >
            <Head title={"Paket Ekle"}/>
            <Toast ref={toast}/>
            <div className="py-6">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    <div className={!loading && "hidden"}>
                        <ProgressBar color={"var(--green-500)"} value={progress} displayValueTemplate={(value) => <>{value}% {value>95 && "Dosyalar Yüklendi İşlem Yapılıyor"}</>}></ProgressBar>
                    </div>
                    <div className={"mb-3 "+(!loading && " hidden")}>
                    {/*        ESTİMATED TİME PRİNT*/}
                        {estimatedTime && <div className={"text-sm text-gray-500 text-end"}>Kalan Tahmini Süre : {estimatedTime}</div>}
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">

                        <BlockUI blocked={loading}
                                 template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                            <form onSubmit={handleSubmit}
                                  className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <div className="p-fluid">
                                    <Accordion className={"mb-3"}>
                                        <AccordionTab
                                            header={"Müşteri Bilgileri ("+(packageData.name)+")"}>
                                            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-3"}>
                                                <div>
                                                    <label htmlFor="name" className="font-bold">
                                                        Müşteri Adı <span
                                                        className={"font-semibold text-red-400"}>*</span>
                                                    </label>
                                                    <InputText id="name" type={"text"} name={"name"} value={packageData.name}
                                                               readOnly disabled/>
                                                </div>
                                                <div>
                                                    <label htmlFor="phone" className="font-bold">
                                                        Müşteri Telefonu <span
                                                        className={"font-semibold text-red-400"}>*</span>
                                                    </label>
                                                    <InputText id="phone" type={"tel"} name={"phone"}
                                                               value={packageData.phone}
                                                               readOnly disabled
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="city" className="font-bold">
                                                        Müşteri İl <span
                                                        className={"font-semibold text-red-400"}>*</span>
                                                    </label>
                                                    <InputText id="city" type={"text"} name={"city"} value={packageData.city}
                                                               readOnly disabled
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="district" className="font-bold">
                                                        Müşteri İlçe <span
                                                        className={"font-semibold text-red-400"}>*</span>
                                                    </label>
                                                    <InputText id="district" type={"text"} name={"district"}
                                                               value={packageData.district}
                                                               readOnly disabled
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="address" className="font-bold">
                                                        Müşteri Adresi <span
                                                        className={"font-semibold text-red-400"}>*</span>
                                                    </label>
                                                    <InputText id="address" type={"text"} name={"address"}
                                                               value={packageData.address}
                                                               readOnly
                                                    />
                                                </div>
                                            </div>
                                        </AccordionTab>
                                    </Accordion>
                                    <div className={"mb-3"}>
                                        <label htmlFor="quantity" className="font-bold">
                                            Paket Adedi <span className={"font-semibold text-red-400"}>*</span>
                                        </label>
                                        <InputNumber id="quantity" type={"text"} min={1} name={"quantity"}
                                                     suffix={" Koli"} value={values.quantity}
                                                     onChange={(e) => {
                                                         setFieldValue("quantity", e.value)
                                                     }}/>
                                    </div>

                                    <div className={"mb-3"}>
                                        <Button label={(values.files.length > 0 ?`${values.files.length} Adet Medya Seçili`:"Resim Ve Videoları Seçin")} disabled={completed} icon={"pi pi-image"} type={"button"}
                                                severity={values.files.length > 0 ? "success" : "info"}
                                                onClick={() => {
                                                    fileInput.current.click();
                                                }}/>
                                        <input type="file" name="files" disabled={completed} id="files" onChange={(event) => {
                                            let files = event.target.files;
                                            let filteredFiles = [];
                                            for (let i = 0; i < files.length; i++) {
                                                if (files[i].type.includes("image") || files[i].type.includes("video")) {
                                                    filteredFiles.push(files[i]);
                                                }
                                            }
                                            if(filteredFiles.length===0) {
                                                toast.current.show({
                                                    severity: 'warn',
                                                    summary: 'Hata',
                                                    detail: "Lütfen Sadece Resim Veya Video Dosyaları Seçiniz.",
                                                });
                                            }
                                            setFieldValue("files", filteredFiles);
                                        }} accept="image/*,video/*"
                                               style={{display: 'none'}}
                                               multiple ref={fileInput}/>
                                    </div>
                                    <Accordion className={"mb-3"} hidden={!values.files.length>0}>
                                        <AccordionTab header={"Seçili Dosyalar ("+(values.files.length)+")"}>
                                            <div className={"grid grid-cols-2 gap-3 lg:grid-cols-3"}>
                                                {values.files.map((file, index) => {
                                                    if(file.type.includes("image")){
                                                        return <Image src={URL.createObjectURL(file)} alt={"Resim"} key={index} preview  className={"w-full h-full"}/>
                                                    }else if(file.type.includes("video")){
                                                        return <video src={URL.createObjectURL(file)} alt={"Video"} controls={true} autoPlay={false} key={index} className={"w-full h-full"}/>
                                                    }
                                                })}
                                            </div>
                                        </AccordionTab>
                                    </Accordion>
                                    <div className={"mb-3"}>
                                        <label htmlFor="note" className="font-bold">
                                            Sipariş Notu
                                        </label>
                                        <InputTextarea id="note" name={"note"} value={values.note} disabled={completed}
                                                       placeholder={"Sipariş Notunuz.Siparişte Eksik Olan Ürünleri Stok Kodları Ve Adetleri İle Belirtiniz."}
                                                       onChange={handleChange} onBlur={handleBlur}/>
                                    </div>
                                </div>
                                <div className={"mb-3"}>
                                    <label htmlFor="name" className="font-bold">
                                        Paketi Hazırlayan Personel Seçimi <span
                                        className={"font-semibold text-red-400"}>*</span>
                                    </label>
                                    <Dropdown value={values.prepared} disabled={completed} filter virtualScrollerOptions={{itemSize: 43}}
                                              onChange={(e) => {
                                                  setFieldValue("prepared", e.value);
                                              }} options={prepareds}
                                              checkmark={true}
                                              optionLabel="name"
                                              placeholder="Personeli Seçiniz"
                                              className="w-full md:w-20rem"/>
                                </div>

                                <div>
                                    <Button label={"Kaydet"} size={"small"} icon={"pi pi-save"}
                                            type={"submit"}
                                            disabled={completed}
                                            className={"mr-2"}
                                            severity={"success"}
                                            loading={loading}/>

                                </div>
                            </form>
                        </BlockUI>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
export default Create;
