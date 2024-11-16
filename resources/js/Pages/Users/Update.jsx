import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {useFormik} from "formik";
import {Dropdown} from 'primereact/dropdown';
import {InputNumber} from 'primereact/inputnumber';
import {Checkbox} from "primereact/checkbox";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Image} from "primereact/image";
import {Tag} from "primereact/tag";

const Update = ({
                    auth,csrf_token, visible, setVisible, roles, onChange = () => {
    }, toast,user
                }) => {
    const [loading, setLoading] = useState(false);
    const {values, handleChange, setFieldValue} = useFormik({
        initialValues: {
            name:"",
            email: "",
            password: "",
            selectedRole: null
        }
    });
    useEffect(() => {
        if(user !== null) {
            setFieldValue("name", user.name);
            setFieldValue("email", user.email);
            setFieldValue("selectedRole", roles.find(role => role.role === user.role.role));
        }
    },[user]);
    const saveProduct = () => {

        if (values.name.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Ad Zorunludur'
            });
            return;
        }

        if (values.email.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Email Adresi Zorunludur!'
            });
            return;
        }
        if (values.selectedRole === null) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Rol Seçimi Zorunludur!'
            });
            return;
        }
        setLoading(true);
        let formData = new FormData();
        formData.append('name', values.name);
        formData.append('password', values.password);
        formData.append('role', values?.selectedRole?.role);
        formData.append('email', values.email);
        formData.append("_method", "PUT");
        fetch(route("users.update",user?.id), {
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
                setFieldValue("name","");
                setFieldValue("email","");
                setFieldValue("password","");
                setFieldValue("selectedRole",null);
                onChange(data.users);
                setVisible(false);
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
            setLoading(false);
        });
    };
    return <>
        <Dialog header={"Kullanıcıyı Düzenle"} maximizable visible={visible}
                style={{width: '50vw'}} breakpoints={{'960px': '75vw', '641px': '100vw'}} onHide={() => setVisible(false)}
                footer={<>
                    <Button label="Kapat" icon="pi pi-times" size={"small"} loading={loading} severity={"secondary"}
                            onClick={() => setVisible(false)}/>
                    <Button label="Kaydet" icon="pi pi-save" size={"small"} loading={loading}
                            className="p-button-success"
                            onClick={saveProduct}/>
                </>}
        >
            <div className="p-fluid">
                <div className={"mb-3"}>
                    <label htmlFor="name" className="font-bold">
                        Adı <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputText disabled={loading} id="name" type={"text"} name={"name"} onChange={handleChange}
                               value={values.name}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="email" className="font-bold">
                        Mail Adresi <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputText disabled={loading} id="email" type={"email"} name={"email"} onChange={handleChange}
                               value={values.email}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="roles" className="font-bold">
                        Rolü <span className={"font-semibold text-red-400"}>*</span>
                        <Dropdown disabled={loading} inputId={"roles"} options={roles} optionLabel={"label"}
                                  placeholder={"Rol Seçiniz"}
                                  value={values.selectedRole} showClear={false} onChange={(e) => {
                            if((auth.user.role === "admin" || auth.user.role === "salesman" || auth.user.role === "worker") && e.value.role === "engineer") {
                                toast.current.show({
                                    severity: 'info',
                                    summary: 'Hata',
                                    detail: 'Yetkiniz Yok!'
                                });
                                return;
                            }
                            setFieldValue("selectedRole", e.value);
                        }} valueTemplate={(role, props) => role ? <Tag value={role?.label} severity={role?.severity}/> :
                            <span>{props.placeholder}</span>}/>
                        {values.selectedRole !== null && <small className={"font-medium"}>{values.selectedRole.description}</small>}
                    </label>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="password" className="font-bold">
                        Yeni Şifre <span className={"font-semibold text-blue-400"}>*</span> <small className={"font-medium"}>Şifre Değiştirmek İstemiyorsanız Boş Bırakınız</small>
                    </label>
                    <InputText disabled={loading} autoComplete={"false"} id="password" type={"password"} name={"password"}
                               onChange={handleChange}
                               autoSave={"false"}
                               value={values.password}/>
                </div>
            </div>
        </Dialog>
    </>
};
export default Update;
