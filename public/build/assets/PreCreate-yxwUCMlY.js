import{r as a,P as Se,Z as V,b as U,c as L,D as Z,O as X,l as je,I as we,j as i}from"./app-MMx-yB3G.js";import{C as ke,u as Ee,a as Ce,c as Oe,d as Ie,E as Ne,k as Pe,e as De,h as Y,f as Re,P as Me}from"./iconbase.esm-48fxaLvN.js";import{C as Q,T as Te}from"./csstransition.esm-C7-qQLFH.js";import{R as ze}from"./ripple.esm-CDHzLfkq.js";import{D as _e}from"./dropdown.esm-BzwAhd2S.js";import{A as Ae,a as Fe}from"./accordion.esm-Bxv35aXX.js";import{I as M}from"./inputtext.esm-BmSpreyY.js";import{D as ee}from"./dialog.esm-BnJITAjQ.js";import{B as E}from"./button.esm-t3q6Uns9.js";import He from"./Update-DaL_hkzX.js";import Be from"./Create-DQlYeJqQ.js";import{B as Le}from"./blockui.esm-CvrtRqj0.js";import"./virtualscroller.esm-Cs74YQWK.js";import"./overlayservice.esm-BwHVid_d.js";import"./index.esm-B6m0rV8L.js";import"./index.esm-Bu_OTDB3.js";import"./formik.esm-DiYpwH7p.js";import"./inputmask.esm-Cb668VzC.js";import"./index.esm-vUqAtpS5.js";import"./inputtextarea.esm-c6Gr0vxJ.js";function P(){return P=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s])}return t},P.apply(this,arguments)}function T(t){"@babel/helpers - typeof";return T=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},T(t)}function Ue(t,n){if(T(t)!=="object"||t===null)return t;var e=t[Symbol.toPrimitive];if(e!==void 0){var s=e.call(t,n||"default");if(T(s)!=="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(t)}function Ke(t){var n=Ue(t,"string");return T(n)==="symbol"?n:String(n)}function Ve(t,n,e){return n=Ke(n),n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}function Ze(t){if(Array.isArray(t))return t}function Xe(t,n){var e=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(e!=null){var s,r,v,y,o=[],m=!0,C=!1;try{if(v=(e=e.call(t)).next,n===0){if(Object(e)!==e)return;m=!1}else for(;!(m=(s=v.call(e)).done)&&(o.push(s.value),o.length!==n);m=!0);}catch(k){C=!0,r=k}finally{try{if(!m&&e.return!=null&&(y=e.return(),Object(y)!==y))return}finally{if(C)throw r}}return o}}function te(t,n){(n==null||n>t.length)&&(n=t.length);for(var e=0,s=new Array(n);e<n;e++)s[e]=t[e];return s}function Ye(t,n){if(t){if(typeof t=="string")return te(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);if(e==="Object"&&t.constructor&&(e=t.constructor.name),e==="Map"||e==="Set")return Array.from(t);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return te(t,n)}}function $e(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function $(t,n){return Ze(t)||Xe(t,n)||Ye(t,n)||$e()}var Ge={closeButton:"p-sidebar-close p-sidebar-icon p-link",closeIcon:"p-sidebar-close-icon",mask:function(n){var e=n.props,s=n.maskVisibleState,r=["left","right","top","bottom"],v=r.find(function(y){return y===e.position});return L("p-sidebar-mask",v&&!e.fullScreen?"p-sidebar-".concat(v):"",{"p-component-overlay p-component-overlay-enter":e.modal,"p-sidebar-mask-scrollblocker":e.blockScroll,"p-sidebar-visible":s,"p-sidebar-full":e.fullScreen},e.maskClassName)},header:function(n){var e=n.props;return L("p-sidebar-header",{"p-sidebar-custom-header":e.header})},content:"p-sidebar-content",icons:"p-sidebar-icons",root:function(n){n.props;var e=n.context;return L("p-sidebar p-component",{"p-input-filled":e&&e.inputStyle==="filled"||U.inputStyle==="filled","p-ripple-disabled":e&&e.ripple===!1||U.ripple===!1})},transition:"p-sidebar"},Je=`
@layer primereact {
    .p-sidebar-mask {
        display: none;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        background-color: transparent;
        transition-property: background-color;
    }
    
    .p-sidebar-visible {
        display: flex;
    }
    
    .p-sidebar-mask.p-component-overlay {
        pointer-events: auto;
    }
    
    .p-sidebar {
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
    }
    
    .p-sidebar-content {
        overflow-y: auto;
        flex-grow: 1;
    }
    
    .p-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    
    .p-sidebar-custom-header {
        justify-content: space-between;
    }
    
    .p-sidebar-icons {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    
    .p-sidebar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }
    
    .p-sidebar-full .p-sidebar {
        transition: none;
        transform: none;
        width: 100vw;
        height: 100vh;
        max-height: 100%;
        top: 0px;
        left: 0px;
    }
    
    /* Animation */
    /* Top, Bottom, Left and Right */
    .p-sidebar-top .p-sidebar-enter,
    .p-sidebar-top .p-sidebar-exit-active {
        transform: translate3d(0px, -100%, 0px);
    }
    
    .p-sidebar-bottom .p-sidebar-enter,
    .p-sidebar-bottom .p-sidebar-exit-active {
        transform: translate3d(0px, 100%, 0px);
    }
    
    .p-sidebar-left .p-sidebar-enter,
    .p-sidebar-left .p-sidebar-exit-active {
        transform: translate3d(-100%, 0px, 0px);
    }
    
    .p-sidebar-right .p-sidebar-enter,
    .p-sidebar-right .p-sidebar-exit-active {
        transform: translate3d(100%, 0px, 0px);
    }
    
    .p-sidebar-top .p-sidebar-enter-active,
    .p-sidebar-bottom .p-sidebar-enter-active,
    .p-sidebar-left .p-sidebar-enter-active,
    .p-sidebar-right .p-sidebar-enter-active {
        transform: translate3d(0px, 0px, 0px);
        transition: all 0.3s;
    }
    
    .p-sidebar-top .p-sidebar-enter-done,
    .p-sidebar-bottom .p-sidebar-enter-done,
    .p-sidebar-left .p-sidebar-enter-done,
    .p-sidebar-right .p-sidebar-enter-done {
        transform: none;
    }
    
    .p-sidebar-top .p-sidebar-exit-active,
    .p-sidebar-bottom .p-sidebar-exit-active,
    .p-sidebar-left .p-sidebar-exit-active,
    .p-sidebar-right .p-sidebar-exit-active {
        transition: all 0.3s;
    }
    
    /* Full */
    .p-sidebar-full .p-sidebar-enter {
        opacity: 0;
        transform: scale(0.5);
    }
    
    .p-sidebar-full .p-sidebar-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: all 0.15s cubic-bezier(0, 0, 0.2, 1);
    }
    
    .p-sidebar-full .p-sidebar-enter-done {
        transform: none;
    }
    
    .p-sidebar-full .p-sidebar-exit-active {
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Size */
    .p-sidebar-left .p-sidebar {
        width: 20rem;
        height: 100%;
    }
    
    .p-sidebar-right .p-sidebar {
        width: 20rem;
        height: 100%;
    }
    
    .p-sidebar-top .p-sidebar {
        height: 10rem;
        width: 100%;
    }
    
    .p-sidebar-bottom .p-sidebar {
        height: 10rem;
        width: 100%;
    }
    
    .p-sidebar-left .p-sidebar-sm,
    .p-sidebar-right .p-sidebar-sm {
        width: 20rem;
    }
    
    .p-sidebar-left .p-sidebar-md,
    .p-sidebar-right .p-sidebar-md {
        width: 40rem;
    }
    
    .p-sidebar-left .p-sidebar-lg,
    .p-sidebar-right .p-sidebar-lg {
        width: 60rem;
    }
    
    .p-sidebar-top .p-sidebar-sm,
    .p-sidebar-bottom .p-sidebar-sm {
        height: 10rem;
    }
    
    .p-sidebar-top .p-sidebar-md,
    .p-sidebar-bottom .p-sidebar-md {
        height: 20rem;
    }
    
    .p-sidebar-top .p-sidebar-lg,
    .p-sidebar-bottom .p-sidebar-lg {
        height: 30rem;
    }
    
    .p-sidebar-left .p-sidebar-view,
    .p-sidebar-right .p-sidebar-view,
    .p-sidebar-top .p-sidebar-view,
    .p-sidebar-bottom .p-sidebar-view {
        width: 100%;
        height: 100%;
    }
    
    .p-sidebar-left .p-sidebar-content,
    .p-sidebar-right .p-sidebar-content,
    .p-sidebar-top .p-sidebar-content,
    .p-sidebar-bottom .p-sidebar-content {
        width: 100%;
        height: 100%;
    }
    
    @media screen and (max-width: 64em) {
        .p-sidebar-left .p-sidebar-lg,
        .p-sidebar-left .p-sidebar-md,
        .p-sidebar-right .p-sidebar-lg,
        .p-sidebar-right .p-sidebar-md {
            width: 20rem;
        }
    }        
}
`,We={mask:function(n){var e=n.props;return{position:"fixed",height:"100%",width:"100%",left:0,top:0,display:"flex",justifyContent:e.position==="left"?"flex-start":e.position==="right"?"flex-end":"center",alignItems:e.position==="top"?"flex-start":e.position==="bottom"?"flex-end":"center"}}},B=ke.extend({defaultProps:{__TYPE:"Sidebar",appendTo:null,ariaCloseLabel:null,baseZIndex:0,blockScroll:!1,children:void 0,className:null,closeIcon:null,closeOnEscape:!0,content:null,dismissable:!0,fullScreen:!1,header:null,icons:null,id:null,maskClassName:null,maskStyle:null,modal:!0,onHide:null,onShow:null,position:"left",showCloseIcon:!0,style:null,transitionOptions:null,visible:!1},css:{classes:Ge,styles:Je,inlineStyles:We}});function ne(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);n&&(s=s.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),e.push.apply(e,s)}return e}function qe(t){for(var n=1;n<arguments.length;n++){var e=arguments[n]!=null?arguments[n]:{};n%2?ne(Object(e),!0).forEach(function(s){Ve(t,s,e[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):ne(Object(e)).forEach(function(s){Object.defineProperty(t,s,Object.getOwnPropertyDescriptor(e,s))})}return t}var re=a.forwardRef(function(t,n){var e=Ee(),s=a.useContext(Se),r=B.getProps(t,s),v=a.useState(!1),y=$(v,2),o=y[0],m=y[1],C=a.useState(!1),k=$(C,2),d=k[0],O=k[1],j=B.setMetaData({props:r,state:{containerVisible:o}}),f=j.ptm,h=j.cx,K=j.sx,D=j.isUnstyled;Ce(B.css.styles,D,{name:"sidebar"});var b=a.useRef(null),x=a.useRef(null),w=a.useRef(null),z=d&&r.closeOnEscape,_=Oe("sidebar",z);Ie({callback:function(l){g(l)},when:z&&_,priority:[Ne.SIDEBAR,_]});var A=Pe({type:"click",listener:function(l){l.button===0&&p(l)&&g(l)}}),I=$(A,2),N=I[0],F=I[1],p=function(l){return b&&b.current&&!b.current.contains(l.target)},u=function(){var l=document.activeElement,R=l&&b&&b.current.contains(l);!R&&r.showCloseIcon&&w.current&&w.current.focus()},S=function(l){r.dismissable&&r.modal&&x.current===l.target&&g(l)},g=function(l){r.onHide(),l.preventDefault()},ie=function(){r.onShow&&r.onShow(),u(),le()},se=function(){r.modal&&!D()&&Z.addClass(x.current,"p-component-overlay-leave")},ae=function(){V.clear(x.current),m(!1),G()},le=function(){r.dismissable&&!r.modal&&N(),r.blockScroll&&Z.blockBodyScroll()},G=function(){F(),r.blockScroll&&Z.unblockBodyScroll()};a.useImperativeHandle(n,function(){return{props:r,getElement:function(){return b.current},gteMask:function(){return x.current},getCloseIcon:function(){return w.current}}}),De(function(){r.visible&&m(!0)}),Y(function(){r.visible&&!o&&m(!0),r.visible!==d&&o&&O(r.visible)},[r.visible]),Y(function(){o&&(V.set("modal",x.current,s&&s.autoZIndex||U.autoZIndex,r.baseZIndex||s&&s.zIndex.modal||U.zIndex.modal),O(!0))},[o]),Y(function(){d&&(F(),r.dismissable&&!r.modal&&N())},[r.dismissable,r.modal,d]),Re(function(){G(),x.current&&V.clear(x.current)});var oe=function(){var l=r.ariaCloseLabel||je("close"),R=e({type:"button",ref:w,className:h("closeButton"),onClick:function(ge){return g(ge)},"aria-label":l},f("closeButton")),H=e({className:h("closeIcon")},f("closeIcon")),ye=r.closeIcon||a.createElement(Te,H),xe=we.getJSXIcon(ye,qe({},H),{props:r});return r.showCloseIcon?a.createElement("button",R,xe,a.createElement(ze,null)):null},ce=function(){return r.header?X.getJSXElement(r.header,r):null},de=function(){return r.icons?X.getJSXElement(r.icons,r):null},J=e({ref:x,style:K("mask"),className:h("mask",{maskVisibleState:o}),onMouseDown:function(l){return S(l)}},f("mask")),W=e({id:r.id,className:L(r.className,h("root",{context:s})),style:r.style,role:"complementary"},B.getOtherProps(r),f("root")),pe=e({className:h("header")},f("header")),ue=e({className:h("content")},f("content")),me=e({className:h("icons")},f("icons")),be={enter:r.fullScreen?150:300,exit:r.fullScreen?150:300},q=e({classNames:h("transition"),in:d,timeout:be,options:r.transitionOptions,unmountOnExit:!0,onEntered:ie,onExiting:se,onExited:ae},f("transition")),fe=function(){var l={closeIconRef:w,hide:g};return a.createElement("div",J,a.createElement(Q,P({nodeRef:b},q),a.createElement("div",P({ref:b},W),X.getJSXElement(t.content,l))))},he=function(){var l=oe(),R=de(),H=ce();return a.createElement("div",J,a.createElement(Q,P({nodeRef:b},q),a.createElement("div",P({ref:b},W),a.createElement("div",pe,H,a.createElement("div",me,R,l)),a.createElement("div",ue,r.children))))},ve=function(){var l=t!=null&&t.content?fe():he();return a.createElement(Me,{element:l,appendTo:r.appendTo,visible:!0})};return o&&ve()});re.displayName="Sidebar";const Qe=({visible:t,setVisible:n,csrf_token:e,toast:s,onSave:r=null,auth:v,create:y=a.useState(!1)})=>{const[o,m]=a.useState(!1),[C,k]=a.useState([]),[d,O]=a.useState(null),j=(p=null)=>{let u=new FormData;u.append("detail",1),fetch(route("customers.getListForSms"),{method:"POST",headers:{"X-CSRF-TOKEN":e},body:u}).then(S=>S.json()).then(({customers:S})=>{p&&O(S.find(g=>g.id===p)),k(S)}).catch(S=>{k([])})};a.useEffect(()=>{var p;t&&(["admin","salesman","engineer"].includes((p=v==null?void 0:v.user)==null?void 0:p.role)?j():(s.current.show({severity:"warn",summary:"Hata",detail:"Yetkisiz Erişim"}),n(!1)))},[t]);const[f,h]=a.useState(!1),[K,D]=a.useState(!1),b=a.useRef(null);let x=y[0],w=y[1];const[z,_]=a.useState(!1),A=a.useRef(null),I=()=>{x&&w(!1)},N=()=>{f&&h(!1)},F=()=>{if(d===null){s.current.show({severity:"warn",summary:"Hata",detail:"Müşteri Seçimi Zorunludur."});return}else{m(!0);let p=new FormData;p.append("customer_id",d.id),r!==null&&p.append("onSave","true"),fetch(route("packages.preCreate"),{method:"POST",headers:{"X-CSRF-TOKEN":e},body:p}).then(u=>u.json()).then(u=>{let{status:S,message:g}=u;m(!1),S?(s.current.show({severity:"success",summary:"Başarılı",detail:g}),O(null),n(!1),r!==null&&r(!0,u.packages)):(r!==null&&r(!1,null),s.current.show({severity:"error",summary:"Hata",detail:g}))}).catch(u=>{r!==null&&r(!1,null),m(!1),s.current.show({severity:"error",summary:"Hata",detail:"CSRF Token Hatası Lütfen Sayfayı Yenileyiniz.."})})}};return i.jsxs(i.Fragment,{children:[i.jsxs(re,{visible:t,onHide:()=>n(!1),position:"right",header:i.jsx("div",{className:"font-medium text-xl text-900 py-3 sm:py-0",children:"Yeni Paket Girişi"}),className:"w-full md:w-[20rem] lg:w-[30rem]",children:[i.jsxs("div",{className:"min-h-full relative",children:[i.jsx(Le,{blocked:o,template:i.jsx("i",{className:"pi pi-spin pi-spinner",style:{fontSize:"3rem"}}),children:i.jsxs("div",{className:"p-fluid",children:[i.jsxs("div",{className:"mb-3",children:[i.jsxs("label",{htmlFor:"name",className:"font-bold",children:["Müşteri Seçimi ",i.jsx("span",{className:"font-semibold text-red-400",children:"*"})]}),i.jsx(_e,{value:d,filter:!0,virtualScrollerOptions:{itemSize:43},onChange:p=>{O(p.value)},options:C,checkmark:!0,optionLabel:"name",placeholder:"Müşteriyi Seçiniz",className:"w-full md:w-20rem"})]}),d!==null&&i.jsx(Ae,{className:"mb-3",children:i.jsx(Fe,{header:"Müşteri Bilgileri "+(d!==null?"(Seçili)":"(Seçilmedi)"),children:i.jsxs("div",{className:"grid grid-cols-1 gap-3",children:[i.jsxs("div",{children:[i.jsxs("label",{htmlFor:"name",className:"font-bold",children:["Müşteri Adı ",i.jsx("span",{className:"font-semibold text-red-400",children:"*"})]}),i.jsx(M,{id:"name",type:"text",name:"name",value:d.name,readOnly:!0,disabled:!0})]}),i.jsxs("div",{children:[i.jsxs("label",{htmlFor:"phone",className:"font-bold",children:["Müşteri Telefonu ",i.jsx("span",{className:"font-semibold text-red-400",children:"*"})]}),i.jsx(M,{id:"phone",type:"tel",name:"phone",value:d.phone,readOnly:!0,disabled:!0})]}),i.jsxs("div",{children:[i.jsxs("label",{htmlFor:"address",className:"font-bold",children:["Müşteri Adresi ",i.jsx("span",{className:"font-semibold text-red-400",children:"*"})]}),i.jsx(M,{id:"address",type:"text",name:"address",value:d.address,readOnly:!0,disabled:!0})]}),i.jsxs("div",{children:[i.jsxs("label",{htmlFor:"city",className:"font-bold",children:["Müşteri İl ",i.jsx("span",{className:"font-semibold text-red-400",children:"*"})]}),i.jsx(M,{id:"city",type:"text",name:"city",value:d.city,readOnly:!0,disabled:!0})]}),i.jsxs("div",{children:[i.jsxs("label",{htmlFor:"district",className:"font-bold",children:["Müşteri İlçe ",i.jsx("span",{className:"font-semibold text-red-400",children:"*"})]}),i.jsx(M,{id:"district",type:"text",name:"district",value:d.district,readOnly:!0,disabled:!0})]})]})})})]})}),i.jsxs("div",{className:"absolute bottom-10 left-0 right-0",children:[i.jsxs("div",{className:"border-b border-black py-3 mb-3",children:[d&&i.jsx(E,{label:"Müşteriyi Düzenle",size:"small",icon:"pi pi-pencil",type:"button",severity:"warning",loading:o,className:"mr-2",onClick:()=>{h(!0)}}),i.jsx(E,{label:"Müşteri Ekle",size:"small",icon:"pi pi-user-plus",type:"button",severity:"help",loading:o,onClick:()=>{w(!0)}})]}),i.jsx("div",{children:i.jsx(E,{label:"Paket Girişi Yap",size:"small",icon:"pi pi-check",type:"button",severity:"success",loading:o,onClick:()=>{F()}})})]})]}),i.jsx(i.Fragment,{children:i.jsx(ee,{header:"Müşteriyi Düzenle",style:{width:"50vw"},breakpoints:{"960px":"75vw","641px":"100vw"},onHide:N,maximizable:!0,visible:f,footer:i.jsxs(i.Fragment,{children:[i.jsx(E,{label:"Vazgeç",icon:"pi pi-times",size:"small",link:!0,onClick:N,loading:o}),i.jsx(E,{label:"Kaydet",icon:"pi pi-save",size:"small",className:"p-button-success",loading:o,onClick:()=>{D(!0),b.current.click()}})]}),children:i.jsx(He,{updateModal:f,user:d,csrf_token:e,toast:s,onHide:N,setUsers:()=>{},onSave:(p,u)=>{p&&(j(u.id),h(p))},formRef:b,setFormSubmitted:D,formSubmitted:K,loading:o,setLoading:m,page:!0})})})]}),i.jsx(ee,{header:"Müşteri Ekle",style:{width:"50vw"},breakpoints:{"960px":"75vw","641px":"100vw"},onHide:I,maximizable:!0,visible:x,footer:i.jsxs(i.Fragment,{children:[i.jsx(E,{label:"Vazgeç",icon:"pi pi-times",size:"small",link:!0,onClick:I,loading:o}),i.jsx(E,{label:"Ekle",icon:"pi pi-save",size:"small",className:"p-button-success",type:"button",loading:o,onClick:()=>{_(!0),A.current.click()}})]}),children:i.jsx(Be,{csrf_token:e,toast:s,formSubmitted:z,onHide:I,onSave:(p,u)=>{p&&j(u.id)},setUsers:()=>{},formRef:A})})]})},St=Qe;export{St as default};
