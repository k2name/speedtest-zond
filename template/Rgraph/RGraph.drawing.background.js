
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.Drawing=RGraph.Drawing||{};RGraph.Drawing.Background=function(conf)
{var id=conf.id,canvas=document.getElementById(id);this.id=id;this.canvas=document.getElementById(this.id);this.context=this.canvas.getContext('2d');this.canvas.__object__=this;this.original_colors=[];this.firstDraw=true;this.type='drawing.background';this.isRGraph=true;this.isrgraph=true;this.rgraph=true;this.uid=RGraph.createUID();this.canvas.uid=this.canvas.uid?this.canvas.uid:RGraph.createUID();this.properties={backgroundBarsCount:null,backgroundBarsColor1:'rgba(0,0,0,0)',backgroundBarsColor2:'rgba(0,0,0,0)',backgroundGrid:true,backgroundGridColor:'#ddd',backgroundGridLinewidth:1,backgroundGridVlines:true,backgroundGridHlines:true,backgroundGridBorder:true,backgroundGridAutofit:true,backgroundGridHlinesCount:5,backgroundGridVlinesCount:20,backgroundGridDashed:false,backgroundGridDotted:false,backgroundImage:null,backgroundImageStretch:true,backgroundImageX:null,backgroundImageY:null,backgroundImageW:null,backgroundImageH:null,backgroundImageAlign:null,backgroundColor:null,marginLeft:25,marginRight:25,marginTop:25,marginBottom:30,textColor:'black',textSize:12,textFont:'Arial, Verdana, sans-serif',textBold:false,textItalic:false,textAccessible:true,textAccessibleOverflow:'visible',textAccessiblePointerevents:false,tooltips:null,tooltipsHighlight:true,tooltipsEvent:'onclick',highlightStroke:'rgba(0,0,0,0)',highlightFill:'rgba(255,255,255,0.7)',linewidth:1,title:'',titleBackground:null,titleHpos:null,titleVpos:null,titleFont:null,titleSize:null,titleColor:null,titleBold:null,titleItalic:null,titleX:null,titleY:null,titleHalign:null,titleValign:null,xaxisTitle:'',xaxisTitleBold:null,xaxisTitleItalic:null,xaxisTitleSize:null,xaxisTitleFont:null,xaxisTitleColor:null,xaxisTitleX:null,xaxisTitleY:null,xaxisTitlePos:null,yaxisTitle:'',yaxisTitleBold:null,yaxisTitleSize:null,yaxisTitleFont:null,yaxisTitleColor:null,yaxisTitleItalic:null,yaxisTitleX:null,yaxisTitleY:null,yaxisTitlePos:null,clearto:'rgba(0,0,0,0)'}
if(!this.canvas){alert('[DRAWING.BACKGROUND] No canvas support');return;}
this.$0={};if(!this.canvas.__rgraph_aa_translated__){this.context.translate(0.5,0.5);this.canvas.__rgraph_aa_translated__=true;}
var prop=this.properties;this.path=RGraph.pathObjectFunction;if(RGraph.Effects&&typeof RGraph.Effects.decorate==='function'){RGraph.Effects.decorate(this);}
this.set=function(name)
{var value=typeof arguments[1]==='undefined'?null:arguments[1];if(arguments.length===1&&typeof arguments[0]==='object'){for(i in arguments[0]){if(typeof i==='string'){this.set(i,arguments[0][i]);}}
return this;}
prop[name]=value;return this;};this.get=function(name)
{return prop[name];};this.draw=function()
{RGraph.fireCustomEvent(this,'onbeforedraw');this.marginLeft=prop.marginLeft;this.marginRight=prop.marginRight;this.marginTop=prop.marginTop;this.marginBottom=prop.marginBottom;if(!this.colorsParsed){this.parseColors();this.colorsParsed=true;}
RGraph.drawBackgroundImage(this);RGraph.Background.draw(this);RGraph.installEventListeners(this);if(this.firstDraw){this.firstDraw=false;RGraph.fireCustomEvent(this,'onfirstdraw');this.firstDrawFunc();}
RGraph.fireCustomEvent(this,'ondraw');return this;};this.exec=function(func)
{func(this);return this;};this.getObjectByXY=function(e)
{if(this.getShape(e)){return this;}};this.getShape=function(e)
{var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1];if(mouseX>=this.marginLeft&&mouseX<=(this.canvas.width-this.marginRight)&&mouseY>=this.marginTop&&mouseY<=(this.canvas.height-this.marginBottom)){if(RGraph.parseTooltipText&&prop.tooltips){var tooltip=RGraph.parseTooltipText(prop.tooltips[0],0);}
return{object:this,dataset:0,index:0,sequentialIndex:0,tooltip:typeof tooltip==='string'?tooltip:null};}
return null;};this.highlight=function(shape)
{if(prop.tooltipsHighlight){if(typeof prop.highlightStyle==='function'){(prop.highlightStyle)(shape);}else{this.path({path:'b r % % % % f % s %',args:[prop.marginLeft,prop.marginTop,this.canvas.width-prop.marginLeft-prop.marginRight,this.canvas.height-prop.marginTop-prop.marginBottom,prop.highlightFill,prop.highlightStroke]});}}};this.parseColors=function()
{if(this.original_colors.length===0){this.original_colors.backgroundColor=RGraph.arrayClone(prop.backgroundColor);this.original_colors.backgroundGridColor=RGraph.arrayClone(prop.backgroundGridColor);this.original_colors.highlightStroke=RGraph.arrayClone(prop.highlightStroke);this.original_colors.highlightFill=RGraph.arrayClone(prop.highlightFill);}
prop.backgroundColor=this.parseSingleColorForGradient(prop.backgroundColor);prop.backgroundGridColor=this.parseSingleColorForGradient(prop.backgroundGridColor);prop.highlightStroke=this.parseSingleColorForGradient(prop.highlightStroke);prop.highlightFill=this.parseSingleColorForGradient(prop.highlightFill);};this.reset=function()
{};this.parseSingleColorForGradient=function(color)
{if(!color){return color;}
if(typeof color==='string'&&color.match(/^gradient\((.*)\)$/i)){if(color.match(/^gradient\(({.*})\)$/i)){return RGraph.parseJSONGradient({object:this,def:RegExp.$1});}
var parts=RegExp.$1.split(':'),grad=this.context.createLinearGradient(this.marginLeft,this.marginTop,this.canvas.width-this.marginRight,this.canvas.height-this.marginBottom),diff=1/(parts.length-1);for(var j=0;j<parts.length;j+=1){grad.addColorStop(j*diff,RGraph.trim(parts[j]));}}
return grad?grad:color;};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
if(typeof this[type]!=='function'){this[type]=func;}else{RGraph.addCustomEventListener(this,type,func);}
return this;};this.firstDrawFunc=function()
{};RGraph.register(this);RGraph.parseObjectStyleConfig(this,conf.options);};