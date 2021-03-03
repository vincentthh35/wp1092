let image_urls = [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1546842931-886c185b4c8c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=632&q=80',
    'https://images.unsplash.com/photo-1442458017215-285b83f65851?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80',
    'https://images.unsplash.com/photo-1464820453369-31d2c0b651af?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503652601-557d07733ddc?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80',
    'https://images.unsplash.com/photo-1548678756-aa5ed92c4796?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    'https://images.unsplash.com/photo-1460647927807-8e664765c97c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
];

let image = document.getElementById('display');
let current_index = 0;
let max_index = image_urls.length - 1;
image.setAttribute('src', image_urls[current_index]);

let previous = document.getElementById('previous');
let next = document.getElementById('next');
let link = document.getElementById('link');

previous.addEventListener('click', function () {
    if(previous.className !== 'disabled'){
        current_index--;
        image.setAttribute('src', image_urls[current_index]);
        // loading
        let old_class = image.className;
        image.className += ' loading';

        link.setAttribute('href', image_urls[current_index]);
        link.innerHTML = image_urls[current_index];
        if(current_index === 0){
            previous.setAttribute('class', 'disabled');
        }
        if(next.className === 'disabled'){
            next.setAttribute('class', '');
        }
        // end loading
        image.className = old_class;
    }
});
previous.setAttribute('class', 'disabled'); // disabled at first
link.setAttribute('href', image_urls[0]);
link.innerHTML = image_urls[0];

next.addEventListener('click', function () {
    if(next.className !== 'disabled'){
        current_index++;
        image.setAttribute('src', image_urls[current_index]);
        // loading
        let old_class = image.className;
        image.className += ' loading';

        link.setAttribute('href', image_urls[current_index]);
        link.innerHTML = image_urls[current_index];
        if(current_index === max_index){
            next.setAttribute('class', 'disabled');
        }
        if(previous.className === 'disabled'){
            previous.setAttribute('class', '');
        }
        // end loading
        image.className = old_class;
    }
})
