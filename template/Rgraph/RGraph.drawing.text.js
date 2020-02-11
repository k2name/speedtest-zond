
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Text=function(conf)
{var id=conf.id
var x=conf.x;var y=conf.y;var text=String(conf.text);this.id=id;this.canvas=document.getElementById(id);this.context=this.canvas.getContext('2d');this.colorsParsed=false;this.canvas.__object__=this;this.x=x;this.y=y;this.text=String(text);this.coords=[];this.coordsText=[];this.original_colors=[];this.firstDraw=true;this.type='drawing.text';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={textSize:12,textFont:'Arial, Verdana, sans-serif',textBold:false,textItalic:false,angle:0,colors:['black'],highlightStroke:'#ccc',highlightFill:'rgba(255,255,255,0.5)',tooltips:null,tooltipsEffect:'fade',tooltipsCssClass:'RGraph_tooltip',tooltipsEvent:'onclick',tooltipsHighlight:true,tooltipsCoordsPage:false,bounding:false,boundingFill:'rgba(255,255,255,0.7)',boundingStroke:'#777',boundingShadow:false,boundingShadowColor:'#ccc',boundingShadowBlur:3,boundingShadowOffsetx:3,boundingShadowOffsety:3,marker:false,halign:'left',valign:'bottom',link:null,linkTarget:'_self',linkOptions:'',textAccessible:true,textAccessibleOverflow:'visible',textAccessiblePointerevents:false,shadow:false,shadowColor:'#ccc',shadowOffsetx:2,shadowOffsety:2,shadowBlur:3,clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.TEXT] No canvas support');return;}
this.$0={};if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{RGraph.fireCustomEvent(this,'onbeforedraw');if(!this.colorsParsed){this.parseColors();this.colorsParsed=true;}
this.coords=[];this.coordsText=[];var dimensions=RGraph.measureText(this.text,prop.textBold,prop.textFont,prop.textSize);this.context.fillStyle=prop.colors[0];if(prop.shadow){RGraph.setShadow(this,prop.shadowColor,prop.shadowOffsetx,prop.shadowOffsety,prop.shadowBlur);}
var ret=RGraph.text({object:this,font:prop.textFont,size:prop.textSize,bold:prop.textBold,italic:prop.textItalic,color:prop.colors[0],x:this.x,y:this.y,text:this.text,angle:prop.angle,bounding:prop.bounding,'bounding.fill':prop.boundingFill,'bounding.stroke':prop.boundingStroke,'bounding.shadow':prop.boundingShadow,'bounding.shadow.color':prop.boundingShadowColor,'bounding.shadow.blur':prop.boundingShadowBlur,'bounding.shadow.offsetx':prop.boundingShadowOffsetx,'bounding.shadow.offsety':prop.boundingShadowOffsety,marker:prop.marker,halign:prop.halign,valign:prop.valign});if(prop.shadow){RGraph.noShadow(this);}
this.coords.push({0:ret.x,x:ret.x,1:ret.y,y:ret.y,2:ret.width,width:ret.width,3:ret.height,height:ret.height});RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{if(this.getShape(e)){return this;}};this.getShape=function(e)
{var prop=this.properties;var coords=this.coords;var mouseXY=RGraph.getMouseXY(e);var mouseX=mouseXY[0];var mouseY=mouseXY[1];for(var i=0,len=this.coords.length;i<len;i++){var left=coords[i].x;var top=coords[i].y;var width=coords[i].width;var height=coords[i].height;if(mouseX>=left&&mouseX<=(left+width)&&mouseY>=top&&mouseY<=(top+height)){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,x:left,y:top,width:width,height:height,dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}}
return null;};this.highlight=function(shape)
{if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{RGraph.Highlight.rect(this,shape);}};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colors=RGraph.arrayClone(prop.colors)[0];this.original_colors.colorsFill=RGraph.arrayClone(prop.colorsFill);this.original_colors.colorsStroke=RGraph.arrayClone(prop.colorsStroke);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);}
prop.colors[0]=this.parseSingleColorForGradient(prop.colors[0]);prop.colorsFill=this.parseSingleColorForGradient(prop.colorsFill);prop.colorsStroke=this.parseSingleColorForGradient(prop.colorsStroke);prop.highlightStroke=this.parseSingleColorForGradient(prop.highlightStroke);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color){return color;}
if(typeof color==='string'&&color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':');var grad=this.context.createLinearGradient(0,0,this.canvas.width,0);var diff=1/(parts.length-1);grad.addColorStop(0,RGraph.trim(parts[0]));for(var j=1,len=parts.length;j<len;++j){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};