
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Marker1=function(conf)
{var id=conf.id,canvas=document.getElementById(id),x=conf.x,y=conf.y,radius=conf.radius,text=conf.text;this.id=id;this.canvas=canvas;this.context=this.canvas.getContext("2d");this.colorsParsed=false;this.canvas.__object__=this;this.original_colors=[];this.firstDraw=true;this.centerx=x;this.centery=y;this.radius=radius;this.text=text;this.type='drawing.marker1';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={colorsStroke:'black',colorsFill:'white',linewidth:2,textColor:'black',textSize:12,textFont:'Arial, Verdana, sans-serif',textBold:false,textItalic:false,textAccessible:true,textAccessibleOverflow:'visible',textAccessiblePointerevents:false,shadow:true,shadowColor:'#aaa',shadowOffsetx:0,shadowOffsety:0,shadowBlur:15,highlightStroke:'rgba(0,0,0,0)',highlightFill:'rgba(255,0,0,0.7)',tooltips:null,tooltipsHighlight:true,tooltipsEvent:'onclick',align:'center',clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.MARKER1] No canvas support');return;}
this.$0={};this.coords=[];this.coordsText=[];if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{RGraph.fireCustomEvent(this,'onbeforedraw');var r=this.radius;if(prop.align=='left'){this.markerCenterx=this.centerx-r-r-3;this.markerCentery=this.centery-r-r-3;}else if(prop.align=='right'){this.markerCenterx=this.centerx+r+r+3;this.markerCentery=this.centery-r-r-3;}else{this.markerCenterx=this.centerx;this.markerCentery=this.centery-r-r-3;}
if(!this.colorsParsed){this.parseColors();this.colorsParsed=true;}
this.coordsText=[];this.path({path:'b lw %',args:[prop.linewidth]});if(prop.shadow){RGraph.setShadow(this,prop.shadowColor,prop.shadowOffsetx,prop.shadowOffsety,prop.shadowBlur);}
this.drawMarker();this.path({path:'c s % f %',args:[prop.colorsStroke,prop.colorsFill]});RGraph.noShadow(this);var textConf=RGraph.getTextConf({object:this,prefix:'text'});this.context.fillStyle=prop.textColor;RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:this.coords[0][0]-1,y:this.coords[0][1]-1,text:this.text,valign:'center',halign:'center',tag:'labels'});RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{if(this.getShape(e)){return this;}};this.getShape=function(e)
{var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];this.context.beginPath();this.drawMarker();if(this.context.isPointInPath(mouseXY[0],mouseXY[1])){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,x:this.coords[0][0],y:this.coords[0][1],radius:this.coords[0][2],dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}
return null;};this.highlight=function(shape)
{if(prop.tooltipsHighlight){if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.context.beginPath();this.context.strokeStyle=prop.highlightStroke;this.context.fillStyle=prop.highlightFill;this.drawMarker();this.context.closePath();this.context.stroke();this.context.fill();}}};this.drawMarker=function()
{var r=this.radius;if(prop.align==='left'){var x=this.markerCenterx,y=this.markerCentery;this.path({path:'a % % % % % false',args:[x,y,r,RGraph.HALFPI,RGraph.TWOPI]});this.path({path:'qc % % % %',args:[x+r,y+r,x+r+r,y+r+r]});this.path({path:'qc % % % %',args:[x+r,y+r,x,y+r]});}else if(prop.align==='right'){var x=this.markerCenterx,y=this.markerCentery;this.path({path:'a % % % % % true',args:[x,y,r,RGraph.HALFPI,RGraph.PI]});this.path({path:'qc % % % %',args:[x-r,y+r,x-r-r,y+r+r]});this.path({path:'qc % % % %',args:[x-r,y+r,x,y+r]});}else{var x=this.markerCenterx,y=this.markerCentery;this.path({path:'a % % % % % true',args:[x,y,r,RGraph.HALFPI/2,RGraph.PI-(RGraph.HALFPI/2)]});this.path({path:'qc % % % %',args:[x,y+r+(r/4),x,y+r+r-2]});this.path({path:'qc % % % %',args:[x,y+r+(r/4),x+(Math.cos(RGraph.HALFPI/2)*r),y+(Math.sin(RGraph.HALFPI/2)*r)]});}
this.coords[0]=[x,y,r];};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colorsFill=RGraph.arrayClone(prop.colorsFill);this.original_colors.colorsStroke=RGraph.arrayClone(prop.colorsStroke);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.textColor=RGraph.arrayClone(prop.textColor);}
prop.colorsFill=this.parseSingleColorForGradient(prop.colorsFill);prop.colorsStroke=this.parseSingleColorForGradient(prop.colorsStroke);prop.highlightStroke=this.parseSingleColorForGradient(prop.highlightStroke);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);prop.textColor=this.parseSingleColorForGradient(prop.textColor);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color||typeof(color)!='string'){return color;}
if(color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':'),grad=this.context.createRadialGradient(this.markerCenterx,this.markerCentery,0,this.markerCenterx,this.markerCentery,this.radius),diff=1/(parts.length-1);grad.addColorStop(0,RGraph.trim(parts[0]));for(var j=1;j<parts.length;++j){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};