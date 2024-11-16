import {Button} from "primereact/button";
import React from "react";
import {Dialog} from "primereact/dialog";
import campaign from "../../../css/campaign.module.css"
import html2canvas from "html2canvas";
import {InputText} from "primereact/inputtext";
import {Divider} from "primereact/divider";
const ImageGenerator = ({ product ,visible,setVisible,toast}) => {
    const [loading, setLoading] = React.useState(false);
    const divRef = React.useRef(null);
    const [campaignText, setCampaignText] = React.useState('');
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
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    const handleDownloadImage = async () => {
        setLoading(true);
        const element = divRef.current;
        const canvas = await html2canvas(element, {
            useCORS: true,
            imageTimeout: 0,
        });
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = product.sku + "-" + getRandomInt(9999) + '.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(data);
        }
        setLoading(false);
        toast.current.show({severity: 'success', summary: 'Başarılı', detail: 'Görsel başarıyla indirildi'});
    }
    return <>
        <Dialog header="Kampanya Görseli İndir" maximizable visible={visible}
                fullScreen={true}
                style={{width: '60vw'}} onHide={() => setVisible(false)}
                footer={<>
                    <Divider />
                    <div className={"w-full flex justify-between items-center"}>
                        <InputText value={campaignText} onChange={(e) => setCampaignText(e.target.value)} placeholder={"Kampanya Metni"} />
                        <div><Button label="Kapat" icon="pi pi-times" size={"small"} loading={loading} severity={"secondary"}
                                     onClick={() => setVisible(false)}/>
                            <Button label="Kaydet" icon="pi pi-save" size={"small"} loading={loading} className="p-button-success"
                                    onClick={handleDownloadImage}
                            /></div>
                    </div>
                </>}
        >
            <div className={campaign.bgh}>
                <div className={campaign.container}>
                    <div className={`${campaign.card}`} ref={divRef}>
                        <div className={campaign.top}>
                            {campaignText !== '' && (<p className={campaign.toptop}>{campaignText}</p>)}
                            {product?.name}
                        </div>
                        <div className={campaign.bottom}>
                            <div className={campaign.priceArea}>
                                <div className={campaign.empty}></div>
                                <div className={campaign.price}>
                                    <div className={campaign.priceCurrency}>₺</div>
                                    <div className={campaign.priceAmount}>{product?.campaign_price}</div>
                                </div>
                                <div className={campaign.priceLogo}>
                                    <img
                                        src={
                                            '/storage/images/logo.png'
                                        }
                                        className={campaign.priceLogoImg}
                                    />
                                </div>
                            </div>
                            <div className={campaign.imageArea}>
                                <img
                                    className={campaign.imageLogo}
                                    src={
                                        '/storage/images/logo.png'
                                    }
                                />
                                <img
                                    src={
                                        '/storage/images/logo.png'
                                    }
                                    className={campaign.logoAbc}
                                />
                                <img
                                    className={campaign.productImage}
                                    src={media[0]?.url}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
        </>
}
export default ImageGenerator;
