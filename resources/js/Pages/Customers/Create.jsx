import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";
import {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {BlockUI} from 'primereact/blockui';
import {useFormik} from "formik";
import * as Yup from 'yup';
import {Message} from 'primereact/message';
import {InputMask} from "primereact/inputmask";

export default function Create({csrf_token, toast, onHide, setUsers, formRef,formSubmitted,onSave=() => {}}) {
    const {VITE_APP_CITY_DISTRICT_URL} = import.meta.env
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const getCities = () => {
        fetch(VITE_APP_CITY_DISTRICT_URL).then(r => r.json()).then(({data}) => {
            setCities(data);
        }).catch((err) => {
            setCities([])
        });
    }
    useEffect(() => {
        getCities()
    }, [])
    const {values, handleSubmit, handleChange, setFieldValue, errors, setErrors} = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            city: null,
            district: null,
            address:""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Müşteri Adı Zorunludur'),
            email: Yup.string().email('Geçerli Bir E-Posta Adresi Giriniz'),
            phone: Yup.string().required('Telefon Numarası Zorunludur'),
            address:Yup.string().required('Adres Zorunludur'),
        }),
        onSubmit: values => {
            setLoading(true);
            let formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append("city",values.city.il_adi)
            formData.append("district",values.district.ilce_adi)
            formData.append("address",values.address)
            fetch(route("customers.store"), {
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
                    let newUserId = data.user_id;
                    onSave(true,data.customers.find(c => c.id === newUserId));
                    setUsers(data.customers);
                    setTimeout(() => {
                        onHide();
                    },500);
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
                setTimeout(() => {
                    setLoading(false);
                },500);
            })
        }
    })

    return (<BlockUI blocked={loading} template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
        <form className="p-fluid" onSubmit={handleSubmit}>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3">
                <div className={"col-span-2 grid gap-y-2"}>
                    {formSubmitted && Object.keys(errors).length > 0 && <>
                        {Object.entries(errors).map(([key, value]) => (
                            <Message severity="warn" key={key} text={value}/>))}
                    </>}
                </div>
                <div className={"col-span-2"}>
                    <label htmlFor="name" className="font-bold">
                        Müşteri Adı <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputText id="name" name={"name"} onChange={handleChange} value={values.name} autoFocus/>

                </div>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="email" className="font-bold">
                    Müşteri E-Posta Adresi <span className={"font-semibold text-yellow-400"}>*<sub>Boş Bırakılması Halinde Otomatik Doldurulacaktır</sub></span>
                </label>
                <InputText id="email" type={"email"} name={"email"} onChange={handleChange} value={values.email}/>
            </div>

            <div className={"mb-3"}>
                <label htmlFor="phone" className="font-bold">
                    Müşteri Telefon No <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <InputMask id="phone" type={"tel"} mask={"0599 999 99 99"} onChange={(e) => setFieldValue("phone",e.target.value)} value={values.phone}/>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="city" className="font-bold">
                    Müşteri Şehir <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <Dropdown value={values.city} onChange={(e) => setFieldValue("city", e.value)} options={cities}
                          optionLabel="il_adi"
                          inputId={"city"}
                          itemTemplate={(option) => {
                              return <>
                                <span className={"w-5 h-5 rounded inline-flex items-center justify-center bg-blue-700 text-white text-sm"}>{option.plaka_kodu}</span> {option.il_adi}
                              </>
                          }}
                          placeholder="Şehir Seçiniz" className="w-full md:w-14rem" checkmark={true}
                          highlightOnSelect={false} filter virtualScrollerOptions={{itemSize: 38}}
                          emptyMessage={"Şehir Bulunamadı"} emptyFilterMessage={"Şehir Bulunamadı"} filterBy={"il_adi"}/>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="district" className="font-bold">
                    Müşteri İlçe <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <Dropdown value={values.district} inputId={"district"} disabled={values.city === null} onChange={(e) => setFieldValue("district", e.value)} options={values.city?.ilceler}
                          optionLabel="ilce_adi"
                          placeholder="İlçe Seçiniz" className="w-full md:w-14rem" checkmark={true}
                          highlightOnSelect={false} filter virtualScrollerOptions={{itemSize: 38}}
                          emptyMessage={"İlçe Bulunamadı"} emptyFilterMessage={"İlçe Bulunamadı"} filterBy={"ilce_adi"}/>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="address" className="font-bold">
                    Müşteri Adresi <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <InputTextarea id="address" name={"address"} onChange={handleChange} value={values.address}/>
            </div>
            <button type={"submit"} style={{display: "none"}} ref={formRef}></button>
        </form>
    </BlockUI>);
}
