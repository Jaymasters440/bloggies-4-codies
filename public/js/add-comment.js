const commentFormHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#content-user_id-blog_id').value.trim();
    const text = document.querySelector('#content-user_id-blog_id').value.trim();

    if (title && text) {
        const response = await fetch('/api/comment.js', {
            method: 'POST',
            body: JSON.stringify({
                title,
                user_id,
                textContent: text
            }),

            headers: { 'Content-Type': 'application/json' },
        }
        );

        if (response.ok) {
            document.location.replace('comment');
        } else {
            alert('Failed add comment')
        }
    } else {
        alert( "Please enter valid information")
    }
};

document
    .querySelector('.new-post-form')
    .addEventListener('submit', createFormHandler);