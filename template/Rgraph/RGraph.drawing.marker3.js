
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Marker3=function(conf)
{var id=conf.id,canvas=document.getElementById(id),x=conf.x,y=conf.y,radius=conf.radius;this.id=id;this.canvas=document.getElementById(this.id);this.context=this.canvas.getContext('2d')
this.colorsParsed=false;this.canvas.__object__=this;this.original_colors=[];this.firstDraw=true;this.actualRadius=0;this.alpha=1;this.centerx=x;this.centery=y;this.radius=radius;this.type='drawing.marker3';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={colorsFill:'white',delay:50,highlightFill:'rgba(255,0,0,1.0)',tooltips:null,tooltipsHighlight:true,tooltipsEvent:'onclick',textAccessible:true,textAccessibleOverflow:'visible',textAccessiblePointerevents:false,clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.MARKER3] No canvas support');return;}
this.coords=[];this.coordsText=[];this.$0={};if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{this.context.globalAlpha=this.alpha;this.path({path:'b a % % % % % % a % % % % % % f %',args:[this.centerx,this.centery,this.actualRadius,0,2*Math.PI,false,this.centerx,this.centery,Math.max(this.actualRadius-8,0),2*Math.PI,0,true,prop.colorsFill]});this.alpha=this.actualRadius?1-((this.actualRadius*0.75)/this.radius):1;this.context.globalAlpha=1;if(this.actualRadius<this.radius){this.actualRadius+=2;}else if(this.actualRadius>=this.radius){this.actualRadius=0;this.alpha=1;}
if(!this.TIMER){var obj=this;setInterval(function()
{RGraph.redrawCanvas(obj.canvas);},prop.delay);this.TIMER=true;}
RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{if(this.getShape(e)){return this;}};this.getShape=function(e)
{var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];if(RGraph.getHypLength(this.centerx,this.centery,mouseXY[0],mouseXY[1])<=this.radius){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,x:this.centerx,y:this.centery,radius:this.radius,dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}
return null;};this.highlight=function(shape)
{if(prop.tooltipsHighlight){if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.path({path:'b r % % % % f % s %',args:[this.coords[0][0],this.coords[0][1],this.coords[0][2],this.coords[0][3],prop.highlightFill,prop.highlightStroke]});}}};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colorsFill=RGraph.arrayClone(prop.colorsFill);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);}
prop.colorsFill=this.parseSingleColorForGradient(prop.colorsFill);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color){return color;}
if(typeof color==='string'&&color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':'),grad=this.context.createRadialGradient(this.centerx,this.centery,0,this.centerx,this.centery,this.radius),diff=1/(parts.length-1);for(var j=0;j<parts.length;j+=1){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};