import{r as l,j as e,d as m}from"./app-MMx-yB3G.js";import{A as j}from"./ApplicationLogo-7IUcid-B.js";import{q as b}from"./transition-Chc5_UKz.js";import{B as v}from"./button.esm-t3q6Uns9.js";const k=l.createContext(),o=({children:r})=>{const[a,t]=l.useState(!1),s=()=>{t(d=>!d)};return e.jsx(k.Provider,{value:{open:a,setOpen:t,toggleOpen:s},children:e.jsx("div",{className:"relative",children:r})})},N=({children:r})=>{const{open:a,setOpen:t,toggleOpen:s}=l.useContext(k);return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:s,children:r}),a&&e.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>t(!1)})]})},w=({align:r="right",width:a="48",contentClasses:t="py-1 bg-white dark:bg-gray-700",children:s})=>{const{open:d,setOpen:c}=l.useContext(k);let g="origin-top";r==="left"?g="ltr:origin-top-left rtl:origin-top-right start-0":r==="right"&&(g="ltr:origin-top-right rtl:origin-top-left end-0");let u="";return a==="48"&&(u="w-48"),e.jsx(e.Fragment,{children:e.jsx(b,{as:l.Fragment,show:d,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:e.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${g} ${u}`,onClick:()=>c(!1),children:e.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+t,children:s})})})})},C=({className:r="",children:a,...t})=>e.jsx(m,{...t,className:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "+r,children:a});o.Trigger=N;o.Content=w;o.Link=C;function L({active:r=!1,className:a="",children:t,...s}){return e.jsx(m,{...s,className:"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none "+(r?"border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700 ":"border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ")+a,children:t})}function f({active:r=!1,className:a="",children:t,...s}){return e.jsx(m,{...s,className:`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${r?"border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 focus:text-indigo-800 dark:focus:text-indigo-200 focus:bg-indigo-100 dark:focus:bg-indigo-900 focus:border-indigo-700 dark:focus:border-indigo-300":"border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600"} text-base font-medium focus:outline-none transition duration-150 ease-in-out ${a}`,children:t})}function O({user:r,header:a,children:t,buttons:s=!1,info:d=!1}){const[c,g]=l.useState(!1),u=r.role==="worker"?route("packages.index"):route("dashboard"),y=[{name:"Anasayfa",href:route("dashboard"),active:route().current("dashboard"),roles:["engineer","admin","salesman"]},{name:"Paket Sorgulama",href:route("sorgulama"),active:route().current("sorgulama|packages.arama|packages.show"),roles:["engineer","admin","salesman"]},{name:"Yeni Paketler",href:route("packages.index"),active:route().current("packages.index|packages.create|packages.edit"),roles:["*"]},{name:"Gönderi Kodu",href:route("packages.trackingCodeSet"),active:route().current("packages.trackingCodeSet"),roles:["engineer","admin","salesman"]},{name:"Müşteriler",href:route("customers.index"),active:route().current("customers.*"),roles:["engineer","admin","salesman"]},{name:"Gruplar",href:route("groups.index"),active:route().current("groups.*"),roles:["engineer","admin","salesman"]},{name:"Ürünler",href:route("products.index"),active:route().current("products.index"),roles:["engineer","admin","salesman"]},{name:"Katalog",href:route("products.katalog"),active:route().current("products.katalog"),roles:["*"]},{name:"Kullanıcılar",href:route("users.index"),active:route().current("users.*"),roles:["admin","engineer"]}];return e.jsxs("div",{className:"min-h-screen bg-gray-100 dark:bg-gray-900",children:[e.jsxs("nav",{className:"bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700",children:[e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex justify-between h-16",children:[e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"shrink-0 flex items-center",children:e.jsx(m,{href:u,children:e.jsx(j,{className:"block h-8 w-auto fill-current text-gray-800 dark:text-gray-200"})})}),e.jsx("div",{className:"hidden space-x-4 sm:-my-px sm:ms-10 sm:flex",children:y.map(({name:n,href:i,active:h,roles:x},p)=>x.includes(r.role)||x.includes("*")?e.jsx(L,{href:i,active:h,children:n},p):null)})]}),e.jsx("div",{className:"hidden sm:flex sm:items-center sm:ms-6",children:e.jsx("div",{className:"ms-3 relative",children:e.jsxs(o,{children:[e.jsx(o.Trigger,{children:e.jsx("span",{className:"inline-flex rounded-md",children:e.jsxs("button",{type:"button",className:"inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150",children:[e.jsx("span",{className:"bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center",children:e.jsx("i",{className:"pi pi-user"})}),e.jsx("svg",{className:" -me-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})})]})})}),e.jsxs(o.Content,{children:[e.jsx(o.Link,{href:route("profile.edit"),children:"Profil"}),e.jsx(o.Link,{href:route("logout"),method:"post",as:"button",children:"Çıkış Yap"})]})]})})}),e.jsx("div",{className:"-me-2 flex items-center sm:hidden",children:e.jsx("button",{onClick:()=>g(n=>!n),className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out",children:e.jsxs("svg",{className:"h-6 w-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("path",{className:c?"hidden":"inline-flex",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16M4 18h16"}),e.jsx("path",{className:c?"inline-flex":"hidden",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M6 18L18 6M6 6l12 12"})]})})})]})}),e.jsxs("div",{className:(c?"block":"hidden")+" sm:hidden",children:[e.jsx("div",{className:"pt-2 pb-3 space-y-1",children:y.map(({name:n,href:i,active:h,roles:x},p)=>x.includes(r.role)||x.includes("*")?e.jsx(f,{href:i,active:h,children:n},p):null)}),e.jsxs("div",{className:"pt-4 pb-1 border-t border-gray-200 dark:border-gray-600",children:[e.jsxs("div",{className:"px-4",children:[e.jsx("div",{className:"font-medium text-base text-gray-800 dark:text-gray-200",children:r.name}),e.jsx("div",{className:"font-medium text-sm text-gray-500",children:r.email})]}),e.jsxs("div",{className:"mt-3 space-y-1",children:[e.jsx(f,{href:route("profile.edit"),children:"Profil"}),e.jsx(f,{method:"post",href:route("logout"),as:"button",children:"Çıkış Yap"})]})]})]})]}),a&&e.jsx("header",{className:"bg-white dark:bg-gray-800 shadow px-3 py-2",children:e.jsx("div",{className:"surface-0 max-w-7xl mx-auto",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-xl text-900 py-3 sm:py-0 lg:text-3xl",children:a}),e.jsx("div",{className:"hidden items-center text-700 flex-wrap mt-2 lg:flex",children:d&&d.map((n,i)=>n.hidden?null:e.jsxs("div",{className:"flex items-center mt-3 "+d.length!==i+1&&"mr-5",children:[e.jsx("i",{className:"pi mr-2 "+n.icon}),e.jsx("span",{children:n.text})]},i))})]}),s&&e.jsxs("div",{className:"grid grid-cols-3 grid-rows-1 gap-1 ",children:[s.length===1&&e.jsxs(e.Fragment,{children:[e.jsx("span",{}),e.jsx("span",{})]}),s.length===2&&e.jsx(e.Fragment,{children:e.jsx("span",{})}),s.map((n,i)=>e.jsx(v,{...n},i))]})]})})}),e.jsx("main",{children:t}),e.jsxs("footer",{className:"hidden bottom-0 h-6 left-0 right-0  justify-between px-4 items-center",children:[e.jsxs("span",{children:["Her Hakkı Saklıdır © ",new Date().getFullYear()," -  ",e.jsx("a",{href:"https://github.com/furkanmeclis",target:"_blank",children:"Furkan MECLİS"})]}),e.jsx("a",{href:"https://ckymoto.com",target:"_blank",children:"CKYMOTO"})]})]})}export{O as A};