import {Button} from "primereact/button";
import React from "react";
import {Dialog} from "primereact/dialog";
import {Image} from "primereact/image";
import {confirmPopup} from "primereact/confirmpopup";
import {FileUpload} from 'primereact/fileupload';

const Images = ({product, visible, setVisible, toast, csrf_token}) => {
    const [loading, setLoading] = React.useState(false);
    const [media, setMedia] = React.useState([]);
    const getImages = () => {
        setLoading(true);
        fetch(route('products.getImages', product.id))
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setMedia(data.media);
                } else {
                    toast.current.show({severity: 'error', summary: 'Hata', detail: data.message});
                }
            }).catch(error => {
            toast.current.show({severity: 'error', summary: 'Hata', detail: 'Bir hata oluştu'});
        }).finally(() => {
            setLoading(false);
        });
    }
    React.useEffect(() => {
        if (visible) {
            getImages();
        } else {
            setMedia([]);
        }
    }, [visible]);
    return <>
        <Dialog header={"'" + product?.name + ("' Adlı Ürünün Görselleri")} style={{width: '50vw'}}
                breakpoints={{'960px': '75vw', '641px': '100vw'}}
                onHide={() => setVisible(false)} maximizable visible={visible}
                footer={<>
                    <Button label="Kapat" icon="pi pi-times" loading={loading} severity={"secondary"} size={"small"}
                            onClick={() => setVisible(false)}/>
                    <Button label="Resimleri Yenile" icon="pi pi-sync" loading={loading} severity={"help"}
                            size={"small"} onClick={() => getImages()}/>
                </>}

        >
            <div className={"grid grid-cols-2 gap-3 lg:grid-cols-4 mb-3"}>
                {media.map(({name, url, deleteUrl}, index) => {
                    return <div className={"border border-dashed border-black rounded overflow-hidden relative"}>
                        <div>
                            <Button icon="pi pi-cloud-download" tooltip={"Ürün Resmini İndir"} tooltipOptions={{
                                position: 'top'
                            }} loading={loading} className={"p-button-info p-button-rounded absolute top-1 left-1 z-40"}
                                    onClick={(e) => {
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = name;
                                        a.click();
                                        toast.current.show({
                                            severity: 'success',
                                            summary: 'Başarılı',
                                            detail: "'" + (name) + "' Adlı Resim İndirildi"
                                        });
                                    }}/>
                            <Button icon="pi pi-trash" tooltip={"Ürün Resmini Sil"} tooltipOptions={{
                                position: 'top'
                            }} loading={loading}
                                    className={"p-button-danger p-button-rounded absolute top-1 right-1 z-40"}
                                    onClick={(e) => {
                                        confirmPopup({
                                            target: e.currentTarget,
                                            message: `"${name}" adlı resmi silmek istediğinize emin misiniz?`,
                                            icon: 'pi pi-exclamation-triangle',
                                            acceptClassName: 'p-button-danger',
                                            acceptLabel: 'Sil',
                                            rejectLabel: 'Vazgeç',
                                            accept: () => {
                                                setLoading(true);
                                                fetch(deleteUrl, {
                                                    method: 'DELETE',
                                                    headers: {
                                                        'X-CSRF-TOKEN': csrf_token
                                                    }
                                                }).then(response => response.json())
                                                    .then(data => {
                                                        if (data.status) {
                                                            getImages();
                                                            toast.current.show({
                                                                severity: 'success',
                                                                summary: 'Başarılı',
                                                                detail: data.message
                                                            });
                                                        } else {
                                                            toast.current.show({
                                                                severity: 'error',
                                                                summary: 'Hata',
                                                                detail: data.message
                                                            });
                                                        }
                                                    }).catch(error => {
                                                    toast.current.show({
                                                        severity: 'error',
                                                        summary: 'Hata',
                                                        detail: 'Bir hata oluştu'
                                                    });
                                                }).finally(() => {
                                                    setLoading(false);
                                                });
                                            }
                                        });
                                    }}/>
                        </div>
                        <Image src={url} alt={"Resim"} key={index} preview className={"w-full h-full"}/>
                    </div>
                })}
            </div>
            <FileUpload
                multiple
                name={"images[]"}
                uploadOptions={{
                    className: 'p-button-success p-button-rounded p-mr-2',
                }}
                uploadLabel={"Resimleri Yükle"}
                chooseOptions={{
                    className: 'p-button-info p-button-rounded p-mr-2',
                }}
                chooseLabel={"Resimleri Seç"}
                cancelOptions={{
                    className: 'p-button-danger p-button-rounded',
                }}
                cancelLabel={"Seçimi Temizle"}
                accept={"image/*"}
                withCredentials={true}
                onBeforeUpload={(event) => {
                    setLoading(true);
                }}
                onBeforeSend={(event) => {
                    event.xhr.setRequestHeader('X-CSRF-TOKEN', csrf_token);
                }}
                onError={(event) => {
                    setLoading(false);
                    toast.current.show({severity: 'error', summary: 'Hata', detail: 'Bir hata oluştu'});
                }}
                onUpload={(event) => {
                    let {status, message} = JSON.parse(event.xhr.response);
                    setLoading(false);
                    if (status) {
                        getImages();
                        toast.current.show({severity: 'success', summary: 'Başarılı', detail: message});
                    } else {
                        toast.current.show({severity: 'error', summary: 'Hata', detail: message});
                    }
                }}
                url={route('products.uploadImages', product?.id || 0)}
                emptyTemplate={<p className="m-0">Yeni Ekleyeceğin Resimleri Bu Alana Sürükleyebilirsin...</p>}
            />
        </Dialog>
    </>;
}
export default Images;
