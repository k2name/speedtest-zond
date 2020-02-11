
RGraph=window.RGraph||{isrgraph:true,isRGraph:true,rgraph:true};RGraph.SVG=RGraph.SVG||{};RGraph.SVG.AJAX=RGraph.SVG.AJAX||{};(function(win,doc,undefined)
{RGraph.SVG.AJAX=function(url,callback)
{if(window.XMLHttpRequest){var httpRequest=new XMLHttpRequest();}else if(window.ActiveXObject){var httpRequest=new ActiveXObject("Microsoft.XMLHTTP");}
httpRequest.onreadystatechange=function()
{if(this.readyState==4&&this.status==200){this.__user_callback__=callback;this.__user_callback__(this.responseText);}}
httpRequest.open('GET',url,true);httpRequest.send();};RGraph.SVG.AJAX.post=RGraph.SVG.AJAX.POST=function(url,data,callback)
{var crumbs=[];if(window.XMLHttpRequest){var httpRequest=new XMLHttpRequest();}else if(window.ActiveXObject){var httpRequest=new ActiveXObject("Microsoft.XMLHTTP");}
httpRequest.onreadystatechange=function()
{if(this.readyState==4&&this.status==200){this.__user_callback__=callback;this.__user_callback__(this.responseText);}}
httpRequest.open('POST',url,true);httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(i in data){if(typeof i=='string'){crumbs.push(i+'='+encodeURIComponent(data[i]));}}
httpRequest.send(crumbs.join('&'));};RGraph.SVG.AJAX.getNumber=function(url,callback)
{RGraph.SVG.AJAX(url,function()
{var num=parseFloat(this.responseText);callback(num);});};RGraph.SVG.AJAX.getString=function(url,callback)
{RGraph.SVG.AJAX(url,function()
{var str=String(this.responseText);callback(str);});};RGraph.SVG.AJAX.getJSON=function(url,callback)
{RGraph.SVG.AJAX(url,function()
{var json=eval('('+this.responseText+')');callback(json);});};RGraph.SVG.AJAX.getCSV=function(url,callback)
{var seperator=(typeof arguments[2]==='string'?arguments[2]:','),lineSep=(typeof arguments[3]==='string'?arguments[3]:"\r?\n");RGraph.SVG.AJAX(url,function()
{var text=this.responseText,regexp=new RegExp(seperator),lines=this.responseText.split(lineSep),rows=[];for(var i=0;i<lines.length;++i){var row=lines[i].split(seperator);for(var j=0,len=row.length;j<len;++j){if(row[j].match(/^[0-9.]+$/)){row[j]=parseFloat(row[j]);}}
rows.push(row);}
callback(rows);});};})(window,document);