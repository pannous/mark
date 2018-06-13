(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Mark=f()}})(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){let MarkMutate=function(Mark,lenSymbol){let $length=lenSymbol;let api={push:function(){let length=this[$length];for(let i=0;i<arguments.length;i++){Object.defineProperty(this,length+i,{value:arguments[i],writable:true,configurable:true})}length+=arguments.length;this[$length]=length;return this},pop:function(){let length=this[$length];if(length>0){let item=this[length-1];delete this[length-1];this[$length]=length-1;return item}else{return undefined}},insert:function(item,index){index=index||0;let length=this[$length];if(index<0||index>length){throw"Invalid index"}let offset=item instanceof Array?item.length:1;for(let i=length-1;i>=index;i--){Object.defineProperty(this,i+offset,{value:this[i],writable:true,configurable:true})}if(offset>1){for(let i=0;i<offset;i++){Object.defineProperty(this,index+i,{value:item[i],writable:true,configurable:true})}}else{Object.defineProperty(this,index,{value:item,writable:true,configurable:true})}this[$length]=length+offset;return this},remove:function(index){if(arguments.length){var length=this[$length];if(index>=0&&index<length){for(var i=index;i<length-1;i++){this[i]=this[i+1]}this[$length]=length-1}}return this},set:function(key,value){var index;if(typeof key==="string"){if(isNaN(key*1)){this[key]=value;return this}index=key*1}else if(typeof key==="number"){index=key}else{return this}if(Math.round(index)===index){if(0<=index&&index<this[$length]){this[index]=value}else if(index===this[$length]){this[index]=value;this[$length]=this[$length]+1}}return this},replaceWith:function(obj){let trg=this;for(let p in trg){if(typeof trg[p]!=="function")delete trg[p]}for(let i=0,len=trg[$length];i<len;i++){delete trg[i]}Object.setPrototypeOf(trg,Object.getPrototypeOf(obj));for(let p in obj){trg[p]=obj[p]}var length=obj[$length];for(let i=0;i<length;i++){Object.defineProperty(trg,i,{value:obj[i],writable:true,configurable:true})}trg[$length]=length;return this}};for(let a in api){Object.defineProperty(Mark.prototype,a,{value:api[a],writable:true,configurable:true})}};module.exports=MarkMutate},{}],2:[function(require,module,exports){"use strict";const $length=Symbol("Mark.length"),$parent=Symbol("Mark.parent"),$pragma=Symbol("Mark.pragma");let $convert=null,constructors={};var MARK=function(){if(!constructors.constructor.name){obj.constructor.name="Object"}function Mark(typeName,props,contents){if(arguments.length===1&&typeName[0]==="{"){return MARK.parse(typeName)}let con=constructors[typeName];if(!con){if(typeof typeName!=="string"){throw"Type name should be a string"}con=constructors[typeName]=function(){};Object.defineProperty(con,"name",{value:typeName,configurable:true});Object.setPrototypeOf(con.prototype,Mark.prototype)}let obj=Object.create(con.prototype);if(props){for(let p in props){if(isNaN(p*1)){obj[p]=props[p]}}}let len=0;if(contents){let prevType=null;function addContents(items){for(let val of items){let t=typeof val;if(t==="string"){if(!val.length)continue;if(prevType==="string"){len--;val=obj[len]+val}}else if(t==="object"){if(val===null)continue;else if(val instanceof Array){addContents(val);continue}val[$parent]=obj}else if(t==="undefined"){continue}else{val=val.toString();if(prevType==="string"){len--;val=obj[len]+val}}Object.defineProperty(obj,len,{value:val,writable:true,configurable:true});prevType=t;len++}}addContents(Array.isArray(contents)?contents:[contents])}obj[$length]=len;return obj}var api={contents:function(){let list=[];for(let c of this){list.push(c)}return list},length:function(){return this[$length]},parent:function(pa){return this[$parent]},pragma:function(value){return this[$pragma]},filter:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;const obj=Object(this);let res=[],i=0;for(const n of obj){if(func.call(thisArg||obj,n,i,obj)){res.push(n)}i++}return res},map:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;const obj=Object(this);let res=[],i=0;for(const n of obj){res[i]=func.call(thisArg||obj,n,i,obj);i++}return res},reduce:function(func){if(!(typeof func==="function"&&this))throw new TypeError;let obj=Object(this),len=obj[$length],k=0,value;if(arguments.length==2){value=arguments[1]}else{if(k>=len){throw new TypeError("Reduce of empty contents with no initial value")}value=obj[k++]}for(;k<len;k++){value=func(value,obj[k],k,obj)}return value},every:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;let i=0,obj=Object(this);for(const n of obj){var result=func.call(thisArg||obj,n,i,obj);if(!result){return false}i++}return true},some:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;let i=0,obj=Object(this);for(const n of obj){if(func.call(thisArg||obj,n,i,obj)){return true}i++}return false},each:function(func,thisArg){if(!(typeof func==="function"&&this))throw new TypeError;let i=0,obj=Object(this);for(const n of obj){func.call(thisArg||obj,n,i,obj);i++}},source:function(options){return MARK.stringify(this,options)},text:function(){let txt=[];let _text=function(obj){for(let n of obj){if(typeof n==="string"){txt.push(n)}else if(n.constructor){_text(n)}}};_text(this);return txt.join("")},html:function(options){let opt=options||{};opt.format="html";return MARK.stringify(this,opt)},xml:function(options){let opt=options||{};opt.format="xml";return MARK.stringify(this,opt)}};for(let a in api){Object.defineProperty(Mark.prototype,a,{value:api[a],writable:true,configurable:true})}try{require("./lib/mark.selector.js")(Mark)}catch(e){console.trace("No Mark Selector API",e.message)}try{require("./lib/mark.mutate.js")(Mark,$length)}catch(e){console.trace("No Mark Mutate API",e.message)}Mark.prototype[Symbol.iterator]=function*(){let length=this[$length];for(let i=0;i<length;i++){yield this[i]}};Mark.pragma=function(pragma){let con=constructors[$pragma];if(!con){con=Object.create(null);Object.defineProperty(con,"pragma",{value:api.pragma});Object.defineProperty(con,"parent",{value:api.parent});Object.defineProperty(con,"valueOf",{value:Object.valueOf});Object.defineProperty(con,"toString",{value:function(){return"[object Pragma]"}});constructors[$pragma]=con}let obj=Object.create(con);obj[$pragma]=pragma;return obj};return Mark}();function isNameChar(c){return"a"<=c&&c<="z"||"A"<=c&&c<="Z"||"0"<=c&&c<="9"||c==="_"||c==="$"||c==="."||c==="-"}function isNameStart(c){return"a"<=c&&c<="z"||"A"<=c&&c<="Z"||c==="_"||c==="$"}MARK.isName=function(key){if(typeof key!=="string"){return false}if(!isNameStart(key[0])){return false}var i=1,length=key.length;while(i<length){if(!isNameChar(key[i])){return false}i++}return true};let base64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";MARK.parse=function(){"use strict";let UNEXPECT_END="Unexpected end of input";let at,lineNumber,columnStart,ch,text,escapee={"'":"'",'"':'"',"\\":"\\","/":"/","\n":"",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},ws=[" ","\t","\r","\n"],renderChar=function(chr){return chr===""?"EOF":"'"+chr+"'"},error=function(m){var columnNumber=at-columnStart;var msg=m+" at line "+lineNumber+" column "+columnNumber+" of the Mark data. Still to read: "+JSON.stringify(text.substring(at-1,at+30)+"...");var error=new SyntaxError(msg);error.at=at;error.lineNumber=lineNumber;error.columnNumber=columnNumber;throw error},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of "+renderChar(ch))}ch=text.charAt(at);at++;if(ch==="\n"||ch==="\r"&&text[at]!=="\n"){lineNumber++;columnStart=at}return ch},identifier=function(){var key=ch;if(ch!=="_"&&ch!=="$"&&(ch<"a"||ch>"z")&&(ch<"A"||ch>"Z")){error("Bad identifier as unquoted key")}while(next()&&("a"<=ch&&ch<="z"||"A"<=ch&&ch<="Z"||"0"<=ch&&ch<="9"||ch==="_"||ch==="$"||ch==="."||ch==="-")){key+=ch}return key},number=function(){let number,sign="",string="",base=10;if(ch==="-"||ch==="+"){sign=ch;next(ch)}if(ch==="I"){number=word();if(typeof number!=="number"||isNaN(number)){error("Unexpected word for number")}return sign==="-"?-number:number}if(ch==="N"){number=word();if(!isNaN(number)){error("expected word to be NaN")}return number}if(ch==="0"){string+=ch;next()}else{while(ch>="0"&&ch<="9"){string+=ch;next()}if(ch==="."){string+=".";while(next()&&ch>="0"&&ch<="9"){string+=ch}}if(ch==="e"||ch==="E"){string+=ch;next();if(ch==="-"||ch==="+"){string+=ch;next()}while(ch>="0"&&ch<="9"){string+=ch;next()}}}if(sign==="-"){number=-string}else{number=+string}if(!isFinite(number)){error("Bad number")}else{return number}},string=function(){var hex,i,string="",triple=false,delim,uffff;if(ch==='"'||ch==="'"){delim=ch;if(text[at]===delim&&text[at+1]===delim){triple=true;next();next()}while(next()){if(ch===delim){next();if(!triple){return string}else if(ch===delim&&text[at]===delim){next();next();return string}else{string+=delim}}if(ch==="\\"){if(triple){string+="\\"}else{next();if(ch==="u"){uffff=0;for(i=0;i<4;i+=1){hex=parseInt(next(),16);if(!isFinite(hex)){break}uffff=uffff*16+hex}string+=String.fromCharCode(uffff)}else if(ch==="\r"){if(text[at]==="\n"){next()}}else if(typeof escapee[ch]==="string"){string+=escapee[ch]}else{break}}}else{string+=ch}}}error("Bad string")},inlineComment=function(){if(ch!=="/"){error("Not an inline comment")}do{next();if(ch==="\n"||ch==="\r"){next();return}}while(ch)},blockComment=function(){if(ch!=="*"){error("Not a block comment")}do{next();while(ch==="*"){next("*");if(ch==="/"){next("/");return}}}while(ch);error("Unterminated block comment")},comment=function(){if(ch!=="/"){error("Not a comment")}next("/");if(ch==="/"){inlineComment()}else if(ch==="*"){blockComment()}else{error("Unrecognized comment")}},white=function(){while(ch){if(ch==="/"){comment()}else if(ws.indexOf(ch)>=0){next()}else{return}}},isSuffix=function(suffix){let len=suffix.length;for(let i=0;i<len;i++){if(text[at+i]!==suffix[i]){at+=i+1;return false}}if(isNameStart(text[at+len])){at+=len+1;return false}ch=text[at+len];at+=len+1;return true},word=function(){switch(ch){case"t":if(isSuffix("rue")){return true}break;case"f":if(isSuffix("alse")){return false}break;case"n":if(isSuffix("ull")){return null}break;case"I":if(isSuffix("nfinity")){return Infinity}break;case"N":if(isSuffix("aN")){return NaN}}error("Unexpected character "+renderChar(text.charAt(at-1)))},value,array=function(){var array=[];next();white();while(ch){if(ch==="]"){next();return array}if(ch===","){error("Missing array element")}else{array.push(value())}white();if(ch===","){next();white()}}};let lookup64=new Uint8Array(128);lookup64.fill(65);for(var i=0;i<64;i++){lookup64[base64.charCodeAt(i)]=i}lookup64[32]=lookup64[9]=lookup64[13]=lookup64[10]=64;let lookup85=new Uint8Array(128);lookup85.fill(86);for(var i=0;i<128;i++){if(33<=i&&i<=117)lookup85[i]=i-33}lookup85[32]=lookup85[9]=lookup85[13]=lookup85[10]=85;let binary=function(parent){at++;if(text[at]==="~"){at++;let end=text.indexOf("~}",at);if(end<0){error("Missing base85 end delimiter")}let base=new Uint8Array(new ArrayBuffer(end-at)),p=0;while(at<end){let code=lookup85[text.charCodeAt(at)];if(code>85){error("Invalid base85 encoding")}if(code<85){base[p++]=code}at++}at=end+2;next();let dataLength=p,padding=dataLength%5===0?0:5-dataLength%5;var buffer=new ArrayBuffer(4*Math.ceil(dataLength/5)-padding),bytes=new DataView(buffer);console.log("binary length: ",buffer.byteLength);for(let i=0,p=0;i<dataLength;i+=5,p+=4){let num=((((base[i]<<0)*85+(base[i+1]<<0))*85+(base[i+2]<<0))*85+(base[i+3]<<0))*85+(base[i+4]<<0);bytes.setUint32(p,num)}buffer[$parent]=parent;return buffer}else{let end=text.indexOf("}",at),bufEnd=end;if(end<0){error("Missing base64 end delimiter")}if(text[bufEnd-1]==="="){bufEnd--;if(text[bufEnd-1]==="="){bufEnd--}}if(bufEnd<=at){error("Invalid base64 encoding")}let base=new Uint8Array(new ArrayBuffer(bufEnd-at)),p=0;while(at<bufEnd){let code=lookup64[text.charCodeAt(at)];if(code>64){error("Invalid base64 encoding")}if(code<64){base[p++]=code}at++}at=end+1;next();let len=Math.floor(p*.75),code1,code2,code3,code4,buffer=new ArrayBuffer(len),bytes=new Uint8Array(buffer);console.log("binary length: ",len);for(let i=0,p=0;p<len;i+=4){code1=base[i];code2=base[i+1];code3=base[i+2];code4=base[i+3];bytes[p++]=code1<<2|code2>>4;bytes[p++]=(code2&15)<<4|code3>>2;bytes[p++]=(code3&3)<<6|code4&63}buffer[$parent]=parent;return buffer}};let object=function(parent){let obj={},key=null,extended=false,hasBrace=false,index=0;if(parent){obj[$parent]=parent}next();let bkAt=at,bkLineNumber=lineNumber,bkColumnStart=columnStart;let putText=function(text){if(index>0&&typeof obj[index-1]==="string"){obj[index-1]+=text}else{Object.defineProperty(obj,index,{value:text,writable:true,configurable:true});index++}},parseContent=function(){while(ch){if(ch==="{"){hasBrace=true;let child=text[at]===":"?binary(obj):object(obj);child[$parent]=obj;Object.defineProperty(obj,index,{value:child,writable:true,configurable:true});index++}else if(ch==='"'||ch==="'"){let str=string();if(str)putText(str)}else if(ch==="}"){next();obj[$length]=index;return}else{error("Unexpected character "+renderChar(ch))}white()}error(UNEXPECT_END)},parsePragma=function(){if(hasBrace||key){error("Bad object")}at=bkAt;lineNumber=bkLineNumber;columnStart=bkColumnStart;ch=text.charAt(at-1);let pragma="";while(ch){if(ch==="}"){next();let pgm=MARK.pragma(pragma);pgm[$parent]=parent;return pgm}else if(ch==="\\"){next();if(ch!=="{"&&ch!=="}"&&ch!==":"&&ch!==";"){pragma+="\\"}}else if(ch==="{"||ch==="}"||ch===":"){error("Bad object")}else if(ch===";"){error("Character ';' should be escaped in Mark pragma")}pragma+=ch;next()}error(UNEXPECT_END)};white();while(ch){if(ch==="}"){next();if(extended){obj[$length]=index}return obj}if(ch==="{"){if(extended){hasBrace=true;parseContent();return obj}error("Unexpected character '{'")}if(ch==='"'||ch==="'"){var str=string();white();if(ch===":"){key=str}else{if(extended){if(str)putText(str);if(ch==="}"||ch==="{"||ch==='"'||ch==="'"){parseContent();return obj}else{return parsePragma()}}else if(!key){obj=MARK(str,null,null);extended=true;continue}else{return parsePragma()}}}else if(ch==="_"||ch==="$"||"a"<=ch&&ch<="z"||"A"<=ch&&ch<="Z"){var ident=identifier();white();if(ch==":"){key=ident}else{if(!extended){obj=MARK(ident,null,null);extended=true;continue}return parsePragma()}}else{return parsePragma()}next();if(ch==="{"){hasBrace=true}var val=value();if(extended&&!isNaN(key*1)){error("Numeric key not allowed as Mark property name")}if(obj[key]&&typeof obj[key]!=="function"){error("Duplicate key not allowed: "+key)}obj[key]=val;white();if(ch===","){next();white()}}error(UNEXPECT_END)};value=function(){white();switch(ch){case"{":return text[at]===":"?binary():object();case"[":return array();case'"':case"'":return string();case"-":case"+":case".":return number();default:return ch>="0"&&ch<="9"?number():word()}};return function(source,options){at=0;lineNumber=1;columnStart=at;ch=" ";text=String(source);if(!source){text="";error(UNEXPECT_END)}if(typeof options==="object"&&options.format&&options.format!="mark"){if(!$convert){$convert=require("./lib/mark.convert.js")(MARK)}return $convert.parse(source,options)}var result=value();white();if(ch){error("Expect end of input")}return result}}();MARK.stringify=function(obj,options){"use strict";var indentStep,indentStrs,space,omitComma;function indent(num,noNewLine){if(num>=indentStrs.length){for(var i=indentStrs.length;i<=num;i++){indentStrs[i]=indentStrs[i-1]+indentStep}}return noNewLine?indentStrs[num]:"\n"+indentStrs[num]}if(options){omitComma=options.omitComma;space=options.space;indentStrs=[""];if(space){if(typeof space==="string"){indentStep=space}else if(typeof space==="number"&&space>=0){indentStep=new Array(space+1).join(" ")}else{indentStep=""}if(indentStep&&indentStep.length>10){indentStep=indentStep.substring(0,10)}}if(options.format&&options.format!=="mark"){if(!$convert){$convert=require("./lib/mark.convert.js")(MARK)}$convert.indent=indent;if(options.format==="xml"||options.format==="html")return $convert.toSgml(obj,options);else return null}}function isDate(obj){return Object.prototype.toString.call(obj)==="[object Date]"}var objStack=[];function checkForCircular(obj){for(var i=0;i<objStack.length;i++){if(objStack[i]===obj){throw new TypeError("Converting circular structure to JSON")}}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};function escapeString(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function _stringify(value){let buffer;if(value&&!isDate(value)){value=value.valueOf()}switch(typeof value){case"boolean":return value.toString();case"number":if(isNaN(value)||!isFinite(value)){return"null"}return value.toString();case"string":return escapeString(value.toString());case"object":if(value===null){return"null"}else if(Array.isArray(value)){checkForCircular(value);buffer="[";objStack.push(value);for(var i=0;i<value.length;i++){let res=_stringify(value[i]);if(indentStep)buffer+=indent(objStack.length);if(res===null||res===undefined){buffer+="null"}else{buffer+=res}if(i<value.length-1){buffer+=omitComma?" ":","}else if(indentStep){buffer+="\n"}}objStack.pop();if(value.length&&indentStep){buffer+=indent(objStack.length,true)}buffer+="]"}else if(value instanceof ArrayBuffer){var bytes=new Uint8Array(value),i,fullLen=bytes.length,len=fullLen-fullLen%3;buffer="{:";for(i=0;i<len;i+=3){buffer+=base64[bytes[i]>>2];buffer+=base64[(bytes[i]&3)<<4|bytes[i+1]>>4];buffer+=base64[(bytes[i+1]&15)<<2|bytes[i+2]>>6];buffer+=base64[bytes[i+2]&63]}if(fullLen%3){buffer+=base64[bytes[i]>>2]+base64[(bytes[i]&3)<<4|bytes[i+1]>>4]+(fullLen%3===2?base64[(bytes[i+1]&15)<<2]:"=")+"="}buffer+="}"}else{checkForCircular(value);buffer="{";var nonEmpty=false;if(!value.constructor){return value[$pragma]?"{"+value[$pragma]+"}":"null"}objStack.push(value);if(value.constructor.name!=="Object"||value instanceof MARK){buffer+=value.constructor.name;nonEmpty=true}let hasAttr=false;for(var prop in value){let res=_stringify(value[prop]);if(res!==undefined){let key=MARK.isName(prop)?prop:escapeString(prop);buffer+=(hasAttr?omitComma?" ":", ":nonEmpty?" ":"")+key+":"+res;hasAttr=true;nonEmpty=true}}let length=value[$length];if(length){for(let i=0;i<length;i++){buffer+=" ";let item=value[i];if(typeof item==="string"){if(indentStep)buffer+=indent(objStack.length);buffer+=escapeString(item.toString())}else if(typeof item==="object"){if(indentStep)buffer+=indent(objStack.length);buffer+=_stringify(item)}else{console.log("unknown object",item)}}}objStack.pop();if(nonEmpty){if(length&&indentStep){buffer+=indent(objStack.length)}buffer+="}"}else{buffer="{}"}}return buffer;default:return undefined}}if(obj===undefined){return undefined}return _stringify(obj)};module.exports=MARK},{"./lib/mark.convert.js":"/lib\\mark.convert.js","./lib/mark.mutate.js":1,"./lib/mark.selector.js":"/lib\\mark.selector.js"}]},{},[2])(2)});
