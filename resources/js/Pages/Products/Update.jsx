import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {useFormik} from "formik";
import {Dropdown} from 'primereact/dropdown';
import {InputNumber} from 'primereact/inputnumber';
import {Checkbox} from "primereact/checkbox";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import React, {useEffect, useState} from "react";

const Update = ({
                    csrf_token, visible, setVisible, categories, onChange = () => {
    }, products, toast, product
                }) => {

    const fileInput = React.createRef();
    const [loading, setLoading] = useState(false);
    const {values, handleChange, setFieldValue} = useFormik({
        initialValues: {
            preorder: false,
            order: product?.order,
            sku: product?.sku,
            name: product?.name,
            category: product?.category,
            price: product?.price,
            is_new: product?.is_new === 1,
            is_discount: product?.is_discount === 1,
            is_tl: product?.is_tl === 1,
            is_active: product?.is_active === 1,
            selectedCategory: categories.find(category => category.name === product?.category),
            selectedProduct: null,
        }
    });
    useEffect(() => {
        setFieldValue("preorder", false);
        setFieldValue("sku", product?.sku);
        setFieldValue("name", product?.name);
        setFieldValue("order", product?.order);
        setFieldValue("category", product?.category);
        setFieldValue("price", product?.price);
        setFieldValue("is_new", product?.is_new === 1);
        setFieldValue("is_discount", product?.is_discount === 1);
        setFieldValue("is_tl", product?.is_tl === 1);
        setFieldValue("is_active", product?.is_active === 1);
        setFieldValue("selectedCategory", categories.find(category => category.name === product?.category));
        setFieldValue("selectedProduct", null);
    },[product])
    const saveProduct = () => {
        if (values.sku.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Stok Kodu Zorunludur!'
            });
            return;
        }
        if (values.name.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Ürün Adı Zorunludur!'
            });
            return;
        }
        if (values.category.length === 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Kategori Zorunludur!'
            });
            return;
        }
        if (values.price <= 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Fiyat 0 dan büyük olmalıdır!'
            });
            return;
        }
        if (values.preorder && !values.selectedProduct) {
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Önceden Sıralanacak Ürünü Seçmelisiniz!'
            });
            return;
        }
        setLoading(true);
        let formData = new FormData();
        formData.append('sku', values.sku);
        formData.append('name', values.name);
        formData.append('category', values.category);
        formData.append('price', values.price);
        formData.append('is_new', values.is_new ? 1 : 0);
        formData.append('is_discount', values.is_discount ? 1 : 0);
        formData.append('is_tl', values.is_tl ? 1 : 0);
        formData.append('is_active', values.is_active ? 1 : 0);
        formData.append('order', values.order);
        formData.append("_method", "PUT");
        fetch(route("products.update", product?.id), {
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
                setFieldValue("sku", "");
                setFieldValue("name", "");
                setFieldValue("category", categories[0].name);
                setFieldValue("price", 1);
                setFieldValue("is_new", false);
                setFieldValue("is_discount", false);
                setFieldValue("is_tl", true);
                setFieldValue("is_active", true);
                setFieldValue("selectedCategory", categories[0]);
                setFieldValue("selectedProduct", null);

                onChange(data.products);
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
        <Dialog header={"'"+product?.name+"' Ürünü Düzenle"} maximizable visible={visible}
                style={{width: '50vw'}} onHide={() => setVisible(false)}
                footer={<>
                    <Button label="Kapat" icon="pi pi-times" size="small" loading={loading} severity={"secondary"}
                            onClick={() => setVisible(false)}/>
                    <Button label="Kaydet" icon="pi pi-save" size="small" loading={loading} className="p-button-success"
                            onClick={saveProduct}/>
                </>}
        >
            <div className="p-fluid">
                <div className={"mb-3 flex items-center"}>
                    <Checkbox inputId="preorder" disabled={loading} name={"preorder"} onChange={(e) => {
                        setFieldValue("preorder", e.checked)
                    }} checked={values.preorder}/>
                    <label htmlFor="preorder" className="ml-3 font-bold">
                        Ürün Yerini Değiştir
                    </label>
                </div>
                {values.preorder && <div className={"mb-3"}>
                    <label htmlFor="preorderProducts" className="font-bold">
                        Hangi Ürünün Altına Koymak İstediğinizi Seçiniz <span
                        className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <Dropdown disabled={loading} inputId={"preorderProducts"} options={products.map((pr) => {
                        if (pr.id !== product?.id){return pr;}else{return undefined;}
                    }).filter(
                        (pr) => pr !== undefined
                    )} optionLabel={"name"}
                              value={values.selectedProduct} filter showClear={false} onChange={(e) => {
                        setFieldValue("order", e.value.order);
                        setFieldValue("selectedProduct", e.value);
                    }}/>
                </div>}
                <Divider/>
                <div className={"mb-3"}>
                    <label htmlFor="email" className="font-bold">
                        Ürün Stok Kodu <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputText disabled={loading} id="email" type={"text"} name={"sku"} onChange={handleChange}
                               value={values.sku}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="name" className="font-bold">
                        Ürün Adı <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputText disabled={loading} id="name" type={"text"} name={"name"} onChange={handleChange}
                               value={values.name}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor=" " className="font-bold">
                        Ürün Kategorisi <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <Dropdown disabled={loading} inputId={"category"} options={categories} optionLabel={"name"}
                              value={values.selectedCategory} filter showClear={false} onChange={(e) => {
                        setFieldValue("category", e.value.name);
                        setFieldValue("selectedCategory", e.value);
                    }}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="price" className="font-bold">
                        Ürün Fiyatı <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputNumber disabled={loading} inputId="price" name={"price"}
                                 mode={"currency"} currency={values.is_tl ? "TRY" : "USD"}
                                 min={0} onChange={(e) => {
                        setFieldValue("price", e.value)
                    }} value={values.price}/>
                </div>
                <div className={"mb-3 flex items-center"}>
                    <Checkbox disabled={loading} inputId="is_tl" name={"is_tl"} onChange={(e) => {
                        setFieldValue("is_tl", e.checked)
                    }} checked={values.is_tl}/>
                    <label htmlFor="is_tl" className="ml-3 font-bold">
                        TL Fiyat <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                </div>
                <div className={"mb-3 flex items-center"}>
                    <Checkbox disabled={loading} inputId="is_new" name={"is_new"} onChange={(e) => {
                        setFieldValue("is_new", e.checked)
                    }} checked={values.is_new}/>
                    <label htmlFor="is_new" className="ml-3 font-bold">
                        Yeni Ürün <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                </div>
                <div className={"mb-3 flex items-center"}>
                    <Checkbox disabled={loading} inputId="is_discount" name={"is_discount"} onChange={(e) => {
                        setFieldValue("is_discount", e.checked)
                    }} checked={values.is_discount}/>
                    <label htmlFor="is_discount" className="ml-3 font-bold">
                        İndirimli Ürün <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                </div>
            </div>
        </Dialog>
    </>
};
export default Update;
