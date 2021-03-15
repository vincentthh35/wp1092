var imgs = ["https://cdn.vox-cdn.com/thumbor/wXoBkN9pMTmKc0ByOu1H0CoxCxo=/0x0:2156x3000/1200x800/filters:focal(866x489:1210x833)/cdn.vox-cdn.com/uploads/chorus_image/image/68556709/111326709.0.jpg",
"https://cdn.i-scmp.com/sites/default/files/styles/768x768/public/d8/images/methode/2020/04/20/04877104-82b8-11ea-8863-2139a14b0dea_image_hires_122446.JPG?itok=wSEnRWIa&v=1587356692",
"https://www.si.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY4MTk4NTg4MjQ0ODMwMTA5/jeremy-lin-rockets.jpg",
"https://ca-times.brightspotcdn.com/dims4/default/9503cb6/2147483647/strip/true/crop/1200x700+0+0/resize/840x490!/quality/90/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F48%2F2c%2F2b33e7ac2f3110183c85d4dbf5b5%2Fla-sp-ln-jeremy-lin-sprains-left-ankle-practic-001",
"https://hoopshabit.com/files/2015/12/jeremy-lin-nba-charlotte-hornets-chicago-bulls.jpg",
"https://a3.espncdn.com/combiner/i?img=%2Fphoto%2F2017%2F1019%2Fr276212_1296x729_16%2D9.jpg",
"https://www.nba.com/hawks/sites/hawks/files/gettyimages-1044369656_0.jpg?w=756&h=546",
"https://images.thestar.com/wLNnM4_sILLQM_joTLasgN9Odzw=/1086x747/smart/filters:cb(1550412253474)/https://www.thestar.com/content/dam/thestar/sports/raptors/opinion/2019/02/13/jeremy-lin-arrives-just-in-time-with-raptors-short-handed/lin_layup.jpg",
"https://supchina.com/wp-content/uploads/2020/06/Jeremy-Lin-CBA-debut.jpg",
"https://www.nbcsports.com/sites/rsnunited/files/article/hero/Lin_J_Getty_1230950779.jpg"];

var curPic = document.getElementById("display");
var prePic = document.getElementById("previous");
var nextPic = document.getElementById("next");
var source = document.getElementById("source")
index = 0;
curPic.src = imgs[index];
source.href = imgs[index];
prePic.classList.add("disabled");

function prevImage() {
    if (index > 0) {
        prePic.classList.remove("disabled");
        nextPic.classList.remove("disabled");
        index -= 1;
        curPic.src = './images/loading.gif';
        curPic.src = imgs[index];
        source.href = imgs[index];
        console.log("back: " + index)
    }
    if (index == 0) {
        prePic.classList.add("disabled");
    }
};

function nextImage() {
    if (index < imgs.length - 1) {
        prePic.classList.remove("disabled");
        nextPic.classList.remove("disabled");
        index += 1;
        curPic.src = './images/loading.gif';
        curPic.src = imgs[index];
        source.href = imgs[index];
        console.log("next: " + index)
    }
    if (index == imgs.length - 1) {
        nextPic.classList.add("disabled");
    }
};