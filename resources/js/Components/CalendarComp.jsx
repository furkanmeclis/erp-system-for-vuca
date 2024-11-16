import {Calendar} from "primereact/calendar";
import {addLocale} from 'primereact/api';
import {Divider} from "primereact/divider";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";

const CalendarComp = ({
                          value = null, setValue = () => {
    }, onSearch = () => {
    }
                      }) => {
    addLocale('tr', {
        firstDayOfWeek: 1,
        showMonthAfterYear: false,
        dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        dayNamesMin: ['P', 'P', 'S', 'Ç', 'P', 'C', 'C'],
        monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
        today: 'Bugün',
        clear: 'Temizle',
    });

    return <>
        <Calendar
            value={value} onChange={(e) => {
            setValue(e.value)
        }} inline locale={"tr"} footerTemplate={() => <>
            <Toolbar start={() => {
                return <Button icon="pi pi-times" disabled={value === null} tooltip={"Temizle"} tooltipOptions={{
                    position: "top"
                }} size={"small"} onClick={() => setValue(null)}/>
            }} center={() => <div className={"flex flex-col items-center justify-center"}>
                {value ? <span className={"font-semibold"}>Seçili Tarih</span> : ""}
                {value ? <span>{value.toLocaleDateString()}</span> : ""}
            </div>} end={() => <>
                <Button icon="pi pi-search" disabled={value === null} tooltip={"Arama Yapın"} tooltipOptions={{
                    position: "top"
                }} size={"small"} severity={"success"} onClick={() => onSearch(value.toLocaleDateString())}/>
            </>}/>
        </>} maxDate={new Date()} />
    </>
}
export default CalendarComp;
