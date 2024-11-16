import {Head, router} from "@inertiajs/react";
import MessageDialog from "@/Components/MessageDialog.jsx";
import React, {useEffect, useRef, useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {FilterMatchMode} from "primereact/api";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {confirmPopup} from "primereact/confirmpopup";
import {DataTable} from "primereact/datatable";
import {Toast} from "primereact/toast";
import {Dropdown} from 'primereact/dropdown';
import {InputSwitch} from 'primereact/inputswitch';
import Images from "@/Pages/Products/Images.jsx";
import Categories from "@/Pages/Products/Categories.jsx";
import Create from "@/Pages/Products/Create.jsx";
import Update from "@/Pages/Products/Update.jsx";
import ImageGenerator from "@/Pages/Products/ImageGenerator.jsx";
import {InputNumber} from "primereact/inputnumber";
import {InputText} from "primereact/inputtext";
import {getAllProducts} from "@/helpers/helper.js";

const Index = ({auth, csrf_token, categories}) => {
    const [products, setProducts] = useState([]);
    const [smsVisible, setSmsVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [imageVisible, setImageVisible] = useState(false);
    const [categoriesVisible, setCategoriesVisible] = useState(false);
    const [productCategories, setProductCategories] = useState(categories);
    const [addProductVisible, setAddProductVisible] = useState(false);
    const [updateProductVisible, setUpdateProductVisible] = useState(false);
    const [imageGeneratorVisible, setImageGeneratorVisible] = useState(false);
    useEffect(() => {
        getAllProducts(csrf_token).then((response) => {
            if (response.status) {
                setProducts(response.data)
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Hata',
                    detail: 'Ürünler yüklenirken bir hata oluştu.'
                })
            }
        }).catch((err) => {
            console.log(err);
            toast.current.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Ürünler yüklenirken bir hata oluştu.'
            })
        }).finally(() => setLoading(false));
    }, []);
    const updateProduct = ({rowData, field, newValue}) => {
        if (rowData[field] === newValue) {
            toast.current.show({
                severity: 'info',
                summary: 'Uyarı',
                detail: "Değişiklik Olmadı"
            });
            return;
        }
        let productId = rowData.id;
        rowData = {...rowData, [field]: newValue}
        setLoading(true);
        let formData = new FormData();
        formData.append('sku', rowData.sku);
        formData.append('name', rowData.name);
        formData.append('category', rowData.category);
        formData.append('price', rowData.price);
        formData.append('is_new', rowData.is_new ? 1 : 0);
        formData.append('is_discount', rowData.is_discount ? 1 : 0);
        formData.append('is_tl', rowData.is_tl ? 1 : 0);
        formData.append('is_active', rowData.is_active ? 1 : 0);
        formData.append('order', rowData.order);
        formData.append("_method", "PUT");
        fetch(route("products.update", productId), {
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
                setProducts(data.products);
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
    }
    return <>
        <AuthenticatedLayout
            user={auth.user}
            header="Ürünler"
            info={[
                {
                    icon: "pi-box",
                    text: `${products.length} adet ürün bulunmaktadır.`
                },
                {
                    icon: "pi-check",
                    text: `${products.map(pr => {
                        return pr.is_active === 1 ? true : null
                    }).filter(Boolean).length} adet aktif ürün bulunmaktadır.`
                },
                {
                    icon: "pi-times",
                    text: `${products.map(pr => {
                        return pr.is_active === 0 ? true : null
                    }).filter(Boolean).length} adet pasif ürün bulunmaktadır.`
                }
            ]}
            buttons={[
                {
                    icon: "pi pi-plus",
                    tooltip: "Yeni Ürün Ekle",
                    severity: "success",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    onClick: () => {
                        setAddProductVisible(true);
                    }
                },
                {
                    icon: "pi pi-users",
                    tooltip: "Müşterileri Görüntüle",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    severity: "info",
                    onClick: () => {
                        router.visit(route("customers.index"));
                    }
                },
                {
                    icon: "pi pi-send",
                    tooltip: "Yeni Mesaj Gönder",
                    severity: "warning",
                    tooltipOptions: {
                        position: "bottom"
                    },
                    size: "small",
                    onClick: () => {
                        setSmsVisible(!smsVisible);
                    }
                }
            ]}
        >
            <Toast ref={toast}/>
            <Head title="Ürünler"/>
            <div className="py-6">
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable value={products} removableSort paginator
                                   stripedRows
                                   editMode={"cell"}
                                   reorderableRows
                                   onRowReorder={(e) => {
                                       let reordered = e.value.map(({id}, index) => ({id, sort: index + 1}));
                                       setProducts(e.value)
                                       let formData = new FormData();
                                       formData.append('data', JSON.stringify(reordered));
                                       setLoading(true);
                                       fetch(route('products.updateOrder'), {
                                           method: 'POST',
                                           headers: {
                                               'X-CSRF-TOKEN': csrf_token,
                                           },
                                           body: formData
                                       }).then((response) => {
                                           return response.json();
                                       }).then((data) => {
                                           if (data.status) {
                                               toast.current.show({
                                                   severity: 'success',
                                                   summary: 'Başarılı',
                                                   detail: data.message
                                               });
                                               setProducts(data.products)
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
                                       })
                                   }}
                                   filterDisplay="row"
                                   paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                   rowsPerPageOptions={[5, 10, 25, 50]} rows={10} dataKey="id" filters={{
                            name: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            sku: {value: null, matchMode: FilterMatchMode.CONTAINS},
                            category: {value: null, matchMode: FilterMatchMode.EQUALS},
                            price: {value: null, matchMode: FilterMatchMode.CONTAINS,},
                            is_active: {value: null, matchMode: FilterMatchMode.EQUALS}
                        }}
                                   loading={loading}
                                   header={<>
                                       <Toolbar end={() => <>
                                           <Button icon={"pi pi-bars"} severity={"info"}
                                                   tooltip={"Bu Ekrandan Kategorileri Yönetebilirsiniz."}
                                                   tooltipOptions={{
                                                       position: 'top'
                                                   }} label={"Kategoriler"} onClick={() => {
                                               setCategoriesVisible(true);
                                           }}/>
                                       </>}
                                       />
                                   </>}
                                   emptyMessage="Ürün bulunamadı."
                                   currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan">

                            <Column rowReorder style={{width: '3rem'}}/>
                            <Column field="order"
                                    sortable={true} header="#"></Column>
                            <Column field={"is_active"} style={{width: '3rem'}} header={"Aktif"} body={(record) => {
                                return <InputSwitch checked={Boolean(record.is_active)} onChange={({value}) => {
                                    setLoading(true);
                                    let formData = new FormData();
                                    formData.append('is_active', value === true ? 1 : 0);
                                    fetch(route('products.updateIsActive', record.id), {
                                        method: 'POST',
                                        headers: {
                                            'X-CSRF-TOKEN': csrf_token,
                                        },
                                        body: formData
                                    }).then((response) => {
                                        return response.json();
                                    }).then((data) => {
                                        if (data.status) {
                                            toast.current.show({
                                                severity: 'success',
                                                summary: 'Başarılı',
                                                detail: data.message
                                            });
                                            setProducts(prevState => {
                                                return prevState.map((product) => {
                                                    if (product.id === record.id) {
                                                        product.is_active = value === true ? 1 : 0;
                                                    }
                                                    return product;
                                                });
                                            })
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
                                    })
                                }}/>
                            }} filter showFilterMenu={false} filterElement={(options) => {
                                return <InputSwitch checked={options.value === 1} onChange={({value}) => {
                                    options.filterApplyCallback(value === true ? 1 : 0);
                                }}/>

                            }}/>
                            <Column field="sku" filter showFilterMenu={false} filterPlaceholder={"Ürün Koduna Göre"}
                                    onCellEditComplete={(event) => updateProduct(event)}
                                    editor={(options) => <InputText type="text" value={options.value}
                                                                    onChange={(e) => options.editorCallback(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}/>}
                                    sortable={true} header="Ürün Kodu"></Column>
                            <Column field="name" filter showFilterMenu={false}
                                    filterPlaceholder={"Ürün Adına Göre"}
                                    sortable={true} header="Ürün Adı"
                                    onCellEditComplete={(event) => updateProduct(event)}
                                    editor={(options) => <InputText type="text" value={options.value}
                                                                    onChange={(e) => options.editorCallback(e.target.value)}
                                                                    onKeyDown={(e) => e.stopPropagation()}/>}
                            ></Column>
                            <Column field="category" filter showFilterMenu={false}
                                    filterPlaceholder={"Kategoriye Göre"} sortable={true}
                                    onCellEditComplete={(event) => updateProduct(event)}
                                    editor={(options) => {
                                        return <Dropdown options={categories}
                                                         onChange={(e) => options.editorCallback(e.value.name)}
                                                         placeholder={"Kategori Seçiniz"}
                                                         optionLabel={"name"}
                                                         value={categories.find((category) => category.name === options.value)}
                                        />
                                    }}
                                    header="Kategori" filterElement={(options) => {
                                return <Dropdown options={categories}
                                                 onChange={(e) => options.filterApplyCallback(e.value.name)}
                                                 placeholder={"Kategori Seçiniz"}
                                                 optionLabel={"name"}
                                                 value={categories.find((category) => category.name === options.value)}
                                />

                            }}></Column>
                            <Column field="price" filter showFilterMenu={false} filterPlaceholder={"Ürün Fiyatına Göre"}
                                    editor={(options) => <InputNumber placeholder="Ürün Fiyatı" mode={"currency"}
                                                                      disabled={loading}
                                                                      onChange={(e) => options.editorCallback(e.value)}
                                                                      value={options.value}
                                                                      currency={options.rowData.is_tl === 1 ? "TRY" : "USD"}/>}
                                    sortable={true} header="Ürün Fiyatı" body={({price, is_tl}) => {
                                return <span
                                    className={"p-tag text-md" + (is_tl ? " p-tag-success" : " p-tag-info")}>{price} {is_tl ? "₺" : "$"}</span>
                            }}
                                    onCellEditComplete={(event) => {
                                        updateProduct(event);
                                    }}
                            ></Column>

                            <Column header="İşlemler" body={(record) => {
                                return <div className={"flex justify-center gap-x-2"}>
                                    <Button icon="pi pi-cloud-download" size={"small"} tooltip={"Kampanya Resmi İndir"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"warning"} onClick={() => {
                                        setSelectedProduct(record);
                                        setImageGeneratorVisible(true);
                                    }}/>
                                    <Button icon="pi pi-images" size={"small"} tooltip={"Resimleri Görüntüle"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"help"} onClick={() => {
                                        setSelectedProduct(record);
                                        setImageVisible(true);
                                    }}/>
                                    <Button icon="pi pi-pencil" size={"small"} tooltip={"Ürünü Düzenle"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"info"} onClick={() => {
                                        setSelectedProduct(record);
                                        setUpdateProductVisible(true);
                                    }}/>
                                    <Button icon="pi pi-trash" size={"small"} tooltip={"Ürünü Sil"}
                                            tooltipOptions={{
                                                position: 'top'
                                            }} severity={"danger"} onClick={(event) => {
                                        return confirmPopup({
                                            target: event.currentTarget,
                                            message: "Ürünü silmek istediğinize emin misiniz?",
                                            icon: "pi pi-exclamation-triangle",
                                            acceptClassName: "p-button-danger",
                                            acceptLabel: "Sil",
                                            rejectLabel: "Vazgeç",
                                            accept: () => {
                                                setLoading(true);
                                                fetch(route('products.destroy', record.id), {
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
                                                        setProducts(data.products)
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
                                                })
                                            }
                                        })
                                    }}/>
                                </div>
                            }}/>
                        </DataTable>
                    </div>
                </div>
            </div>
            <ImageGenerator csrf_token={csrf_token} product={selectedProduct} visible={imageGeneratorVisible}
                            setVisible={setImageGeneratorVisible} toast={toast}/>
            <Update csrf_token={csrf_token} visible={updateProductVisible}
                    products={products.map(({id, order, name, sku}) => ({
                        id,
                        order,
                        name: String(sku + " - " + name).substring(0, 70)
                    }))} setVisible={setUpdateProductVisible} toast={toast} categories={productCategories}
                    onChange={(Pproducts) => {
                        setProducts(Pproducts);
                    }} product={selectedProduct}/>
            <Create csrf_token={csrf_token} visible={addProductVisible}
                    products={products.map(({id, order, name, sku}) => ({
                        id,
                        order,
                        name: String(sku + " - " + name).substring(0, 70)
                    }))} setVisible={setAddProductVisible} toast={toast} categories={productCategories}
                    onChange={(Pproducts) => {
                        setProducts(Pproducts);
                    }}/>
            <Categories csrf_token={csrf_token} toast={toast} visible={categoriesVisible} categoriesAll={categories}
                        setVisible={setCategoriesVisible}
                        onChange={(Ccategories) => setProductCategories(Ccategories)}/>
            <Images product={selectedProduct} visible={imageVisible} setVisible={setImageVisible} toast={toast}
                    csrf_token={csrf_token}/>
            <MessageDialog csrf_token={csrf_token} visible={smsVisible} setVisible={setSmsVisible} auth={auth}/>
        </AuthenticatedLayout>
    </>
}

export default Index;
