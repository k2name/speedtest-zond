
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.HProgress=function(conf)
{var id=conf.id,canvas=document.getElementById(id),min=conf.min,max=conf.max,value=conf.value;this.id=id;this.canvas=canvas;this.context=this.canvas.getContext('2d');this.canvas.__object__=this;this.min=RGraph.stringsToNumbers(min);this.max=RGraph.stringsToNumbers(max);this.value=RGraph.stringsToNumbers(value);this.type='hprogress';this.coords=[];this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.currentValue=null;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.colorsParsed=false;this.coordsText=[];this.original_colors=[];this.firstDraw=true;this.properties={colors:['Gradient(white:#0c0)','Gradient(white:red)','Gradient(white:green)','yellow','pink','cyan','black','white','gray'],colorsStrokeInner:'#999',colorsStrokeOuter:'#999',tickmarksColor:'#999',tickmarksInnerCount:0,tickmarksOuterCount:0,backgroundColor:'Gradient(#ccc:#eee:#efefef)',marginLeft:25,marginRight:25,marginTop:25,marginBottom:25,shadow:false,shadowColor:'rgba(0,0,0,0.5)',shadowBlur:3,shadowOffsetx:3,shadowOffsety:3,title:'',titleBackground:null,titleBold:null,titleFont:null,titleSize:null,titleColor:null,titleItalic:null,titleX:null,titleY:null,titleHalign:null,titleValign:null,textSize:12,textColor:'black',textFont:'Arial, Verdana, sans-serif',textBold:false,textItalic:false,textAccessible:true,textAccessibleOverflow:'visible',textAccessiblePointerevents:false,contextmenu:null,scaleUnitsPre:'',scaleUnitsPost:'',scaleDecimals:0,scalePoint:'.',scaleThousand:',',adjustable:false,tooltips:null,tooltipsEffect:'fade',tooltipsCssClass:'RGraph_tooltip',tooltipsHighlight:true,tooltipsEvent:'onclick',highlightStroke:'rgba(0,0,0,0)',highlightFill:'rgba(255,255,255,0.7)',annotatable:false,annotateColor:'black',arrows:false,marginInner:0,resizable:false,resizableHandleAdjust:[0,0],resizableHandleBackground:null,labelsPosition:'bottom',labelsSpecific:null,labelsCount:10,labelsOffsetx:0,labelsOffsety:0,labelsFont:null,labelsSize:null,labelsColor:null,labelsBold:null,labelsItalic:null,labelsInner:false,labelsInnerFont:null,labelsInnerSize:null,labelsInnerColor:null,labelsInnerBold:null,labelsInnerItalic:null,labelsInnerDecimals:0,labelsInnerBackgroundFill:'rgba(255,255,255,0.7)',labelsInnerBorder:true,labelsInnerBorderLinewidth:1,labelsInnerBorderColor:'#ccc',labelsInnerScalePoint:null,labelsInnerScaleThousand:null,labelsInnerUnitsPre:'',labelsInnerUnitsPost:'',labelsInnerSpecific:null,key:null,keyBackground:'white',keyPosition:'margin',keyHalign:'right',keyShadow:false,keyShadowColor:'#666',keyShadowBlur:3,keyShadowOffsetx:2,keyShadowOffsety:2,keyPositionMarginBoxed:false,keyPositionX:null,keyPositionY:null,keyColorShape:'square',keyRounded:true,keyLinewidth:1,keyColors:null,keyColorShape:'square',keyInteractive:false,keyInteractiveHighlightChartStroke:'black',keyInteractiveHighlightChartFill:'rgba(255,255,255,0.7)',keyInteractiveHighlightLabel:'rgba(255,0,0,0.2)',keyLabelsColor:null,keyLabelsFont:null,keyLabelsSize:null,keyLabelsBold:null,keyLabelsItalic:null,keyLabelsOffsetx:0,keyLabelsOffsety:0,borderInner:true,clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[HPROGRESS] No canvas support');return;}
var linear_data=RGraph.arrayLinearize(value);for(var i=0;i<linear_data.length;++i){this['$'+i]={};}
if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.responsive=RGraph.responsive;this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{RGraph.fireCustomEvent(this,'onbeforedraw');if(!this.colorsParsed){this.parseColors();this.colorsParsed=true;}
this.currentValue=this.value;this.marginLeft=prop.marginLeft;this.marginRight=prop.marginRight;this.marginTop=prop.marginTop;this.marginBottom=prop.marginBottom;this.width=this.canvas.width-this.marginLeft-this.marginRight;this.height=this.canvas.height-this.marginTop-this.marginBottom;this.coords=[];this.coordsText=[];this.drawbar();this.drawTickMarks();this.drawLabels();this.drawTitle();if(prop.bevelled){this.drawBevel();}
if(prop.contextmenu){RGraph.showContext(this);}
if(prop.key&&prop.key.length){RGraph.drawKey(this,prop.key,prop.colors);}
if(prop.resizable){RGraph.allowResizing(this);}
RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.drawbar=function()
{this.scale2=RGraph.getScale({object:this,options:{'scale.max':this.max,'scale.min':this.min,'scale.strict':true,'scale.thousand':prop.scaleThousand,'scale.point':prop.scalePoint,'scale.decimals':prop.scaleDecimals,'scale.labels.count':prop.labelsCount,'scale.round':prop.scaleRound,'scale.units.pre':prop.scaleUnitsPre,'scale.units.post':prop.scaleUnitsPost}});if(prop.shadow){RGraph.setShadow({object:this,prefix:'shadow'});}
this.context.fillStyle=prop.backgroundColor;this.context.strokeStyle=prop.colorsStrokeOuter;this.context.strokeRect(this.marginLeft,this.marginTop,this.width,this.height);this.context.fillRect(this.marginLeft,this.marginTop,this.width,this.height);RGraph.noShadow(this);this.context.fillStyle=prop.colors[0];this.context.strokeStyle=prop.colorsStrokeOuter;var margin=prop.marginInner;var barWidth=Math.min(this.width,((RGraph.arraySum(this.value)-this.min)/(this.max-this.min))*this.width);if(prop.tickmarksInnerCount>0){var spacing=(this.canvas.width-this.marginLeft-this.marginRight)/prop.tickmarksInnerCount;this.context.lineWidth=1;this.context.strokeStyle=prop.colorsStrokeOuter;this.context.beginPath();for(var x=this.marginLeft;x<this.canvas.width-this.marginRight;x+=spacing){this.context.moveTo(Math.round(x),this.marginTop);this.context.lineTo(Math.round(x),this.marginTop+2);this.context.moveTo(Math.round(x),this.canvas.height-this.marginBottom);this.context.lineTo(Math.round(x),this.canvas.height-this.marginBottom-2);}
this.context.stroke();}
if(typeof this.value==='number'){if(prop.borderInner){this.drawCurvedBar({x:this.marginLeft,y:this.marginTop+margin,width:barWidth,height:this.height-margin-margin,stroke:prop.colorsStrokeInner});}
this.drawCurvedBar({x:this.marginLeft,y:this.marginTop+margin,width:barWidth,height:this.height-margin-margin,fill:prop.colors[0]});this.coords.push([this.marginLeft,this.marginTop+margin,barWidth,this.height-margin-margin]);}else if(typeof this.value==='object'){this.context.beginPath();var startPoint=this.marginLeft;for(var i=0,len=this.value.length;i<len;++i){var segmentLength=(this.value[i]/RGraph.arraySum(this.value))*barWidth;if(prop.borderInner){this.drawCurvedBar({x:startPoint,y:this.marginTop+margin,width:segmentLength,height:this.height-margin-margin,fill:prop.colors[i],stroke:prop.colorsStrokeInner});}
this.drawCurvedBar({x:startPoint,y:this.marginTop+margin,width:segmentLength,height:this.height-margin-margin,fill:prop.colors[i]});this.coords.push([startPoint,this.marginTop+margin,segmentLength,this.height-margin-margin]);startPoint+=segmentLength;}}
if(prop.arrows){var x=this.marginLeft+barWidth;var y=this.marginTop;this.context.lineWidth=1;this.context.fillStyle='black';this.context.strokeStyle='black';this.context.beginPath();this.context.moveTo(x,y-3);this.context.lineTo(x+2,y-7);this.context.lineTo(x-2,y-7);this.context.closePath();this.context.stroke();this.context.fill();this.context.beginPath();this.context.moveTo(x,y+this.height+4);this.context.lineTo(x+2,y+this.height+9);this.context.lineTo(x-2,y+this.height+9);this.context.closePath();this.context.stroke();this.context.fill()}
if(prop.labelsInner){if(typeof prop.labelsInnerSpecific==='string'){var text=String(prop.labelsInnerSpecific);}else{var value=typeof this.value==='number'?this.value:RGraph.arraySum(this.value);var value=value.toFixed(typeof prop.labelsInnerDecimals==='number'?prop.labelsInnerDecimals:prop.scaleDecimals);var text=RGraph.numberFormat({object:this,number:value,unitspre:typeof prop.labelsInnerUnitsPre==='string'?prop.labelsInnerUnitsPre:prop.scaleUnitsPre,unitspost:typeof prop.labelsInnerUnitsPost==='string'?prop.labelsInnerUnitsPost:prop.scaleUnitsPost,point:typeof prop.labelsInnerPoint==='string'?prop.labelsInnerPoint:prop.scalePoint,thousand:typeof prop.labelsInnerThousand==='string'?prop.labelsInnerThousand:prop.scaleThousand});}
var textConf=RGraph.getTextConf({object:this,prefix:'labelsInner'});RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:this.marginLeft+barWidth+5,y:this.marginTop+(this.height/2),text:text,valign:'center',halign:'left',bounding:typeof prop.labelsInnerBackgroundFill==='string'?true:false,boundingFill:prop.labelsInnerBackgroundFill,boundingStroke:prop.labelsInnerBorder?prop.labelsInnerBorderColor:'rgba(0,0,0,0)',boundingLinewidth:prop.labelsInnerBorderLinewidth,tag:'label.inner'});}
this.path({path:'b'});};this.drawTickMarks=function()
{this.context.strokeStyle=prop.tickmarksColor;if(prop.tickmarksOuterCount>0){this.context.beginPath();this.tickInterval=this.width/prop.tickmarksOuterCount;var start=0;if(prop.labelsPosition==='top'){for(var i=this.marginLeft+start;i<=(this.width+this.marginLeft+0.1);i+=this.tickInterval){this.context.moveTo(Math.round(i),this.marginTop);this.context.lineTo(Math.round(i),this.marginTop-4);}}else{for(var i=this.marginLeft+start;i<=(this.width+this.marginLeft+0.1);i+=this.tickInterval){this.context.moveTo(Math.round(i),this.marginTop+this.height);this.context.lineTo(Math.round(i),this.marginTop+this.height+4);}}
this.context.stroke();}};this.drawLabels=function()
{if(!RGraph.isNull(prop.labelsSpecific)){return this.drawSpecificLabels();}
this.context.fillStyle=prop.textColor;var xPoints=[],yPoints=[],bold=prop.textBold,italic=prop.textItalic,color=prop.textColor,font=prop.textFont,size=prop.textSize,offsetx=prop.labelsOffsetx,offsety=prop.labelsOffsety;for(i=0,len=this.scale2.labels.length;i<len;i++){if(prop.labelsPosition=='top'){var x=this.width*(i/this.scale2.labels.length)+this.marginLeft+(this.width/this.scale2.labels.length);var y=this.marginTop-6;var valign='bottom';}else{var x=this.width*(i/this.scale2.labels.length)+this.marginLeft+(this.width/this.scale2.labels.length);var y=this.height+this.marginTop+4;var valign='top';}
var textConf=RGraph.getTextConf({object:this,prefix:'labels'});RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:x+offsetx,y:y+offsety,text:this.scale2.labels[i],valign:valign,halign:'center',tag:'scale'});}
var text=RGraph.numberFormat({object:this,number:Number(this.min).toFixed(prop.scaleDecimals),unitspre:prop.scaleUnitsPre,unitspost:prop.scaleUnitsPost});if(prop.labelsPosition=='top'){RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:this.marginLeft+offsetx,y:this.marginTop-6+offsety,text:text,valign:'bottom',halign:'center',tag:'scale'});}else{RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:this.marginLeft+offsetx,y:this.canvas.height-this.marginBottom+5+offsety,text:text,valign:'top',halign:'center',tag:'scale'});}};this.getShape=function(e)
{var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];for(var i=0,len=this.coords.length;i<len;i++){var x=this.coords[i][0],y=this.coords[i][1],w=this.coords[i][2],h=this.coords[i][3],idx=i;this.context.beginPath();this.drawCurvedBar({x:x,y:y,height:h,width:w});if(this.context.isPointInPath(mouseX,mouseY)){if(RGraph.parseTooltipText){var tooltip=RGraph.parseTooltipText(prop.tooltips,idx);}
return{object:this,x:x,y:y,width:w,height:h,dataset:0,index:idx,sequentialIndex:idx,tooltip:typeof tooltip==='string'?tooltip:null}}}};this.getValue=function(e)
{var mouseXY=RGraph.getMouseXY(e);var value=(mouseXY[0]-this.marginLeft)/this.width;value*=this.max-this.min;value+=this.min;if(mouseXY[0]<this.marginLeft){value=this.min;}
if(mouseXY[0]>(this.canvas.width-this.marginRight)){value=this.max}
return value;};this.highlight=function(shape)
{var last=shape.index===this.coords.length-1;if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.drawCurvedBar({x:shape.x,y:shape.y,width:shape.width,height:shape.height,stroke:prop.highlightStroke,fill:prop.highlightFill});}};this.getObjectByXY=function(e)
{var mouseXY=RGraph.getMouseXY(e);if(mouseXY[0]>this.marginLeft&&mouseXY[0]<(this.canvas.width-this.marginRight)&&mouseXY[1]>this.marginTop&&mouseXY[1]<(this.canvas.height-this.marginBottom)){return this;}};this.adjusting_mousemove=function(e)
{if(prop.adjustable&&RGraph.Registry.get('adjusting')&&RGraph.Registry.get('adjusting').uid==this.uid){var mouseXY=RGraph.getMouseXY(e);var value=this.getValue(e);if(typeof(value)=='number'){this.value=Number(value.toFixed(prop.scaleDecimals));RGraph.redrawCanvas(this.canvas);RGraph.fireCustomEvent(this,'onadjust');}}};this.drawSpecificLabels=function()
{var labels=prop.labelsSpecific;if(labels){var valign=(prop.labelsPosition=='top'?'bottom':'top'),step=this.width/(labels.length-1),offsetx=prop.labelsOffsetx,offsety=prop.labelsOffsety
var textConf=RGraph.getTextConf({object:this,prefix:'labels'});this.context.beginPath();this.context.fillStyle=prop.textColor;for(var i=0;i<labels.length;++i){RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:this.marginLeft+(step*i)+offsetx,y:prop.labelsPosition=='top'?this.marginTop-7+offsety:this.canvas.height-this.marginBottom+7+offsety,text:labels[i],valign:valign,halign:'center',tag:'labels.specific'});}
this.context.fill();}};this.getXCoord=function(value)
{var min=this.min;if(value<min||value>this.max){return null;}
var barWidth=this.canvas.width-this.marginLeft-this.marginRight;var coord=((value-min)/(this.max-min))*barWidth;coord=this.marginLeft+coord;return coord;};this.overChartArea=function(e)
{var mouseXY=RGraph.getMouseXY(e);var mouseX=mouseXY[0];var mouseY=mouseXY[1];if(mouseX>=this.marginLeft&&mouseX<=(this.canvas.width-this.marginRight)&&mouseY>=this.marginTop&&mouseY<=(this.canvas.height-this.marginBottom)){return true;}
return false;};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.colors=RGraph.arrayClone(prop.colors);this.original_colors.tickmarksColor=RGraph.arrayClone(prop.tickmarksColor);this.original_colors.colorsStrokeInner=RGraph.arrayClone(prop.colorsStrokeInner);this.original_colors.colorsStrokeOuter=RGraph.arrayClone(prop.colorsStrokeOuter);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.highlightColor=RGraph.arrayClone(prop.highlightColor);}
var colors=prop.colors;for(var i=0;i<colors.length;++i){colors[i]=this.parseSingleColorForGradient(colors[i]);}
prop.tickmarksColor=this.parseSingleColorForGradient(prop.tickmarksColor);prop.colorsStrokeInner=this.parseSingleColorForGradient(prop.colorsStrokeInner);prop.colorsStrokeOuter=this.parseSingleColorForGradient(prop.colorsStrokeOuter);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);prop.highlightStroke=this.parseSingleColorForGradient(prop.highlightStroke);prop.backgroundColor=this.parseSingleColorForGradient(prop.backgroundColor);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color||typeof(color)!='string'){return color;}
if(color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':');var grad=this.context.createLinearGradient(prop.marginLeft,0,this.canvas.width-prop.marginRight,0);var diff=1/(parts.length-1);grad.addColorStop(0,RGraph.trim(parts[0]));for(var j=1;j<parts.length;++j){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.drawBevel=function()
{for(var i=0,len=0;i<this.coords.length;++i)len+=this.coords[i][2];this.context.save();this.context.beginPath();this.context.rect(this.coords[0][0],this.coords[0][1],len,this.coords[0][3]);this.context.clip();this.context.save();this.context.beginPath();this.drawCurvedBar({x:this.coords[0][0],y:this.coords[0][1],width:len,height:this.coords[0][3]});this.context.clip();this.context.beginPath();this.context.shadowColor='black';this.context.shadowOffsetX=0;this.context.shadowOffsetY=0;this.context.shadowBlur=15;this.context.lineWidth=2;this.drawCurvedBar({x:this.coords[0][0]-51,y:this.coords[0][1]-1,width:len+52,height:this.coords[0][3]+2});this.context.stroke();this.context.restore();this.context.restore();};this.drawTitle=function()
{if(prop.title.length){var x=((this.canvas.width-this.marginLeft-this.marginRight)/2)+this.marginLeft;var text=prop.title;var textConf=RGraph.getTextConf({object:this,prefix:'title'});if(prop.labelsPosition=='top'){y=this.canvas.height-this.marginBottom+5;x=((this.canvas.width-this.marginLeft-this.marginRight)/2)+this.marginLeft;valign='top';}else{x=((this.canvas.width-this.marginLeft-this.marginRight)/2)+this.marginLeft;y=this.marginTop-5;valign='bottom';}
RGraph.text({object:this,font:textConf.font,size:textConf.size,color:textConf.color,bold:textConf.bold,italic:textConf.italic,x:typeof prop.titleX==='number'?prop.titleX:x,y:typeof prop.titleY==='number'?prop.titleY:y,text:text,valign:prop.titleValign?prop.titleValign:valign,halign:prop.titleHalign?prop.titleHalign:'center',bounding:prop.titleBackground?true:false,boundingFill:prop.titleBackground,tag:'title'});}};this.interactiveKeyHighlight=function(index)
{var coords=this.coords[index];this.context.beginPath();this.context.strokeStyle=prop.keyInteractiveHighlightChartStroke;this.context.lineWidth=2;this.context.fillStyle=prop.keyInteractiveHighlightChartFill;this.context.rect(coords[0],coords[1],coords[2],coords[3]);this.context.fill();this.context.stroke();this.context.lineWidth=1;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.drawCurvedBar=function(opt)
{this.path({path:'b r % % % %',args:[opt.x,opt.y,opt.width,opt.height]});if(opt.stroke){this.context.strokeStyle=opt.stroke;this.context.stroke();}
if(opt.fill){this.context.fillStyle=opt.fill;this.context.fill();}}
this.firstDrawFunc=function()
{};this.grow=function()
{var obj=this;var canvas=obj.canvas;var context=obj.context;var initial_value=obj.currentValue;var opt=arguments[0]||{};var numFrames=opt.frames||30;var frame=0
var callback=arguments[1]||function(){};if(typeof obj.value==='object'){if(RGraph.isNull(obj.currentValue)){obj.currentValue=[];for(var i=0,len=obj.value.length;i<len;++i){obj.currentValue[i]=0;}}
var diff=[];var increment=[];for(var i=0,len=obj.value.length;i<len;++i){diff[i]=obj.value[i]-Number(obj.currentValue[i]);increment[i]=diff[i]/numFrames;}
if(initial_value==null){initial_value=[];for(var i=0,len=obj.value.length;i<len;++i){initial_value[i]=0;}}}else{var diff=obj.value-Number(obj.currentValue);var increment=diff/numFrames;}
function iterator()
{frame++;if(frame<=numFrames){if(typeof obj.value=='object'){obj.value=[];for(var i=0,len=initial_value.length;i<len;++i){obj.value[i]=initial_value[i]+(increment[i]*frame);}}else{obj.value=initial_value+(increment*frame);}
RGraph.clear(obj.canvas);RGraph.redrawCanvas(obj.canvas);RGraph.Effects.updateCanvas(iterator);}else{callback();}}
iterator();return this;};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};