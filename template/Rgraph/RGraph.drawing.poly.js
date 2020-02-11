
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Poly=function(conf)
{var id=conf.id,coords=conf.coords;this.id=id;this.canvas=document.getElementById(this.id);this.context=this.canvas.getContext('2d');this.colorsParsed=false;this.canvas.__object__=this;this.coords=coords;this.coordsText=[];this.original_colors=[];this.firstDraw=true;this.type='drawing.poly';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={linewidth:1,colorsStroke:'black',colorsFill:'red',tooltips:null,tooltipsOverride:null,tooltipsEffect:'fade',tooltipsCssClass:'RGraph_tooltip',tooltipsEvent:'onclick',tooltipsHighlight:true,highlightStroke:'rgba(0,0,0,0)',highlightFill:'rgba(255,255,255,0.7)',shadow:false,shadowColor:'rgba(0,0,0,0.2)',shadowOffsetx:3,shadowOffsety:3,shadowBlur:5,clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.POLY] No canvas support');return;}
this.$0={};if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{RGraph.fireCustomEvent(this,'onbeforedraw');if(!this.colorsParsed){this.parseColors();this.colorsParsed=true;}
this.coordsText=[];if(prop.shadow){this.context.shadowColor=prop.shadowColor;this.context.shadowOffsetX=prop.shadowOffsetx;this.context.shadowOffsetY=prop.shadowOffsety;this.context.shadowBlur=prop.shadowBlur;}
this.context.strokeStyle=prop.colorsStroke;this.context.fillStyle=prop.colorsFill;this.drawPoly();this.context.lineWidth=prop.linewidth;RGraph.noShadow(this);RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{if(this.getShape(e)){return this;}};this.drawPoly=function()
{var coords=this.coords;this.path({path:'b m % %',args:[coords[0][0],coords[0][1]]});for(var i=1,len=coords.length;i<len;++i){this.context.lineTo(coords[i][0],coords[i][1]);}
this.path({path:'lw % c f % s %',args:[prop.linewidth,this.context.fillStyle,this.context.strokeStyle]});};this.getShape=function(e)
{var coords=this.coords,mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];var old_strokestyle=this.context.strokeStyle,old_fillstyle=this.context.fillStyle;this.context.beginPath();this.context.strokeStyle='rgba(0,0,0,0)';this.context.fillStyle='rgba(0,0,0,0)';this.drawPoly();this.context.strokeStyle=old_strokestyle;this.context.fillStyle=old_fillstyle;if(this.context.isPointInPath(mouseX,mouseY)){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,coords:this.coords,dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}
return null;};this.highlight=function(shape)
{this.context.fillStyle=prop.colorsFill;if(prop.tooltipsHighlight){if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.path('b');this.drawPoly();this.path('f % s %',prop.highlightFill,prop.highlightStroke);}}};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colorsFill=RGraph.arrayClone(prop.colorsFill);this.original_colors.colorsStroke=RGraph.arrayClone(prop.colorsStroke);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);}
var func=this.parseSingleColorForGradient;prop.colorsFill=func(prop.colorsFill);prop.colorsStroke=func(prop.colorsStroke);prop.highlightStroke=func(prop.highlightStroke);prop.highlightFill=func(prop.highlightFill);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color){return color;}
if(typeof color==='string'&&color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':'),grad=this.context.createLinearGradient(0,0,this.canvas.width,0),diff=1/(parts.length-1);grad.addColorStop(0,RGraph.trim(parts[0]));for(var j=1,len=parts.length;j<len;++j){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};