
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Image=function(conf)
{var id=conf.id,canvas=document.getElementById(id),x=conf.x,y=conf.y,src=conf.src;this.id=id;this.canvas=document.getElementById(this.id);this.context=this.canvas.getContext('2d');this.colorsParsed=false;this.canvas.__object__=this;this.alignmentProcessed=false;this.original_colors=[];this.firstDraw=true;this.x=x;this.y=y;this.src=src;this.img=new Image();this.img.src=this.src;this.type='drawing.image';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={src:null,width:null,height:null,halign:'left',valign:'top',shadow:false,shadowColor:'gray',shadowOffsetx:3,shadowOffsety:3,shadowBlur:5,tooltips:null,tooltipsHighlight:true,tooltipsCssClass:'RGraph_tooltip',tooltipsEvent:'onclick',highlightStroke:'rgba(0,0,0,0)',highlightFill:'rgba(255,255,255,0.7)',colorsAlpha:1,border:false,borderColor:'black',borderLinewidth:1,borderRadius:0,backgroundColor:'rgba(0,0,0,0)',clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.IMAGE] No canvas support');return;}
this.coords=[];this.$0={};if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{RGraph.fireCustomEvent(this,'onbeforedraw');var obj=this;this.img.onload=function()
{if(!obj.colorsParsed){obj.parseColors();obj.colorsParsed=true;}
obj.width=this.width;obj.height=this.height;if(!obj.alignmentProcessed){var customWidthHeight=(typeof obj.properties.width=='number'&&typeof obj.properties.width=='number');if(obj.properties.halign==='center'){obj.x-=customWidthHeight?(obj.properties.width/2):(this.width/2);}else if(obj.properties.halign=='right'){obj.x-=customWidthHeight?obj.properties.width:this.width;}
if(obj.properties.valign==='center'){obj.y-=customWidthHeight?(obj.properties.height/2):(this.height/2);}else if(obj.properties.valign=='bottom'){obj.y-=customWidthHeight?obj.properties.height:this.height;}
obj.alignmentProcessed=true;}}
if(this.img.complete||this.img.readyState===4){this.img.onload();}
if(prop.shadow){RGraph.setShadow(this,prop.shadowColor,prop.shadowOffsetx,prop.shadowOffsety,prop.shadowBlur);}
var oldAlpha=this.context.globalAlpha;this.context.globalAlpha=prop.colorsAlpha;if(prop.border){this.context.strokeStyle=prop.borderColor;this.context.lineWidth=prop.borderLinewidth;var borderRadius=0;if(this.width||this.height){borderRadius=Math.min(this.width/2,this.height/2)}
if((prop.width/2)>borderRadius&&(prop.height/2)>borderRadius){borderRadius=Math.min((prop.width/2),(prop.height/2))}
if(prop.borderRadius<borderRadius){borderRadius=prop.borderRadius;}
this.context.beginPath();this.roundedRect(Math.round(this.x)-Math.round(this.context.lineWidth/2),Math.round(this.y)-Math.round(this.context.lineWidth/2),(prop.width||this.img.width)+this.context.lineWidth,(prop.height||this.img.height)+this.context.lineWidth,borderRadius);}
if(borderRadius){this.context.save();this.drawBackgroundColor(borderRadius);this.context.beginPath();this.roundedRect(Math.round(this.x)-Math.round(this.context.lineWidth/2),Math.round(this.y)-Math.round(this.context.lineWidth/2),(prop.width||this.img.width)+this.context.lineWidth,(prop.height||this.img.height)+this.context.lineWidth,borderRadius);this.context.clip();}else{this.drawBackgroundColor(0);}
if(typeof prop.height==='number'||typeof prop.width==='number'){this.context.drawImage(this.img,Math.round(this.x),Math.round(this.y),prop.width||this.width,prop.height||this.height);}else{this.context.drawImage(this.img,Math.round(this.x),Math.round(this.y));}
if(borderRadius){this.context.restore();}
RGraph.noShadow(this);if(prop.border){this.context.stroke();}
this.context.globalAlpha=oldAlpha;var obj=this;this.img.onload=function()
{RGraph.redrawCanvas(obj.canvas);obj.coords[0]=[Math.round(obj.x),Math.round(obj.y),typeof prop.width==='number'?prop.width:this.width,typeof prop.height=='number'?prop.height:this.height];}
RGraph.noShadow(this);RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{var mouseXY=RGraph.getMouseXY(e);if(this.getShape(e)){return this;}};this.getShape=function(e)
{var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];if(this.coords&&this.coords[0]&&mouseXY[0]>=this.coords[0][0]&&mouseXY[0]<=(this.coords[0][0]+this.coords[0][2])&&mouseXY[1]>=this.coords[0][1]&&mouseXY[1]<=(this.coords[0][1]+this.coords[0][3])){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,x:this.coords[0][0],y:this.coords[0][1],width:this.coords[0][2],height:this.coords[0][3],dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}
return null;};this.highlight=function(shape)
{if(prop.tooltipsHighlight){if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.path({path:'b r % % % % f % s %',args:[this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3],prop.highlightFill,prop.highlightStroke]});}}};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colorsBackground=RGraph.arrayClone(prop.colorsBackground);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);}
prop.colorsBackground=this.parseSingleColorForGradient(prop.colorsBackground);prop.highlightStroke=this.parseSingleColorForGradient(prop.highlightStroke);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color){return color;}
if(typeof color==='string'&&color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':'),grad=this.context.createLinearGradient(this.x,this.y,this.x+this.img.width,this.y),diff=1/(parts.length-1);grad.addColorStop(0,RGraph.trim(parts[0]));for(var j=1;j<parts.length;++j){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};this.roundedRect=function(x,y,width,height,radius)
{this.context.save();this.context.translate(x,y);this.context.moveTo(width/2,0);this.context.arcTo(width,0,width,height,Math.min(height/2,radius));this.context.arcTo(width,height,0,height,Math.min(width/2,radius));this.context.arcTo(0,height,0,0,Math.min(height/2,radius));this.context.arcTo(0,0,radius,0,Math.min(width/2,radius));this.context.lineTo(width/2,0);this.context.restore();};this.drawBackgroundColor=function(borderRadius)
{this.context.beginPath();this.context.fillStyle=prop.backgroundColor;this.roundedRect(Math.round(this.x)-Math.round(this.context.lineWidth/2),Math.round(this.y)-Math.round(this.context.lineWidth/2),(prop.width||this.img.width)+this.context.lineWidth,(prop.height||this.img.height)+this.context.lineWidth,borderRadius);this.context.fill();};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};