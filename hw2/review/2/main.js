var myImage = document.querySelector("#img1");
var pre = document.querySelector("#previous");
var nxt = document.querySelector("#next");
var i=0;
var imgarr=['images/1.jpg','images/2.png','images/3.jpg','images/4.jpg','images/5.jpg'];
var n=imgarr.length;
nxt.onclick = function() {
  if(i!==n-1){
    i=(i+1)%n;
    myImage.setAttribute ('src',imgarr[i],"style","width:960px");
    myImage.style.width='960px';
  }
}
pre.onclick = function() {
  if(i!==0) {
    i=(i-1+n)%n;
    myImage.setAttribute ('src',imgarr[i],"style","width:960px");
    myImage.style.width='960px';
  }
}