
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Marker2=function(conf)
{var id=conf.id,canvas=document.getElementById(id),x=conf.x,y=conf.y,text=conf.text;this.id=id;this.canvas=document.getElementById(this.id);this.context=this.canvas.getContext('2d')
this.colorsParsed=false;this.canvas.__object__=this;this.original_colors=[];this.firstDraw=true;this.x=x;this.y=y;this.text=text;this.type='drawing.marker2';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={colorsStroke:'black',colorsFill:'white',textColor:'black',textSize:12,textFont:'Arial, Verdana, sans-serif',textBold:false,textItalic:false,textAccessible:true,textAccessibleOverflow:'visible',textAccessiblePointerevents:false,shadow:true,shadowColor:'gray',shadowOffsetx:3,shadowOffsety:3,shadowBlur:5,highlightStyle:null,highlightStroke:'rgba(0,0,0,0)',highlightFill:'#fcc',tooltips:null,tooltipsHighlight:true,tooltipsEvent:'onclick',voffset:20,clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.MARKER2] No canvas support');return;}
this.coords=[];this.coordsText=[];this.$0={};if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{this.context.lineWidth=1;RGraph.fireCustomEvent(this,'onbeforedraw');this.metrics=RGraph.measureText(this.text,prop.textBold,prop.textFont,prop.textSize);if(this.x+this.metrics[0]>=this.canvas.width){this.alignRight=true;}
if(!this.colorsParsed){this.parseColors();this.colorsParsed=true;}
var x=this.alignRight?this.x-this.metrics[0]-6:this.x,y=this.y-6-prop.voffset-this.metrics[1],width=this.metrics[0]+6,height=this.metrics[1];this.coords[0]=[x,y,width,height];this.coordsText=[];this.context.lineWidth=prop.linewidth;if(prop.shadow){RGraph.setShadow(this,prop.shadowColor,prop.shadowOffsetx,prop.shadowOffsety,prop.shadowBlur);}
this.context.strokeStyle=prop.colorsStroke;this.context.fillStyle=prop.colorsFill;this.context.strokeRect(x+(this.alignRight?width:0),y,0,height+prop.voffset-6);this.context.strokeRect(x,y,width,height);this.context.fillRect(x,y,width,height);RGraph.noShadow(this);this.context.fillStyle=prop.textColor;RGraph.text({object:this,font:prop.textFont,size:prop.textSize,color:prop.textColor,bold:prop.textBold,italic:prop.textItalic,x:Math.round(this.x)-(this.alignRight?this.metrics[0]+3:-3),y:y+(height/2),text:this.text,valign:'center',halign:'left',tag:'labels'});this.coords[0].push([x,y,width,height]);RGraph.noShadow(this);this.context.textBaseline='alphabetic';RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{if(this.getShape(e)){return this;}};this.getShape=function(e)
{var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];if(mouseX>=this.coords[0][0]&&mouseX<=(this.coords[0][0]+this.coords[0][2])){if(mouseY>=this.coords[0][1]&&mouseY<=(this.coords[0][1]+this.coords[0][3])){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,x:this.coords[0][0],y:this.coords[0][1],width:this.coords[0][2],height:this.coords[0][3],dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}}
return null;};this.highlight=function(shape)
{if(prop.tooltipsHighlight){if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.path({path:'b r % % % % f % s %',args:[this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3],prop.highlightFill,prop.highlightStroke]});this.path({path:'b r % % % % f % s %',args:[this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3],prop.highlightFill,prop.highlightStroke]});}}};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colorsFill=RGraph.arrayClone(prop.colorsFill);this.original_colors.colorsStroke=RGraph.arrayClone(prop.colorsStroke);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.textColor=RGraph.arrayClone(prop.textColor);}
prop.colorsFill=this.parseSingleColorForGradient(prop.colorsFill);prop.colorsStroke=this.parseSingleColorForGradient(prop.colorsStroke);prop.highlightStroke=this.parseSingleColorForGradient(prop.highlightStroke);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);prop.textColor=this.parseSingleColorForGradient(prop.textColor);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color){return color;}
if(typeof color==='string'&&color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':'),grad=this.context.createLinearGradient(this.x,this.y,this.x+this.metrics[0],this.y),diff=1/(parts.length-1);grad.addColorStop(0,RGraph.trim(parts[0]));for(var j=1;j<parts.length;++j){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};