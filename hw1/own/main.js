var heart = document.getElementById("heart");
heart.addEventListener('click', beOrDontBeHeart);
function beOrDontBeHeart() {
    var my_heart = document.getElementById("heart");
    if(my_heart.getAttribute("name") === 'no-heart'){
        my_heart.innerHTML = '<i class="fas fa-heart"></i>';
        my_heart.setAttribute('name', 'heart');
    }else{
        my_heart.innerHTML = '<i class="far fa-heart"></i>';
        my_heart.setAttribute('name', 'no-heart');
    }
}
