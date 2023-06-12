const commentFormHandler = async (event) => {
    event.preventDefault();
    const comment = document.querySelector('#comment-text').value.trim();
    const blog_id = document.querySelector('#title').getAttribute('name');

    if (comment) {
        const response = await fetch('/api/comment', {
            method: 'POST',
            body: JSON.stringify({
                blog_id,
                textContent: comment
            }),

            headers: { 'Content-Type': 'application/json' },
        }
        );

        if (response.ok) {
            location.reload();
        } else {
            alert('Failed add comment')
        }
    } else {
        alert( "Please enter valid information")
    }
};

const displayInput = (event) => {
    document.querySelector('.new-comment').style.visibility = "visible";
    
    document
    .querySelector('.new-comment')
    .addEventListener('submit', commentFormHandler);

}


document
    .querySelector('#comment-button')
    .addEventListener("click",displayInput);