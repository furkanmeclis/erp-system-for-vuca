import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {useEffect, useRef, useState} from "react";
import {Dropdown} from "primereact/dropdown";
import {classNames} from 'primereact/utils';
import {Button} from "primereact/button";
import {BlockUI} from 'primereact/blockui';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Message} from "primereact/message";
import {InputSwitch} from 'primereact/inputswitch';
import {Password} from "primereact/password";
import {SelectButton} from 'primereact/selectbutton';
import {Badge} from "primereact/badge";
import {InputMask} from "primereact/inputmask";

export default function Update({
                                   csrf_token,
                                   toast,
                                   onHide,
                                   setUsers,
                                   formRef,
                                   formSubmitted,
                                   loading,
                                   setLoading,
                                   user,
                                    onSave = () => {}
                               }) {

    const {values, handleSubmit, handleChange, dirty, setFieldValue, errors, setErrors} = useFormik({
        initialValues: {
            name: user.name,
            email: user.email,
            phone: user.phone === "Belirtilmemiş" ? "" : user.phone,
            address: user.address === "Belirtilmemiş" ? "" : user.address,
            city: user.city === "Belirtilmemiş" ? "" : user.city,
            district: user.district === "Belirtilmemiş" ? "" : user.district,

        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Merkez Üyesi Adı Zorunludur.'),
            email: Yup.string().email('Geçerli Bir E-Posta Adresi Giriniz.').required('E-Posta Adresi Zorunludur.'),
            phone: Yup.string().required('Telefon Numarası Zorunludur.'),
            address: Yup.string().required('Adres Zorunludur.'),
        }),
        onSubmit: values => {
            setLoading(true);
            let formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('address', values.address);
            formData.append('city', values.city);
            formData.append('district', values.district);
            formData.append('_method', 'PUT');
            fetch(route('customers.update', user.id), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrf_token
                },
                body: formData

            }).then(response => response.json()).then(data => {
                if (data.status) {
                    onSave(true, data.customers.find(c => c.id === user.id));
                    toast.current.show({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: data.message
                    });
                    setUsers(data.customers);
                    onHide();
                } else {
                    onSave(false);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Hata',
                        detail: data.message
                    });
                }
            }).catch((error) => {

                onSave(false);
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

    return (<BlockUI blocked={loading} template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
        <form className="p-fluid" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-x-3 mb-3">
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
                    <InputText id="name" name={"name"} onChange={handleChange} value={values.name || ''} autoFocus/>

                </div>

            </div>
            <div className={"mb-3"}>
                <label htmlFor="email" className="font-bold">
                    Müşteri E-Posta Adresi <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <InputText id="email" type={"email"} name={"email"} readOnly disabled onChange={handleChange} value={values.email || ''}/>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="phone" className="font-bold">
                    Müşteri Telefon No <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <InputMask id="phone" mask={"0599 999 99 99"} name={"phone"} onChange={handleChange} value={values.phone || ''}/>
            </div>

            <div className={"mb-3"}>
                <label htmlFor="city" className="font-bold">
                    Şehir
                </label>
                <InputText id="city" type={"text"} name={"city"} onChange={handleChange}
                           value={values.city || ''}/>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="district" className="font-bold">
                    İlçe
                </label>
                <InputText id="district" type={"text"} name={"district"} onChange={handleChange}
                           value={values.district || ''}/>
            </div>
            <div className={"mb-3"}>
                <label htmlFor="address" className="font-bold">
                    Müşteri Adresi <span className={"font-semibold text-red-400"}>*</span>
                </label>
                <InputText id="address" type={"text"} name={"address"} onChange={handleChange}
                           value={values.address || ''}/>
            </div>
            <button type={"submit"} style={{display: "none"}} ref={formRef}></button>
        </form>
    </BlockUI>);
}
