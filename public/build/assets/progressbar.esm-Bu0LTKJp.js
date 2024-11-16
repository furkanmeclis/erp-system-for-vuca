import{r as o,P as x,c as m}from"./app-CZojdjD4.js";import{C as E,u as S,a as _}from"./iconbase.esm-DvODm2qg.js";function c(){return c=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(n[a]=r[a])}return n},c.apply(this,arguments)}function u(n){"@babel/helpers - typeof";return u=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(n)}function N(n,e){if(u(n)!=="object"||n===null)return n;var r=n[Symbol.toPrimitive];if(r!==void 0){var a=r.call(n,e||"default");if(u(a)!=="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function k(n){var e=N(n,"string");return u(e)==="symbol"?e:String(e)}function B(n,e,r){return e=k(e),e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}var C={root:function(e){var r=e.props;return r.mode==="indeterminate"?m("p-progressbar p-component p-progressbar-indeterminate"):m("p-progressbar p-component p-progressbar-determinate")},value:"p-progressbar-value p-progressbar-value-animate",label:"p-progressbar-label",container:"p-progressbar-indeterminate-container"},D=`
@layer primereact {
  .p-progressbar {
      position: relative;
      overflow: hidden;
  }
  
  .p-progressbar-determinate .p-progressbar-value {
      height: 100%;
      width: 0%;
      position: absolute;
      display: none;
      border: 0 none;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
  }
  
  .p-progressbar-determinate .p-progressbar-label {
      display: inline-flex;
  }
  
  .p-progressbar-determinate .p-progressbar-value-animate {
      transition: width 1s ease-in-out;
  }
  
  .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background-color: inherit;
        top: 0;
        left: 0;
        bottom: 0;
        will-change: left, right;
        -webkit-animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
                animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
  }
  
  .p-progressbar-indeterminate .p-progressbar-value::after {
      content: '';
      position: absolute;
      background-color: inherit;
      top: 0;
      left: 0;
      bottom: 0;
      will-change: left, right;
      -webkit-animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
              animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
      -webkit-animation-delay: 1.15s;
              animation-delay: 1.15s;
  }
}

@-webkit-keyframes p-progressbar-indeterminate-anim {
  0% {
    left: -35%;
    right: 100%; }
  60% {
    left: 100%;
    right: -90%; }
  100% {
    left: 100%;
    right: -90%; }
}
@keyframes p-progressbar-indeterminate-anim {
  0% {
    left: -35%;
    right: 100%; }
  60% {
    left: 100%;
    right: -90%; }
  100% {
    left: 100%;
    right: -90%; }
}

@-webkit-keyframes p-progressbar-indeterminate-anim-short {
  0% {
    left: -200%;
    right: 100%; }
  60% {
    left: 107%;
    right: -8%; }
  100% {
    left: 107%;
    right: -8%; }
}
@keyframes p-progressbar-indeterminate-anim-short {
  0% {
    left: -200%;
    right: 100%; }
  60% {
    left: 107%;
    right: -8%; }
  100% {
    left: 107%;
    right: -8%; }
}
`,M={value:function(e){var r=e.props,a=Math.max(r.value,2),t=r.value?r.color:"transparent";return r.mode==="indeterminate"?{backgroundColor:r.color}:{width:a+"%",display:"flex",backgroundColor:t}}},p=E.extend({defaultProps:{__TYPE:"ProgressBar",__parentMetadata:null,id:null,value:null,showValue:!0,unit:"%",style:null,className:null,mode:"determinate",displayValueTemplate:null,color:null,children:void 0},css:{classes:C,styles:D,inlineStyles:M}});function y(n,e){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);e&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})),r.push.apply(r,a)}return r}function V(n){for(var e=1;e<arguments.length;e++){var r=arguments[e]!=null?arguments[e]:{};e%2?y(Object(r),!0).forEach(function(a){B(n,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(r,a))})}return n}var T=o.memo(o.forwardRef(function(n,e){var r=S(),a=o.useContext(x),t=p.getProps(n,a),b=p.setMetaData(V({props:t},t.__parentMetadata)),i=b.ptm,s=b.cx,h=b.isUnstyled;_(p.css.styles,h,{name:"progressbar"});var f=o.useRef(null),P=function(){if(t.showValue&&t.value!=null){var l=t.displayValueTemplate?t.displayValueTemplate(t.value):t.value+t.unit;return l}return null},w=function(){var l=P(),g=r({className:m(t.className,s("root")),style:t.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":t.value,"aria-valuemax":"100"},p.getOtherProps(t),i("root")),v=r({className:s("value"),style:{width:t.value+"%",display:"flex",backgroundColor:t.color}},i("value")),j=r({className:s("label")},i("label"));return o.createElement("div",c({id:t.id,ref:f},g),o.createElement("div",v,l!=null&&o.createElement("div",j,l)))},O=function(){var l=r({className:m(t.className,s("root")),style:t.style,role:"progressbar","aria-valuemin":"0","aria-valuenow":t.value,"aria-valuemax":"100"},p.getOtherProps(t),i("root")),g=r({className:s("container")},i("container")),v=r({className:s("value"),style:{backgroundColor:t.color}},i("value"));return o.createElement("div",c({id:t.id,ref:f},l),o.createElement("div",g,o.createElement("div",v)))};if(o.useImperativeHandle(e,function(){return{props:t,getElement:function(){return f.current}}}),t.mode==="determinate")return w();if(t.mode==="indeterminate")return O();throw new Error(t.mode+" is not a valid mode for the ProgressBar. Valid values are 'determinate' and 'indeterminate'")}));T.displayName="ProgressBar";export{T as P};
