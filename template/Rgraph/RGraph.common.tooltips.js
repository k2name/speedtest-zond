
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};(function(win,doc,undefined)
{var ua=navigator.userAgent;RGraph.tooltips={};RGraph.tooltips.style={display:'inline-block',position:'absolute',padding:'6px',fontFamily:'Arial',fontSize:'10pt',fontWeight:'normal',textAlign:'center',left:0,top:0,backgroundColor:'rgb(255,255,239)',color:'black',visibility:'visible',zIndex:3,borderRadius:'5px',boxShadow:'rgba(96,96,96,0.5) 0 0 5px',opacity:0,lineHeight:'initial'};RGraph.tooltip=function()
{var args=RGraph.getArgs(arguments,'object,text,x,y,index,event');if(RGraph.trim(args.text).length===0){return;}
RGraph.fireCustomEvent(args.object,'onbeforetooltip');if(typeof(args.object.get('tooltipsOverride'))=='function'){return args.object.get('tooltipsOverride')(args.object,args.text,args.x,args.y,args.index);}
var originalX=args.x;var originalY=args.y;args.text=RGraph.getTooltipTextFromDIV(args.text);var timers=RGraph.Registry.get('tooltip.timers');if(timers&&timers.length){for(i=0;i<timers.length;++i){clearTimeout(timers[i]);}}
RGraph.Registry.set('tooltip.timers',[]);if(args.object.get('contextmenu')){RGraph.hideContext();}
if(typeof args.object.get('tooltipsCssClass')!=='string'){args.object.set('tooltipsCssClass','RGraph_tooltip');}
var tooltipObj=document.createElement('DIV');tooltipObj.className=args.object.get('tooltipsCssClass');for(var i in RGraph.tooltips.style){if(typeof i==='string'){tooltipObj.style[i]=RGraph.tooltips.style[i];}}
tooltipObj.innerHTML=args.text;tooltipObj.__text__=args.text;tooltipObj.__canvas__=args.object.canvas;tooltipObj.id='__rgraph_tooltip_'+args.object.canvas.id+'_'+args.object.uid+'_'+args.index;tooltipObj.__event__=args.object.get('tooltipsEvent')||'click';tooltipObj.__object__=args.object;if(typeof args.index==='number'){tooltipObj.__index__=args.index;origIdx=args.index;}
if(args.object.type==='line'||args.object.type==='radar'){for(var ds=0;ds<args.object.data.length;++ds){if(args.index>=args.object.data[ds].length){args.index-=args.object.data[ds].length;}else{break;}}
tooltipObj.__dataset__=ds;tooltipObj.__index2__=args.index;}
document.body.appendChild(tooltipObj);var width=tooltipObj.offsetWidth;var height=tooltipObj.offsetHeight;tooltipObj.style.width=width+'px';var mouseXY=RGraph.getMouseXY(args.event);var canvasXY=RGraph.getCanvasXY(args.object.canvas);tooltipObj.style.left=args.event.pageX-(parseFloat(tooltipObj.style.paddingLeft)+(width/2))+'px';tooltipObj.style.top=args.event.pageY-height-10+'px';if(parseFloat(tooltipObj.style.left)<=5){tooltipObj.style.left='5px';}
if(parseFloat(tooltipObj.style.left)+parseFloat(tooltipObj.style.width)>window.innerWidth){tooltipObj.style.left=''
tooltipObj.style.right='5px'}
if(RGraph.isFixed(args.object.canvas)){var scrollTop=window.scrollY||document.documentElement.scrollTop;tooltipObj.style.position='fixed';tooltipObj.style.top=args.event.pageY-scrollTop-height-10+'px';}
if(args.object.get('tooltipsEffect')==='fade'){for(var i=1;i<=10;++i){(function(index)
{setTimeout(function()
{tooltipObj.style.opacity=index/10;},index*25);})(i);}}else{tooltipObj.style.opacity=1;}
tooltipObj.onmousedown=function(e){e.stopPropagation();}
tooltipObj.onmouseup=function(e){e.stopPropagation();}
tooltipObj.onclick=function(e){if(e.button==0){e.stopPropagation();}}
RGraph.Registry.set('tooltip',tooltipObj);RGraph.fireCustomEvent(args.object,'ontooltip');};RGraph.getTooltipTextFromDIV=function()
{var args=RGraph.getArgs(arguments,'text');var result=/^id:(.*)/.exec(args.text);if(result&&result[1]&&document.getElementById(result[1])){args.text=document.getElementById(result[1]).innerHTML;}else if(result&&result[1]){args.text='';}
return args.text;};RGraph.getTooltipWidth=function()
{var args=RGraph.getArgs(arguments,'text,object');var div=document.createElement('DIV');div.className=args.object.get('tooltipsCssClass');div.style.paddingLeft=RGraph.tooltips.padding;div.style.paddingRight=RGraph.tooltips.padding;div.style.fontFamily=RGraph.tooltips.font_face;div.style.fontSize=RGraph.tooltips.font_size;div.style.visibility='hidden';div.style.position='absolute';div.style.top='300px';div.style.left=0;div.style.display='inline';div.innerHTML=RGraph.getTooltipTextFromDIV(args.text);document.body.appendChild(div);return div.offsetWidth;};RGraph.hideTooltip=function()
{var tooltip=RGraph.Registry.get('tooltip');var uid=arguments[0]&&arguments[0].uid?arguments[0].uid:null;if(tooltip&&tooltip.parentNode&&(!uid||uid==tooltip.__canvas__.uid)){tooltip.parentNode.removeChild(tooltip);tooltip.style.display='none';tooltip.style.visibility='hidden';RGraph.Registry.set('tooltip',null);}};RGraph.preLoadTooltipImages=function()
{var args=RGraph.getArgs(arguments,'object');var tooltips=args.object.get('tooltips');if(RGraph.hasTooltips(args.object)){if(args.object.type=='rscatter'){tooltips=[];for(var i=0;i<args.object.data.length;++i){tooltips.push(args.object.data[3]);}}
for(var i=0;i<tooltips.length;++i){var div=document.createElement('div');div.style.position='absolute';div.style.opacity=0;div.style.top='-100px';div.style.left='-100px';div.innerHTML=tooltips[i];document.body.appendChild(div);var img_tags=div.getElementsByTagName('IMG');for(var j=0;j<img_tags.length;++j){if(img_tags&&img_tags[i]){var img=document.createElement('img');img.style.position='absolute';img.style.opacity=0;img.style.top='-100px';img.style.left='-100px';img.src=img_tags[i].src
document.body.appendChild(img);setTimeout(function(){document.body.removeChild(img);},250);}}
document.body.removeChild(div);}}};RGraph.tooltips_mousemove=function()
{var args=RGraph.getArgs(arguments,'object,event'),shape=args.object.getShape(args.event),changeCursor_tooltips=false
if(shape&&typeof shape.index==='number'&&args.object.get('tooltips')[shape.index]){var text=RGraph.parseTooltipText(args.object.get('tooltips'),shape.index);if(text){changeCursor_tooltips=true;if(args.object.get('tooltipsEvent')==='onmousemove'){if(!RGraph.Registry.get('tooltip')||RGraph.Registry.get('tooltip').__object__.uid!=args.object.uid||RGraph.Registry.get('tooltip').__index__!=shape.index){RGraph.hideTooltip();RGraph.clear(args.object.canvas);RGraph.redraw();RGraph.tooltip(args.object,text,args.event.pageX,args.event.pageY,shape.index);args.object.highlight(shape);}}}}else if(shape&&typeof shape.index==='number'){var text=RGraph.parseTooltipText(args.object.get('tooltips'),shape.index);if(text){changeCursor_tooltips=true}}
return changeCursor_tooltips;};})(window,document);