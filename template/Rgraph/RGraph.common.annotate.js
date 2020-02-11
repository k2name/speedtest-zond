
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};(function(win,doc,undefined)
{var ua=navigator.userAgent;RGraph.annotating_canvas_onmousedown=function(e)
{if(e.button===0){e.target.__object__.set('mousedown',true);var obj=e.target.__object__,prop=obj.properties
obj.context.beginPath();obj.context.strokeStyle=obj.get('annotatableColor');obj.context.lineWidth=obj.get('annotatableLinewidth');var mouseXY=RGraph.getMouseXY(e),mouseX=mouseXY[0],mouseY=mouseXY[1]
if(obj.type==='bar'&&prop.variant==='3d'){var adjustment=prop.variantThreedAngle*mouseXY[0];mouseY-=adjustment;}
RGraph.Registry.set('annotatable.actions',[obj.get('annotatableColor')]);obj.context.moveTo(mouseX,mouseY);RGraph.Registry.set('annotatable.last.coordinates',[mouseX,mouseY]);RGraph.Registry.set('started.annotating',false);RGraph.Registry.set('annotating',obj);RGraph.fireCustomEvent(obj,'onannotatebegin');}
return false;};RGraph.annotating_window_onmouseup=function(e)
{var obj=RGraph.Registry.get('annotating');var win=window;if(e.button!=0||!obj){return;}
var tags=doc.getElementsByTagName('canvas');for(var i=0;i<tags.length;++i){if(tags[i].__object__){tags[i].__object__.set('mousedown',false);}}
if(RGraph.Registry.get('annotatable.actions')&&RGraph.Registry.get('annotatable.actions').length>0&&win.localStorage){var id='__rgraph_annotations_'+e.target.id+'__';var annotations=win.localStorage[id]?win.localStorage[id]+'|':'';annotations+=RGraph.Registry.get('annotatable.actions');win.localStorage[id]=annotations;}
RGraph.Registry.set('annotatable.actions',[]);RGraph.fireCustomEvent(obj,'onannotateend');};RGraph.annotating_canvas_onmousemove=function(e)
{var obj=e.target.__object__;var prop=obj.properties;var mouseXY=RGraph.getMouseXY(e);var mouseX=mouseXY[0];var mouseY=mouseXY[1];var lastXY=RGraph.Registry.get('annotatable.last.coordinates');if(obj.get('mousedown')){if(obj.type==='bar'&&prop.variant==='3d'){var adjustment=prop.variantThreedAngle*mouseXY[0];mouseY-=adjustment;}
obj.context.beginPath();if(!lastXY){obj.context.moveTo(mouseX,mouseY)}else{obj.context.strokeStyle=obj.properties.annotatableColor;obj.context.moveTo(lastXY[0],lastXY[1]);obj.context.lineTo(mouseX,mouseY);}
RGraph.Registry.set('annotatable.actions',RGraph.Registry.get('annotatable.actions')+'|'+mouseX+','+mouseY);RGraph.Registry.set('annotatable.last.coordinates',[mouseX,mouseY]);RGraph.fireCustomEvent(obj,'onannotate');obj.context.stroke();}};RGraph.showPalette=function(e)
{var isSafari=navigator.userAgent.indexOf('Safari')?true:false;var canvas=e.target.parentNode.__canvas__,context=canvas.getContext('2d'),obj=canvas.__object__,div=document.createElement('DIV'),coords=RGraph.getMouseXY(e)
div.__object__=obj;div.className='RGraph_palette';div.style.position='absolute';div.style.backgroundColor='white';div.style.border='1px solid black';div.style.left=0;div.style.top=0;div.style.padding='3px';div.style.paddingLeft='5px';div.style.opacity=0;div.style.boxShadow='rgba(96,96,96,0.5) 3px 3px 3px';div.style.WebkitBoxShadow='rgba(96,96,96,0.5) 3px 3px 3px';div.style.MozBoxShadow='rgba(96,96,96,0.5) 3px 3px 3px';var colors=['Black','Red','Yellow','Green','Orange','White','Magenta','Pink'];for(var i=0,len=colors.length;i<len;i+=1){var div2=doc.createElement('DIV');div2.cssClass='RGraph_palette_color';div2.style.fontSize='12pt';div2.style.cursor='pointer';div2.style.padding='1px';div2.style.paddingRight='10px';div2.style.textAlign='left';var span=document.createElement('SPAN');span.style.display='inline-block';span.style.marginRight='9px';span.style.width='17px';span.style.height='17px';span.style.top='2px';span.style.position='relative';span.style.backgroundColor=colors[i];div2.appendChild(span);div2.innerHTML+=colors[i];div2.onmouseover=function()
{this.style.backgroundColor='#eee';}
div2.onmouseout=function()
{this.style.backgroundColor='';}
div2.onclick=function(e)
{var color=this.childNodes[0].style.backgroundColor;obj.set('annotatableColor',color);}
div.appendChild(div2);}
doc.body.appendChild(div);div.style.left=e.pageX+'px';div.style.top=e.pageY+'px';if((e.pageX+(div.offsetWidth+5))>document.body.offsetWidth){div.style.left=(e.pageX-div.offsetWidth)+'px';}
RGraph.Registry.set('palette',div);setTimeout(function(){div.style.opacity=0.2;},50);setTimeout(function(){div.style.opacity=0.4;},100);setTimeout(function(){div.style.opacity=0.6;},150);setTimeout(function(){div.style.opacity=0.8;},200);setTimeout(function(){div.style.opacity=1;},250);RGraph.hideContext();window.onclick=function()
{RGraph.hidePalette();}
e.stopPropagation();return false;};RGraph.clearAnnotations=function(canvas)
{if(typeof canvas==='string'){var id=canvas;canvas=doc.getElementById(id);}else{var id=canvas.id}
var obj=canvas.__object__;if(win.localStorage&&win.localStorage['__rgraph_annotations_'+id+'__']&&win.localStorage['__rgraph_annotations_'+id+'__'].length){win.localStorage['__rgraph_annotations_'+id+'__']=[];RGraph.fireCustomEvent(obj,'onannotateclear');}};RGraph.replayAnnotations=function(obj)
{if(!win.localStorage){return;}
var context=obj.context;var annotations=win.localStorage['__rgraph_annotations_'+obj.id+'__'];var i,len,move,coords;context.beginPath();context.lineWidth=obj.get('annotatable.linewidth');if(annotations&&annotations.length){annotations=annotations.split('|');}else{return;}
for(i=0,len=annotations.length;i<len;++i){if(annotations[i].match(/[a-z]+/)){context.stroke();context.beginPath();context.strokeStyle=annotations[i];move=true;continue;}
coords=annotations[i].split(',');coords[0]=Number(coords[0]);coords[1]=Number(coords[1]);if(move){context.moveTo(coords[0],coords[1]);move=false;}else{context.lineTo(coords[0],coords[1]);}}
context.stroke();};window.addEventListener('load',function(e)
{setTimeout(function()
{var tags=doc.getElementsByTagName('canvas');for(var i=0;i<tags.length;++i){if(tags[i].__object__&&tags[i].__object__.isRGraph&&tags[i].__object__.get('annotatable')){RGraph.replayAnnotations(tags[i].__object__);}}},100);},false);})(window,document);