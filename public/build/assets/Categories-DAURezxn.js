import{r as g,j as e}from"./app-MMx-yB3G.js";import{D as b}from"./dialog.esm-BnJITAjQ.js";import{T as P}from"./toolbar.esm-Ck1JAFVg.js";import{I as f}from"./inputtext.esm-BmSpreyY.js";import{B as x}from"./button.esm-t3q6Uns9.js";import{D,C as n}from"./column.esm-BSKXtLdH.js";import{c as T}from"./confirmpopup.esm-bTiZjuf1.js";import"./iconbase.esm-48fxaLvN.js";import"./csstransition.esm-C7-qQLFH.js";import"./ripple.esm-CDHzLfkq.js";import"./inputnumber.esm-JaxKPWvd.js";import"./dropdown.esm-BzwAhd2S.js";import"./virtualscroller.esm-Cs74YQWK.js";import"./overlayservice.esm-BwHVid_d.js";import"./index.esm-B6m0rV8L.js";import"./index.esm-Bu_OTDB3.js";import"./index.esm-6wxOW2yc.js";const U=({csrf_token:p,visible:w,setVisible:j,toast:s,categoriesAll:v,onChange:c=()=>{}})=>{const[h,o]=g.useState(!1),[y,m]=g.useState(v),[d,C]=g.useState("");return e.jsx(e.Fragment,{children:e.jsx(b,{header:"Kategoriler",maximizable:!0,visible:w,style:{width:"50vw"},onHide:()=>j(!1),children:e.jsxs(D,{value:y,removableSort:!0,editMode:"row",loading:h,header:e.jsx(P,{className:"mb-3",start:()=>e.jsx("p",{children:"Yeni Kategori Ekle"}),center:()=>e.jsx(e.Fragment,{children:e.jsx(f,{size:"small",placeholder:"Yeni Kategori Adı",value:d,onChange:r=>C(r.target.value)})}),end:()=>e.jsx(e.Fragment,{children:e.jsx(x,{icon:"pi pi-save",loading:h,onClick:()=>{if(d.length===0){s.current.show({severity:"error",summary:"Hata",detail:"Kategori adı boş olamaz!"});return}o(!0);let r=new FormData;r.append("name",d),fetch(route("products.storeCategory"),{method:"POST",headers:{"X-CSRF-TOKEN":p},body:r}).then(t=>t.json()).then(t=>{t.status?(s.current.show({severity:"success",summary:"Başarılı",detail:t.message}),c(t.categories),m(t.categories)):s.current.show({severity:"error",summary:"Hata",detail:t.message})}).finally(()=>{o(!1)})},size:"small",severity:"success",tooltip:"Yeni Kategori Ekle"})})}),onRowEditComplete:r=>{let t=[...y],{newData:l,index:a}=r;t[a]=l,o(!0);let u=new FormData;u.append("name",l.name),u.append("_method","PUT"),fetch(route("products.updateCategory",l.id),{method:"POST",headers:{"X-CSRF-TOKEN":p},body:u}).then(i=>i.json()).then(i=>{i.status?(s.current.show({severity:"success",summary:"Başarılı",detail:i.message}),c(i.categories),m(i.categories)):s.current.show({severity:"error",summary:"Hata",detail:i.message})}).finally(()=>{o(!1)}),m(t)},paginator:!0,emptyMessage:"Kategori bulunamadı.",currentPageReportTemplate:"{first}. ile {last}. arası toplam {totalRecords} kayıttan",paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",rowsPerPageOptions:[5,10,25,50],rows:5,dataKey:"id",children:[e.jsx(n,{field:"id",sortable:!0,header:"ID"}),e.jsx(n,{field:"name",sortable:!0,header:"Kategori Adı",editor:r=>e.jsx(f,{type:"text",size:"small",value:r.value,onChange:t=>r.editorCallback(t.target.value)})}),e.jsx(n,{header:"Düzenle",rowEditor:!0}),e.jsx(n,{header:"Sil",align:"right",style:{width:"3rem"},body:r=>e.jsx(e.Fragment,{children:r.id!==0&&e.jsx(x,{icon:"pi pi-times",className:"ml-2",tooltip:"Kategoriyi Sil",tooltipOptions:{position:"top"},size:"small",onClick:t=>{T({target:t.currentTarget,message:"Kategoriyi silmek istediğinize emin misiniz?",icon:"pi pi-exclamation-triangle",acceptClassName:"p-button-danger",accept:()=>{o(!0);let l=new FormData;l.append("_method","DELETE"),fetch(route("products.destroyCategory",r.id),{method:"POST",headers:{"X-CSRF-TOKEN":p},body:l}).then(a=>a.json()).then(a=>{a.status?(s.current.show({severity:"success",summary:"Başarılı",detail:a.message}),c(a.categories),m(a.categories)):s.current.show({severity:"error",summary:"Hata",detail:a.message})}).finally(()=>{o(!1)})},acceptLabel:"Sil",rejectLabel:"Vazgeç"})},severity:"danger"})})})]})})})};export{U as default};