import React, {useState} from "react";
import {Dialog} from "primereact/dialog";
import {Toolbar} from "primereact/toolbar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {confirmDialog} from "primereact/confirmdialog";
import {confirmPopup} from "primereact/confirmpopup";

const Categories = ({csrf_token, visible, setVisible, toast, categoriesAll,onChange=() => {}}) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState(categoriesAll);
    const [newCategoryName, setNewCategoryName] = useState('');

    return <>

        <Dialog header="Kategoriler" maximizable visible={visible}
                style={{width: '50vw'}} onHide={() => setVisible(false)}
        >

            <DataTable value={categories} removableSort editMode="row" loading={loading}
                       header={<Toolbar className={"mb-3"} start={() => (<p>
                           Yeni Kategori Ekle
                       </p>)} center={() => <>
                           <InputText size={"small"} placeholder="Yeni Kategori Adı" value={newCategoryName}
                                      onChange={(e) => setNewCategoryName(e.target.value)}/>
                       </>} end={() => <>
                           <Button icon="pi pi-save" loading={loading} onClick={() => {
                               if (newCategoryName.length === 0) {
                                   toast.current.show({
                                       severity: 'error',
                                       summary: 'Hata',
                                       detail: 'Kategori adı boş olamaz!'
                                   });
                                   return;
                               }
                               setLoading(true);
                               let formData = new FormData();
                               formData.append("name", newCategoryName);
                               fetch(route("products.storeCategory"), {
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
                                       onChange(data.categories);
                                       setCategories(data.categories)
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
                           }} size={"small"} severity={"success"} tooltip={"Yeni Kategori Ekle"}/>
                       </>}/>} onRowEditComplete={(e) => {
                let _categories = [...categories];
                let {newData, index} = e;
                _categories[index] = newData;
                setLoading(true);
                let formData = new FormData();
                formData.append("name", newData.name);
                formData.append("_method", "PUT");
                fetch(route("products.updateCategory", newData.id), {
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
                        onChange(data.categories);
                        setCategories(data.categories)
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
                setCategories(_categories);
            }} paginator emptyMessage="Kategori bulunamadı."
                       currentPageReportTemplate="{first}. ile {last}. arası toplam {totalRecords} kayıttan"
                       paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                       rowsPerPageOptions={[5, 10, 25, 50]} rows={5} dataKey="id">
                <Column field="id" sortable header="ID"/>
                <Column field="name" sortable header="Kategori Adı"
                        editor={(options) => <InputText type="text" size={"small"} value={options.value}
                                                        onChange={(e) => options.editorCallback(e.target.value)}/>}/>
                <Column header="Düzenle" rowEditor={true}/>
                <Column header="Sil" align={"right"} style={{width: "3rem"}} body={(category) => <>
                    {category.id !== 0 &&
                        <Button icon="pi pi-times" className={"ml-2"} tooltip={"Kategoriyi Sil"}
                                tooltipOptions={{
                                    position: 'top',
                                }} size={"small"} onClick={(event) => {
                            confirmPopup({
                                target: event.currentTarget,
                                message: 'Kategoriyi silmek istediğinize emin misiniz?',
                                icon: 'pi pi-exclamation-triangle',
                                acceptClassName: 'p-button-danger',
                                accept: () => {
                                    setLoading(true);
                                    let formData = new FormData();
                                    formData.append("_method", "DELETE");
                                    fetch(route("products.destroyCategory", category.id), {
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
                                            onChange(data.categories);
                                            setCategories(data.categories)
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
                                },
                                acceptLabel: 'Sil',
                                rejectLabel: 'Vazgeç',
                            })
                        }} severity={"danger"}/>}
                </>}/>

            </DataTable>
        </Dialog>
    </>
}
export default Categories;
