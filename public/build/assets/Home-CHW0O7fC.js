import{r as b,j as e,R as x,Y as R,y as d}from"./app-CZojdjD4.js";import{A as B}from"./AuthenticatedLayout-B_5TWh4u.js";import{C as u}from"./card.esm-C5BbytLT.js";import{B as l}from"./button.esm-Cv2vqUD6.js";import{M as A}from"./MessageDialog-kpj0qJ0p.js";import M from"./PreCreate-BRhRFqiv.js";import{T as K}from"./toast.esm-Ci78TIq9.js";import{P as U}from"./progressbar.esm-Bu0LTKJp.js";import{T as F}from"./tag.esm-CzqNWVCB.js";import{I as O}from"./inputnumber.esm-BkIM76z1.js";import{B as P}from"./blockui.esm-CT455C9i.js";import{b as L}from"./helper-5dsdU7t8.js";import"./ApplicationLogo-C3VFVwyk.js";import"./transition-Bl2-vqQL.js";import"./iconbase.esm-DvODm2qg.js";import"./ripple.esm-ByfALGiA.js";import"./dialog.esm-BRb5edDq.js";import"./csstransition.esm-BI2IUjb-.js";import"./dropdown.esm-C3w7lM7_.js";import"./virtualscroller.esm-aVvJseNT.js";import"./overlayservice.esm-0R6tr4hB.js";import"./index.esm-BypTRDCm.js";import"./inputtextarea.esm-oIyypEZZ.js";import"./inputtext.esm-Bc9dGI99.js";import"./useSmsCounter-DY0gdP9E.js";import"./confirmpopup.esm-CVN6frEl.js";import"./accordion.esm-BkzqJAze.js";import"./index.esm-Bh2Rs3JK.js";import"./Update-C8wW_8Nu.js";import"./formik.esm-C2ZluvBh.js";import"./inputmask.esm-Dc-Zujvi.js";import"./index.esm-D-5U2K2D.js";import"./Create-CzLwHW3D.js";import"./TransitionGroup-_qrsneQI.js";const V=({csrf_token:p})=>{const a=b.useRef(null),[i,j]=b.useState(0),[h,o]=b.useState(0),[f,t]=b.useState(!0),g=()=>{t(!0),fetch(route("system.currency"),{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":p}}).then(r=>r.json()).then(r=>{r.status?(j(r.currency),o(r.currency),t(!1)):(a.current.show({severity:"error",summary:"Hata",detail:r.message}),t(!1))}).catch(r=>{a.current.show({severity:"error",summary:"Hata",detail:"Kur bilgisi alınamadı!"}),t(!1)})};b.useEffect(()=>{g()},[]);const y=()=>{t(!0);let r=new FormData;r.append("currency",i),fetch(route("system.currencyUpdate"),{method:"POST",headers:{"X-CSRF-TOKEN":p},body:r}).then(c=>c.json()).then(c=>{c.status?(o(i),a.current.show({severity:"success",summary:"Başarılı",detail:"Kur bilgisi güncellendi!"}),t(!1)):(a.current.show({severity:"error",summary:"Hata",detail:c.message}),t(!1))}).catch(c=>{a.current.show({severity:"error",summary:"Hata",detail:"Kur bilgisi güncellenemedi!"}),t(!1)})};return e.jsxs(e.Fragment,{children:[e.jsx(K,{ref:a}),e.jsx(u,{title:"Kur Bilgisi ",subTitle:`1$ = ${h} TL`,children:e.jsxs("div",{className:"p-inputgroup flex-1",children:[e.jsx("span",{className:"p-inputgroup-addon",children:"1 $ = "}),e.jsx(O,{placeholder:"Kur Bilgisi",mode:"currency",disabled:f,onChange:r=>j(r.value),value:i,currency:"TRY"}),e.jsx("span",{className:"p-inputgroup-addon p-0",children:e.jsx(l,{icon:"pi pi-sync",loading:f,disabled:i===h,onClick:y,className:"p-button-success rounded-l-none"})})]})})]})};function ve({auth:p,csrf_token:a,sms:i}){var w,T,E;const[j,h]=x.useState(!0),[o,f]=x.useState(null),[t,g]=x.useState(null),[y,r]=x.useState(""),c=x.useRef(null),[z,N]=x.useState(!1),[C,k]=x.useState(!1),S=b.useState(!1);return b.useEffect(()=>{L(a).then(({status:s,data:m})=>{s?(f(m.space),g(m.counts),r(m.password)):c.current.show({severity:"error",summary:"Hata",detail:"Veriler yüklenirken bir hata oluştu.",life:3e3})}).catch(s=>{console.error(s),c.current.show({severity:"error",summary:"Hata",detail:"Veriler yüklenirken bir hata oluştu.",life:3e3})}).finally(()=>{h(!1)})},[]),e.jsxs(B,{user:p.user,header:"Anasayfa",children:[e.jsx(R,{title:"Anasayfa"}),e.jsx(K,{ref:c}),e.jsx("div",{className:"py-6",children:e.jsx("div",{className:"max-w-[85rem] mx-auto sm:px-6 lg:px-8",children:e.jsx(P,{blocked:j,template:e.jsx("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"3rem"}}),children:!j&&e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",children:[e.jsx(u,{title:"Paketler",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-folder-open"})," ",t.packages," Adet Paket"]}),children:e.jsxs("div",{className:"flex justify-between gap-x-2",children:[e.jsx(l,{label:"Yeni Paket Ekle",icon:"pi pi-cart-plus",size:"small",className:"p-button-success",onClick:()=>{k(!C)}}),e.jsx(l,{label:"Paketler",icon:"pi pi-folder-open",size:"small",className:"p-button-info",onClick:()=>{d.visit(route("packages.index"))}})]})}),e.jsx(u,{title:"Müşteriler",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-users"})," ",t.customers," Adet Müşteri"]}),children:e.jsxs("div",{className:"flex justify-between gap-x-2",children:[e.jsx(l,{label:"Yeni Müşteri Ekle",icon:"pi pi-user-plus",size:"small",onClick:()=>S[1](!0),className:"p-button-success"}),e.jsx(l,{label:"Müşteriler",icon:"pi pi-users",onClick:()=>d.visit(route("customers.index")),size:"small",className:"p-button-info"})]})}),e.jsx(u,{title:"Gruplar",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-users"})," ",t.groups," Adet Grup"]}),children:e.jsxs("div",{className:"flex justify-between gap-x-2",children:[e.jsx(l,{label:"Yeni Grup Ekle",icon:"pi pi-user-plus",size:"small",onClick:()=>d.visit(route("groups.create")),className:"p-button-success"}),e.jsx(l,{label:"Gruplar",icon:"pi pi-users",onClick:()=>d.visit(route("groups.index")),size:"small",className:"p-button-info"})]})}),e.jsx(u,{title:"Ürünler",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-box"})," ",t.products," Adet Ürün"]}),children:e.jsxs("div",{className:"flex justify-between gap-x-2",children:[e.jsx(l,{label:"Yeni Ürün Ekle",icon:"pi pi-plus-circle",size:"small",onClick:()=>d.visit(route("products.index")),className:"p-button-success"}),e.jsx(l,{label:"Ürünler",icon:"pi pi-box",onClick:()=>d.visit(route("products.index")),size:"small",className:"p-button-info"})]})}),e.jsx(u,{title:"Katalog",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-key"})," Katalog Şifresi : ",e.jsx("b",{children:y})]}),children:e.jsxs("div",{className:"flex justify-between gap-x-2",children:[e.jsx(l,{label:"Katalog(Firma İçi)",icon:"pi pi-images",size:"small",onClick:()=>d.visit(route("products.katalog")),className:"p-button-success"}),e.jsx(l,{label:"Katalog",icon:"pi pi-external-link",onClick:()=>d.visit(route("home")),size:"small",className:"p-button-info"})]})}),e.jsx(u,{title:"Araçlar",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-file-excel"})," Excel Çıktısı Verir."]}),children:e.jsxs("div",{className:"flex justify-between gap-x-2",children:[e.jsx(l,{label:"Ideasoft",icon:"pi pi-file-excel",size:"small",onClick:()=>{fetch(route("export.ideasoft"),{method:"GET",headers:{"X-CSRF-TOKEN":a}}).then(s=>s.blob()).then(s=>{const m=window.URL.createObjectURL(new Blob([s])),n=document.createElement("a");n.href=m;let v=Math.random().toString(36).substring(7);n.setAttribute("download",v+"_ideasoft.xls"),document.body.appendChild(n),n.click(),n.parentNode.removeChild(n)}).catch(s=>console.error(s))},className:"p-button-success"}),e.jsx(l,{label:"Logo",icon:"pi pi-file-excel",onClick:()=>{fetch(route("export.logo"),{method:"GET",headers:{"X-CSRF-TOKEN":a}}).then(s=>s.blob()).then(s=>{const m=window.URL.createObjectURL(new Blob([s])),n=document.createElement("a");n.href=m;let v=Math.random().toString(36).substring(7);n.setAttribute("download",v+"_logo.xls"),document.body.appendChild(n),n.click(),n.parentNode.removeChild(n)}).catch(s=>console.error(s))},size:"small",className:"p-button-info"})]})}),e.jsx(u,{title:"Disk Kullanımı",subTitle:`% ${o.percentageUsed} - Boş : ${o.freeSpace}`,children:e.jsx(U,{value:o.percentageUsed,displayValueTemplate:s=>e.jsxs(e.Fragment,{children:[o.usedSpace," / ",o.totalSpace]}),color:o.percentageUsed>75?o.percentageUsed>85?"var(--red-500)":"var(--orange-500)":"var(--green-500)"})}),e.jsx(u,{title:"Bildirim Servisi",subTitle:e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"pi pi-mobile"})," Kayıtlı Cihaz Sayısı : ",e.jsx("b",{children:t.deviceTokens})]}),children:e.jsx("div",{className:"flex justify-between gap-x-2",children:e.jsx(l,{label:"Bildirim Gönder",icon:"pi pi-bell",size:"small",onClick:()=>N(!0),className:"p-button-success"})})}),i&&e.jsxs(u,{title:"SMS Servisi",subTitle:`${(w=i==null?void 0:i.data)==null?void 0:w.company_name} (${(T=i==null?void 0:i.data)==null?void 0:T.username})`,children:[e.jsx(F,{value:"Kalan SMS",severity:"success",icon:"pi pi-envelope",className:"mr-2"}),e.jsx(F,{value:`${(E=i==null?void 0:i.data)==null?void 0:E.credit} Kredi`,severity:"info",icon:"pi pi-send"})]}),(p.user.role==="admin"||p.user.role==="engineer")&&e.jsx(V,{csrf_token:a})]})})})}),e.jsx(A,{csrf_token:a,visible:z,setVisible:N,auth:p,initialOpened:"bell"}),e.jsx(M,{visible:C,setVisible:k,csrf_token:a,toast:c,auth:p,create:S})]})}export{ve as default};