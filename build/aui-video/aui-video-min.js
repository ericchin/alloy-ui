AUI.add("aui-video",function(D){var J=D.Lang,K=D.UA,E=D.ClassNameManager.getClassName,N="video",C=E(N),L=E(N,"node"),H=D.config.base+"aui-video/assets/player.swf",G='<source type="video/mp4;" />',I="<source type='video/ogg; codecs=\"theora, vorbis\"' />",B='<video id="{0}" width="100%" height="100%" controls="controls" class="'+L+'"></video>',F='<div class="'+L+'"></div>';var M=D.Component.create({NAME:N,ATTRS:{url:{value:""},ogvUrl:{value:""},swfUrl:{value:H},poster:{value:""},fixedAttributes:{value:{}},flashVars:{value:{}},render:{value:true}},BIND_UI_ATTRS:["url","poster","ogvUrl","swfUrl","fixedAttributes","flashVars"],SYNC_UI_ATTRS:["url","poster","ogvUrl"],prototype:{renderUI:function(){var A=this;A._renderVideoTask=new D.DelayedTask(function(){A._renderVideo();});A._renderSwfTask=new D.DelayedTask(function(){A._renderSwf();});A._renderVideo(!A.get("ogvUrl"));},bindUI:function(){var A=this;A.publish("videoReady",{fireOnce:true});},_renderSwf:function(){var U=this;var Q=U.get("swfUrl");if(Q){var T=U.get("url");var V=U.get("poster");var R=U.get("flashVars");D.mix(R,{controls:true,src:T,poster:V});var A=D.QueryString.stringify(R);if(U._swfId){U._video.removeChild(D.one("#"+U._swfId));}else{U._swfId=D.guid();}var O='<object id="'+U._swfId+'" ';if(K.ie){O+='classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';}else{O+='type="application/x-shockwave-flash" data="'+Q+'" ';}O+='height="100%" width="100%">';if(K.ie){O+='<param name="movie" value="'+Q+'"/>';}var S=U.get("fixedAttributes");for(var P in S){O+='<param name="'+P+'" value="'+S[P]+'" />';}if(A){O+='<param name="flashVars" value="'+A+'" />';}if(V!=""){O+='<img src="'+V+'" alt="" />';}O+="</object>";U._video.append(O);}},_renderVideo:function(R){var A=this;var O=B;if(K.gecko&&R){O=F;}var Q=J.sub(O,[D.guid()]);var P=D.Node.create(Q);A.get("contentBox").append(P);A._video=P;},_uiSetFixedAttributes:function(O){var A=this;A._renderSwfTask.delay(1);},_uiSetFlashVars:function(O){var A=this;A._renderSwfTask.delay(1);},_uiSetOgvUrl:function(R){var A=this;if(K.gecko){var P=A._video;var O=A._usingVideo();if((!R&&O)||(R&&!O)){P.remove(true);A._renderVideoTask(1,null,null,[!R]);}if(!R){A._renderSwfTask.delay(1);}else{var Q=A._sourceOgv;if(!Q){Q=D.Node.create(I);P.append(Q);A._sourceOgv=Q;}Q.attr("src",R);}}},_uiSetPoster:function(P){var A=this;var O=A._video;if(A._usingVideo()){O.setAttribute("poster",P);}A._renderSwfTask.delay(1);},_uiSetSwfUrl:function(O){var A=this;A._renderSwfTask.delay(1);},_uiSetUrl:function(R){var P=this;var O=P.get("ogvUrl");var Q=P._video;var A=P._sourceMp4;if(K.gecko&&!P._usingVideo()){if(A!=null){A.remove(true);P._sourceMp4=null;}}else{if(Q||!O){if(!A){A=D.Node.create(G);Q.append(A);P._sourceMp4=A;}A.attr("src",R);}}P._renderSwfTask.delay(1);},_usingVideo:function(){var A=this;return(A._video.get("nodeName").toLowerCase()=="video");}}});D.Video=M;},"@VERSION@",{skinnable:true,requires:["aui-base","querystring-stringify-simple"]});