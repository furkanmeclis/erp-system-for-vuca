import{W as o,j as e,Y as u}from"./app-CZojdjD4.js";import{G as d}from"./GuestLayout-2NbqodPZ.js";import{T as c,I as x}from"./TextInput-CA38Iy3F.js";import{P as p}from"./PrimaryButton-AjGMCNaJ.js";import"./ApplicationLogo-C3VFVwyk.js";function z({status:t}){const{data:s,setData:r,post:i,processing:m,errors:n}=o({email:""}),l=a=>{a.preventDefault(),i(route("password.email"))};return e.jsxs(d,{children:[e.jsx(u,{title:"Parolanızı mı unuttunuz"}),e.jsx("div",{className:"mb-4 text-sm text-gray-600 dark:text-gray-400",children:"Parolanızı mı unuttunuz? Sorun değil. Bize e-posta adresinizi bildirin, size e-postayla bir şifre göndereceğiz yeni bir tane seçmenizi sağlayacak bağlantıyı sıfırlayın."}),t&&e.jsx("div",{className:"mb-4 font-medium text-sm text-green-600 dark:text-green-400",children:t}),e.jsxs("form",{onSubmit:l,children:[e.jsx(c,{id:"email",type:"email",name:"email",value:s.email,className:"mt-1 block w-full",isFocused:!0,onChange:a=>r("email",a.target.value)}),e.jsx(x,{message:n.email,className:"mt-2"}),e.jsx("div",{className:"flex items-center justify-end mt-4",children:e.jsx(p,{className:"ms-4",disabled:m,children:"E-posta Şifre Sıfırlama Bağlantısı"})})]})]})}export{z as default};