// TODO:
let comment_button = document.getElementById('comment-button');
let comment_input = document.getElementById('comment-input');
let comment_list = [];
let comment_number = document.getElementById('comment-num');
let comment_group = document.getElementById('comment-button-group');
let comment_block = document.getElementById('comment-group');

// init comment_button
comment_button.disabled = true;

comment_input.addEventListener('input', () => {
    if(comment_input.value !== '' && comment_input.value.trim() !== ''){
        // something in input field
        comment_button.style['background-color'] = '#065fd4';
        comment_button.disabled = false;
    }else{
        // nothing in input field
        comment_button.style['background-color'] = '#cccccc';
        comment_button.disabled = true;
    }
});

// comment event
comment_button.addEventListener('click', () => {
    let input_value = comment_input.value;
    input_value = input_value.trim();
    comment_list.push(input_value);
    // append element
    const comment = `<div class="comment">
        <img class="comment-img" src="images/user-icon.jpg"/>
        <div class="comment-right">
            <div>
                <span class="comment-name">Toby Chen</span>
                <span class="comment-time">現在</span>
            </div>
            <p class="comment-text">${input_value}</p>
        </div>
    </div>`
    comment_block.innerHTML += comment;
    // update comment number
    comment_number.innerHTML = `${comment_list.length + 1}則留言`;
    // clear input value
    comment_input.value = '';
    comment_button.style['background-color'] = '#cccccc';
    comment_button.disabled = true;
});

comment_group.style.visibility = 'hidden';

comment_input.addEventListener('focus', () => {
    comment_group.style.visibility = 'visible';
});

let cancel_button = document.getElementById('cancel-button');
cancel_button.addEventListener('click', () => {
    comment_input.value = '';
    comment_button.disabled = true;
    comment_button.style['background-color'] = '#cccccc';
    comment_group.style.visibility = 'hidden';
});
