import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import React, {useEffect, useState} from "react";
import {useDebounce} from "primereact/hooks";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {CartProvider, useCart} from "react-use-cart";
import {Dialog} from "primereact/dialog";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";

const Catalog = ({productsAll, categories, cartVisible, setCartVisible, phoneNumber}) => {
    const [products, setProducts] = useState(productsAll.map((product) => ({...product, quantity: 1})));
    const [layout, setLayout] = useState('grid');
    const [Sname, filterName, setFilterName] = useDebounce('', 300);
    const [Scategory, filterCategory, setFilterCategory] = useDebounce('', 300);
    const [Ssku, filterSku, setFilterSku] = useDebounce('', 300);
    useEffect(() => {
        let filteredProducts = productsAll.filter((product) => {
            let catName = filterCategory.name ? filterCategory.name : "";
            product.quantity = 1;
            return product.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase()) && product.category.toLocaleLowerCase().includes(catName.toLocaleLowerCase()) && String(product.sku).toLocaleLowerCase().includes(filterSku.toLocaleLowerCase());
        });
        setProducts(filteredProducts);
    }, [filterName, filterCategory, filterSku]);
    const AddCartButtons = ({product}) => {
        let {inCart, addItem, updateItemQuantity, items, getItem} = useCart();
        return <>
            {inCart(product.id) &&
                <Button icon="pi pi-minus" className={"p-button-rounded mr-2"} size={"small"} severity={"danger"}
                        tooltip={"Adet Azalt"} tooltipOptions={{
                    position: "top"
                }} onClick={() => {
                    updateItemQuantity(product.id, getItem(product.id).quantity - 1)
                }}/>}
            {!inCart(product.id) && <Button icon="pi pi-shopping-cart"
                                            tooltip={"Sepete Ekle"} tooltipOptions={{
                position: "top"
            }} className="p-button-rounded" severity={"info"} onClick={() => {
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.campaign_price,
                    sku: product.sku,
                }, 1)
            }}/>}
            {inCart(product.id) && <div
                className="w-12 h-12 inline-flex items-center justify-center font-semibold rounded-full bg-blue-200 dark:bg-blue-800 text-gray-900 dark:text-gray-100 mr-2"
            >
                {getItem(product.id).quantity}
            </div>
            }
            {inCart(product.id) &&
                <Button icon="pi pi-plus" className={"p-button-rounded"} size={"small"} severity={"success"}
                        tooltip={"Adet Arttır"} tooltipOptions={{
                    position: "top"
                }} onClick={() => {
                    updateItemQuantity(product.id, getItem(product.id).quantity + 1)
                }}/>}
        </>
    }
    const listItem = (product, index) => {
        return (
            <div className="col-span-12" key={product.id}>
                <div
                    className={classNames(
                        'flex flex-col md:flex-row md:items-start p-4 gap-4',
                        { 'border-t border-gray-300 dark:border-gray-700': index !== 0 }
                    )}
                >
                    <img
                        className="w-24 sm:max-h-[10rem] object-cover sm:w-64 md:w-40 block md:block mx-auto rounded"
                        src={`${product.images[0]}`}
                        alt={product.name}
                    />
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start flex-1 gap-4">
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {product.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="pi pi-qrcode"></i>
                                <span
                                    className="font-bold"
                                    dangerouslySetInnerHTML={{
                                        __html: String(product.sku).replace(
                                            "CKY",
                                            `<span class="text-red-500 dark:text-red-400">CKY</span>`
                                        ),
                                    }}
                                ></span>
                            </div>
                            <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2">
                        <i className="pi pi-tag"></i>
                        <span className="font-semibold text-gray-800 dark:text-gray-300">
                            {product.category}
                        </span>
                    </span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                    {product.campaign_price} TL
                </span>
                        </div>
                        <div className="flex flex-row lg:flex-col items-center justify-center md:items-end gap-3 md:gap-2 h-full">
                            <div>
                                <AddCartButtons product={product} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    const gridItem = (product) => {
        return (
            <div className="p-2" key={product.id}>
                <div className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg h-[30rem] relative">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="text-gray-800 dark:text-gray-300">{product.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="pi pi-qrcode"></i>
                            <span
                                className="font-bold text-gray-800 dark:text-gray-300"
                                dangerouslySetInnerHTML={{
                                    __html: String(product.sku).replace(
                                        "CKY",
                                        `<span class="text-red-500 dark:text-red-400">CKY</span>`
                                    ),
                                }}
                            ></span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-3 py-5">
                        <img className="rounded h-[15rem]" src={`${product.images[0]}`} alt={product.name} />
                        <div className="font-semibold w-full text-start text-gray-900 dark:text-gray-100">
                            {product.name}
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                    {product.campaign_price} TL
                </span>
                            <AddCartButtons product={product} />
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product, index);
        else if (layout === 'grid') return gridItem(product);
    };

    const listTemplate = (products, layout) => {
        return <div
            className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3">{products.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    const header = () => {
        return (<>
                <Toolbar className={"mb-3"} start={<>
                    <InputText placeholder="Ürün Adına Göre Arama"
                               onChange={(e) => setFilterName(e.target.value)}
                               value={Sname}
                               type="text"/>
                </>} center={<>
                    <InputText placeholder="Ürün Koduna Göre Arama"
                               onChange={(e) => setFilterSku(e.target.value)}
                               value={Ssku}
                               type="text"/>
                </>} end={<div className={"sm:w-full"}>
                    <Dropdown value={Scategory} options={categories} onChange={(e) => {

                        if (e.value === undefined) {
                            setFilterCategory({name: ""});
                        } else {
                            setFilterCategory(e.value)

                        }
                    }}
                              showClear
                              optionLabel="name" placeholder="Kategoriye Göre Arama" className="w-60"/>
                </div>}/>
                <div className="flex justify-between">
                    <div className={"flex items-center  "}>
                    <span
                        className={"font-bold text-xl bg-gradient-to-r from-blue-300 via-blue-600 to-blue-300 text-transparent bg-clip-text inline-block"}>
                    ÜRÜN KATALOĞU ({products.length} ÜRÜN)
                    </span>
                    </div>

                    <div>

                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)}/>
                    </div>
                </div>
            </>
        );
    };

    const CardDialog = () => {
        let {items, emptyCart, removeItem} = useCart();

        return <Dialog visible={cartVisible}
                       onHide={() => setCartVisible(false)}
                       draggable={false}
                       header={"Sepetim" + ` (Toplam: ${items.reduce((acc, item) => acc + item.itemTotal, 0)} TL)`}
                       modal
                       style={{width: '50vw'}}
                       breakpoints={{'960px': '75vw', '641px': '100vw'}}
                       footer={<>
                           <Button label={"Kapat"} icon="pi pi-times" size={"small"}
                                   onClick={() => setCartVisible(false)}
                                   severity={"secondary"}/>
                           {items.length > 0 &&
                               <Button severity={"danger"} size="small" icon={"pi pi-trash"} label="Sepeti Temizle"
                                       onClick={(event) => {
                                           confirmPopup({
                                               target: event.currentTarget,
                                               message: 'Sepeti temizlemek istediğinize emin misiniz?',
                                               icon: 'pi pi-exclamation-triangle',
                                               acceptClassName: 'p-button-danger',
                                               accept: () => {
                                                   emptyCart();
                                               },
                                               acceptLabel: 'Sil',
                                               rejectLabel: 'İptal',
                                           });
                                       }}/>}
                           {items.length > 0 &&
                               <Button severity={"success"} size="small" icon={"pi pi-send"} label="Onayla"
                                       onClick={() => {
                                           let message = "Merhaba, Sepetimdeki ürünler aşağıdaki gibidir: \n";
                                           items.forEach((item) => {
                                               message += `*${item.sku}* - ${item.quantity} Adet - ${item.name}\n`;
                                           });
                                           message += "Sipariş Listem Bu Kadar. Dönüşünüzü Bekliyorum. Teşekkürler.";
                                           setTimeout(() => {
                                                  emptyCart();
                                           }, 5000);
                                           window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

                                       }}/>}


                       </>}
        >
            <DataTable value={items} emptyMessage={"Sepetiniz Boş"} stripedRows removableSort paginator rows={5}
                       rowsPerPageOptions={[5, 10, 25, 50]}>
                <Column field="sku" align={"left"} sortable header="Ürün Kodu"></Column>
                <Column field="name" align={"left"} sortable header="Ürün Adı"></Column>
                <Column field="quantity" align={"center"} sortable header="Adet"></Column>
                <Column field="price" header="Fiyat" sortable align={"center"}
                        body={({price}) => price + " TL"}></Column>
                <Column field="itemTotal" align={"right"} sortable header="Ara Toplam"
                        body={({itemTotal}) => itemTotal + " TL"}></Column>
                <Column field={"actions"} align={"center"} header={"İşlemler"} body={({id}) => {
                    return <Button icon="pi pi-trash" className={"p-button-rounded p-button-danger"} size={"small"}
                                   onClick={() => {
                                       removeItem(id);
                                   }}/>
                }}/>
            </DataTable>
        </Dialog>
    }
    return <CartProvider>
        <ConfirmPopup/>
        <DataView value={products} listTemplate={listTemplate} layout={layout} header={header()}
                  paginator rows={24}/>
        <CardDialog/>
    </CartProvider>
}
export default Catalog;
