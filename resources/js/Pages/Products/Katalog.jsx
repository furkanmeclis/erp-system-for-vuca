import React, {useEffect, useRef} from "react";
import {VirtualScroller} from "primereact/virtualscroller";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import html2canvas from "html2canvas";
import {PDFDocument} from "pdf-lib";
import {Buffer} from "buffer";
import catalogCKY from "../../../css/catalog.module.css";
import {router} from "@inertiajs/react";
import {Dialog} from 'primereact/dialog';
import {ProgressBar} from "primereact/progressbar";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {InputSwitch} from "primereact/inputswitch";
import {ColorPicker} from "primereact/colorpicker";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {useDebounce} from "primereact/hooks";
import {getCatalogProducts} from "@/helpers/helper.js";
import {BlockUI} from "primereact/blockui";

const Katalog = ({auth, defaultImage, categories, csrf_token}) => {
    const [visible, setVisible] = React.useState(false);
    const [productsAll, setProductsAll] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [logoImg, setLogoImg] = React.useState(defaultImage);
    const pageRef = React.useRef();
    const filigranRef = React.useRef();
    const [loading, setLoading] = React.useState(true);
    const [Sname, filterName, setFilterName] = useDebounce('', 300);
    const [Scategory, filterCategory, setFilterCategory] = useDebounce('', 300);
    const [Ssku, filterSku, setFilterSku] = useDebounce('', 300);
    const [skuD, setSkuD] = React.useState("CKY");
    const abortControllers = useRef([]); // Tüm resim yüklemeleri için

    useEffect(() => {
        // Sayfa değiştiğinde tüm istekleri iptal et
        return () => {
            abortControllers.current.forEach(controller => controller.abort());
        };
    }, []);

    const handleImageLoad = (product) => {
        const controller = new AbortController();
        abortControllers.current.push(controller);
        const img = new Image();
        img.src = product.images[0];
        img.onerror = () => {
            console.error(`Failed to load image for ${product.name}`);
        };
        return () => {
            controller.abort();
        };
    };
    useEffect(() => {
        let filteredProducts = productsAll.filter((product) => {
            let catName = filterCategory.name ? filterCategory.name : "";
            product.quantity = 1;
            return product.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase()) && product.category.toLocaleLowerCase().includes(catName.toLocaleLowerCase()) && String(product.sku).toLocaleLowerCase().includes(filterSku.toLocaleLowerCase());
        });
        setProducts(filteredProducts);
    }, [filterName, filterCategory, filterSku]);
    useEffect(() => {
        getCatalogProducts(csrf_token).then((response) => {
            if (response.status) {
                setProducts(response.data);
                setProductsAll(response.data)
            } else {
                toast.current.show({
                    severity: 'error', summary: 'Hata', detail: 'Ürünler yüklenirken bir hata oluştu.'
                })
            }
        }).catch((err) => {
            console.log(err);
            toast.current.show({
                severity: 'error', summary: 'Hata', detail: 'Ürünler yüklenirken bir hata oluştu.'
            })
        }).finally(() => setLoading(false));
    }, []);
    useEffect(() => {
        if (skuD !== "CKY") {
            setProducts(prevState => {
                return productsAll.map(bfg => {
                    let newSku = String(bfg.sku).replace("CKY", skuD);
                    return {...bfg, sku: newSku}
                });
            });
        }
    }, [skuD])
    const [options, setOptions] = React.useState(localStorage.getItem("options") ? JSON.parse(localStorage.getItem("options")) : {
        colCount: 2,
        rowCount: 5,
        margin: 10,
        scale: 1,
        width: 595,
        height: 842,
        fontSize: 20,
        fontSizeSKU: 16,
        fontSizeName: 20,
        colorName: "#ffffff",
        colorPrice: "#aaff00",
        colorSku: "#ffffff",
        colorNameBg: "#0048ff",
        filigranDisplay: true,
    });

    React.useEffect(() => {
        localStorage.setItem("options", JSON.stringify(options));
    }, [options]);

    const getCount = (col) => {
        if (col === 2) {
            return 6;
        } else if (col === 3) {
            return 4;
        } else if (col === 4) {
            return 3;
        } else if (col === 6) {
            return 2;
        } else if (col === 12) {
            return 1;
        }
    };

    const [progress, setProgress] = React.useState(0);
    const [event, setEvent] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const perPage = getCount(options.colCount) * options.rowCount;

    const generatePdf = async () => {
        setEvent(true);
        let randomString = Math.random().toString(36).substring(7);
        setProgress(0);
        const totalLength = Math.ceil(products.length / perPage);
        setMessage("PDF Oluşturuluyor...");

        const pdfDoc = await PDFDocument.create();
        const pageWidth = options.width;
        const pageHeight = options.height;

        let lastCategory = "";

        for (let i = 0; i < totalLength; i++) {

            setProgress(Math.ceil((i / totalLength) * 100));

            const cacheProductDiv = document.createElement("div");
            cacheProductDiv.className = "ckymotoKATALOGRow";
            cacheProductDiv.id = "cacheProductDiv" + i;
            document.getElementById("content").appendChild(cacheProductDiv);

            const productIndex = i * perPage;

            for (let j = 0; j < perPage; j++) {
                if (products[productIndex + j]) {
                    let pr = products[productIndex + j];
                    if (lastCategory !== pr.category) {
                        lastCategory = pr.category;
                        cacheProductDiv.innerHTML += `<div class="${catalogCKY.ckymotoCatalogTitle} ckymotoKATALOGCol-12"><img src="` + logoImg + `"  alt="LOGO   "/>${pr.category}<img src="` + logoImg + `"  alt="LOGO   "/></div>`;
                    }
                    cacheProductDiv.innerHTML += getHTML(pr);
                }
            }

            await html2canvas(cacheProductDiv, {
                useCORS: true, scale: options.scale,
            }).then(async (canvas) => {
                let urlX = canvas.toDataURL("image/png");
                const imageBytes = urlX.split(",")[1];
                const image = await pdfDoc.embedPng(Buffer.from(imageBytes, "base64"));

                const page = pdfDoc.addPage([pageWidth, pageHeight]);
                page.drawImage(image, {
                    x: options.margin,
                    y: options.margin,
                    width: pageWidth - options.margin * 2,
                    height: pageHeight - options.margin * 2,
                });
            });

            document.getElementById("cacheProductDiv" + i).remove();
        }

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `KATALOG - ${randomString}.pdf`;
        link.click();

        setProgress(100);
        setMessage("PDF İNDİRİLDİ");
        setTimeout(() => {
            setEvent(false);
        }, 1000);
    };

    const getHTML = (product) => {
        return `<div class="` + catalogCKY.ckymotoCatalogProduct + ` ckymotoKATALOGCol ckymotoKATALOGCol-${(options.colCount)}">
            <img src="${product.images[0]}" alt="${product.name}" />
            <div class="${catalogCKY.ckymotoCatalogSkuGrid}">
                <div class="${catalogCKY.ckymotoCatalogSkuValue}" style="padding-bottom: 14px !important;">${product.sku}</div>
            </div>
            <div class="${catalogCKY.ckymotoCatalogProductName}">
                ${product.name}
            </div>
            <div class="${catalogCKY.ckymotoCatalogPriceGrid}" >
                <div class="${catalogCKY.ckymotoCatalogPriceValue}" style="padding-bottom: 14px !important;">${product.campaign_price} TL</div>
            </div>
        </div>`;
    }
    let lastCategoryz = "";
    const [sku, setSku] = React.useState("");
    const [productName, setProductName] = React.useState("");
    return (<>
        <Dialog onHide={() => setVisible(false)} visible={visible} style={{width: "30vw"}} position={"bottom-right"}
                footer={<div className={"flex justify-end"}>
                    <Button label="Kapat" severity={"secondary"} icon="pi pi-times" size={"small"}
                            onClick={() => setVisible(false)}/>
                </div>}
                modal={true} header="PDF Ayarları">
            <div className="p-fluid">
                <div className="mb-3">
                    <label htmlFor="sku" className="font-bold">
                        Ürün Kodu <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputText value={skuD} onChange={(e) => {
                        if (e.target.value === "") {
                            setSkuD("CKY");
                        } else {
                            setSkuD(e.target.value)
                        }
                    }} placeholder="Ürün Kodu"/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="colCount" className="font-bold">
                        Kolon Sayısı <span className={"font-semibold text-red-400"}>*</span>

                    </label>
                    <Dropdown
                        inputId={"colCount"}
                        options={[{label: "1", value: 12}, {label: "2", value: 6}, {
                            label: "3", value: 4
                        }, {label: "4", value: 3}, {label: "6", value: 2},]} value={options.colCount} filter
                        showClear={false}
                        onChange={(e) => setOptions({...options, colCount: e.value})}
                        placeholder="Kolon Sayısı"/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="rowCount" className="font-bold">
                        Satır Sayısı <span className={"font-semibold text-red-400"}>*</span>

                    </label>
                    <InputNumber value={options.rowCount}
                                 inputId={"rowCount"}
                                 placeholder={"Satır Sayısı"}
                                 onChange={(e) => setOptions({...options, rowCount: e.value})} min={1} max={10}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="filigranDisplay" className="font-bold">
                        Filigran Göster <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <br/>
                    <InputSwitch checked={options.filigranDisplay}
                                 inputId={"filigranDisplay"}
                                 onChange={(e) => setOptions({...options, filigranDisplay: e.value})}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="filigranDisplay" className="font-bold">
                        Filigran Görseli <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <br/>
                    <img src={logoImg} alt="Filigran LOGO"
                         className={"w-auto h-20 mx-auto rounded-lg border border-gray-300 shadow-md"}
                    />
                    <input type="file" name="" id="" className={"hidden"} ref={filigranRef} onChange={(event) => {
                        const file = event.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            setLogoImg(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }}/>
                    <Button label="Görsel Seç" size={"small"} icon="pi pi-image" className={"mt-2 "} onClick={() => {
                        filigranRef.current.click();
                    }}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="fontSizeSKU" className="font-bold mb-2">
                        Ürün Kodu Font (px) <span className={"font-semibold text-red-400"}>*</span><ColorPicker
                        format="hex" className={"w-8"} value={options.colorSku} onChange={(e) => setOptions({
                        ...options, colorSku: "#" + e.value
                    })}/>
                    </label>
                    <InputNumber value={options.fontSizeSKU}
                                 inputId={"fontSizeSKU"}
                                 placeholder={"Ürün Kodu Font"}
                                 onChange={(e) => setOptions({...options, fontSizeSKU: e.value})} min={1}
                                 max={100}/>

                </div>
                <div className={"mb-3"}>
                    <label htmlFor="fontSizeName" className="font-bold mb-2">
                        Ürün Adı Font (px) <span className={"font-semibold text-red-400"}>*</span>
                        <ColorPicker format="hex" className={"w-8"} value={options.colorName}
                                     onChange={(e) => setOptions({
                                         ...options, colorName: "#" + e.value
                                     })}/>
                    </label>
                    <InputNumber value={options.fontSizeName}
                                 inputId={"fontSizeName"}
                                 placeholder={"Ürün Adı Font"}
                                 onChange={(e) => setOptions({...options, fontSizeName: e.value})} min={1}
                                 max={100}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="fontSize" className="font-bold mb-2">
                        Fiyat Font (px) <span className={"font-semibold text-red-400"}>*</span>
                        <ColorPicker format="hex" className={"w-8"} value={options.colorPrice}
                                     onChange={(e) => setOptions({
                                         ...options, colorPrice: "#" + e.value
                                     })}/>
                    </label>
                    <InputNumber value={options.fontSize}
                                 inputId={"fontSize"}
                                 placeholder={"Fiyat Font"}
                                 onChange={(e) => setOptions({...options, fontSize: e.value})} min={1} max={100}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="colorNameBg" className="font-bold mb-1">
                        Ürün Adı Arkaplan Rengi <span className={"font-semibold text-red-400"}>*</span>
                        <ColorPicker format="hex" className={"w-8"} value={options.colorNameBg}
                                     onChange={(e) => setOptions({
                                         ...options, colorNameBg: "#" + e.value
                                     })}/>
                    </label>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="margin" className="font-bold">
                        Kenar Boşluğu (px) <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputNumber value={options.margin}
                                 inputId={"margin"}
                                 placeholder={"Kenar Boşluğu"}
                                 onChange={(e) => setOptions({...options, margin: e.value})} min={0}
                                 max={100}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="scale" className="font-bold">
                        Kalite <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputNumber value={options.scale}
                                 inputId={"scale"}
                                 placeholder={"Ölçek"}
                                 minFractionDigits={1}
                                 onChange={(e) => setOptions({...options, scale: e.value})} min={0.1}
                                 max={2}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="width" className="font-bold">
                        Genişlik (px) <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputNumber value={options.width}
                                 inputId={"width"}
                                 placeholder={"Genişlik"}
                                 onChange={(e) => setOptions({...options, width: e.value})} min={100}
                                 max={1000}/>
                </div>
                <div className={"mb-3"}>
                    <label htmlFor="height" className="font-bold">
                        Yükseklik (px) <span className={"font-semibold text-red-400"}>*</span>
                    </label>
                    <InputNumber value={options.height}
                                 inputId={"height"}
                                 placeholder={"Yükseklik"}
                                 onChange={(e) => setOptions({...options, height: e.value})} min={100}
                                 max={1000}/>
                </div>
            </div>
        </Dialog>
        <AuthenticatedLayout
            user={auth.user}
            header="Katalog"
            info={[{
                text: products.length + " Ürün", icon: "pi-box", hidden: event,
            }, {
                text: `${productsAll.map((product) => product.category).filter((value, index, self) => self.indexOf(value) === index).length} Kategori`,
                icon: "pi-bars",
                hidden: event,
            }, {
                text: `${productsAll.map((product) => {
                    if (product.images.length === 0) {
                        return true;
                    } else {
                        return null;
                    }
                }).filter(Boolean).length} Resimsiz Ürün`,
                icon: "pi-exclamation-triangle",
                hidden: productsAll.map((product) => {
                    if (product.images.length === 0) {
                        return true;
                    } else {
                        return null;
                    }
                }).filter(Boolean).length === 0 || event,
            }, {
                text: "PDF OLUŞTURULUYOR İŞLEM YAPMAYINIZ", icon: "pi-spin pi-spinner text-orange-400", hidden: !event,
            }, {
                icon: "pi-stopwatch", text: "Aramalarda 300ms Bilinçli Gecikme Vardır."
            }]}
            buttons={[{
                icon: "pi pi-stop", tooltip: "PDF Oluşturmayı Durdur", tooltipOptions: {
                    position: "bottom",
                }, size: "small", severity: "danger", className: event ? "" : "hidden", onClick: () => {
                    router.visit(route("products.katalog"));
                },
            }, {
                icon: "pi pi-file-pdf", tooltip: "PDF Oluştur", severity: "success", tooltipOptions: {
                    position: "bottom",
                }, size: "small", onClick: () => {
                    generatePdf();
                },
            }, {
                icon: "pi pi-cog", tooltip: "PDF Ayarları", tooltipOptions: {
                    position: "bottom",
                }, size: "small", severity: "help", onClick: () => {
                    setVisible(true);
                },
            },

            ]}
        >

            <div className="py-6"
                 style={{

                     "--filigranUrl": "url(" + logoImg + ")",
                 }}
            >
                <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-8">
                    <BlockUI blocked={loading}
                             template={<i className="pi pi-spin pi-spinner" style={{fontSize: '3rem'}}></i>}>
                        {event && <ProgressBar value={progress} className={"mb-3"}/>}
                        {!event && <Toolbar className={"mb-3"} start={<>
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
                        </div>}/>}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className={catalogCKY.ckymotoCatalogContainer + " px-2"} id={"content"} style={{
                                "--priceSize": options.fontSize + "px",
                                "--skuSize": options.fontSizeSKU + "px",
                                "--nameSize": options.fontSizeName + "px",
                                "--priceColor": options.colorPrice,
                                "--skuColor": options.colorSku,
                                "--nameColor": options.colorName,
                                "--nameBgColor": options.colorNameBg,
                                "--filigranDisplay": options.filigranDisplay ? "block" : "none",
                            }}>
                                {!event && (<div className={"ckymotoKATALOGRow mt-[-13px]"} ref={pageRef}>
                                    {products.map((product, index) => {
                                        let farkli = false;
                                        if (lastCategoryz !== product.category) {
                                            farkli = true;
                                        }
                                        lastCategoryz = product.category;
                                        let visible = true;
                                        if (sku !== "") {
                                            if (product.sku.indexOf(sku) === -1) {
                                                visible = false;
                                            }
                                        }
                                        if (productName !== "") {
                                            if (product.name.indexOf(productName) === -1) {
                                                visible = false;
                                            }
                                        }
                                        return (<React.Fragment key={index + "fragment"}>

                                            {farkli && (<div
                                                className={`${catalogCKY.ckymotoCatalogTitle} ${visible ? "" : catalogCKY.ckymotoCatalogNone} ckymotoKATALOGCol-12`}
                                                key={index + "title"}>
                                                <img src={logoImg} alt="LOGO   "/>
                                                {product.category}
                                                <img src={logoImg} alt="LOGO   "/>
                                            </div>)}
                                            <div
                                                className={`${catalogCKY.ckymotoCatalogProduct} ${visible ? "" : catalogCKY.ckymotoCatalogNone} ckymotoKATALOGCol ckymotoKATALOGCol-${(options.colCount)}`}
                                                key={product.id}>
                                                <img src={product.images[0]} alt={product.name}
                                                     onLoad={() => handleImageLoad(product)}/>
                                                <div className={catalogCKY.ckymotoCatalogSkuGrid}>
                                                    <span
                                                        className={catalogCKY.ckymotoCatalogSkuValue}>{product.sku}</span>
                                                </div>
                                                <div className={catalogCKY.ckymotoCatalogProductName}>
                                                    {product.name}
                                                </div>
                                                <div className={catalogCKY.ckymotoCatalogPriceGrid}>
                                                    <span
                                                        className={catalogCKY.ckymotoCatalogPriceValue}>{product.campaign_price} TL</span>
                                                </div>
                                            </div>
                                        </React.Fragment>)
                                    })}
                                </div>)}
                            </div>
                        </div>
                    </BlockUI>
                </div>
            </div>
        </AuthenticatedLayout>
    </>);
};

export default Katalog;
