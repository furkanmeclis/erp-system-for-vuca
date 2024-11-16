import {Card} from 'primereact/card';
import {useState, useEffect, useRef} from 'react';
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

const CurrencyUpdate = ({csrf_token}) => {
    const toast = useRef(null);
    const [currency, setCurrency] = useState(0);
    const [oldCurrency, setOldCurrency] = useState(0);
    const [loading, setLoading] = useState(true);

    const getCurrency = () => {
        setLoading(true);
        fetch(route("system.currency"), {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf_token
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setCurrency(data.currency);
                    setOldCurrency(data.currency);
                    setLoading(false);
                } else {
                    toast.current.show({severity: 'error', summary: 'Hata', detail: data.message});
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Hata', detail: 'Kur bilgisi alınamadı!'});
                setLoading(false);
            });
    }
    useEffect(() => {
        getCurrency();
    }, []);
    const updateCurrency = () => {
        setLoading(true);
        let formData = new FormData();
        formData.append('currency', currency);
        fetch(route("system.currencyUpdate"), {
            method: 'POST', headers: {
                'X-CSRF-TOKEN': csrf_token
            }, body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    setOldCurrency(currency);
                    toast.current.show({severity: 'success', summary: 'Başarılı', detail: 'Kur bilgisi güncellendi!'});
                    setLoading(false);
                } else {
                    toast.current.show({severity: 'error', summary: 'Hata', detail: data.message});
                    setLoading(false);
                }
            })
            .catch((error) => {
                toast.current.show({severity: 'error', summary: 'Hata', detail: 'Kur bilgisi güncellenemedi!'});
                setLoading(false);
            });
    }
    return <>
        <Toast ref={toast}/>
        <Card title={"Kur Bilgisi "} subTitle={`1$ = ${oldCurrency} TL`}>
            <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">1 $ = </span>
                <InputNumber placeholder="Kur Bilgisi" mode={"currency"}
                             disabled={loading}
                             onChange={(e) => setCurrency(e.value)}
                             value={currency}
                             currency={"TRY"}/>
                <span className="p-inputgroup-addon p-0">
                    <Button icon="pi pi-sync" loading={loading} disabled={currency === oldCurrency}
                            onClick={updateCurrency}
                            className="p-button-success rounded-l-none"/>
                </span>
            </div>
        </Card>
    </>
}
export default CurrencyUpdate;
