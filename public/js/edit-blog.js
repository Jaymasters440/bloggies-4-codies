const editFormHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#title').value.trim();
    const text = document.querySelector('#content-new-post').value.trim();
    console.log(title+text);
    const id = document.querySelector('#title').getAttribute('name');

    if (title && text) {
        const response = await fetch(`/api/blog/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                textContent: text
            }),

            headers: { 'Content-Type': 'application/json' },
        }
        );

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to edit blog')
        }
    } else {
        alert( "Please enter valid information")
    }
};

document
    .querySelector('.new-post-form')
    .addEventListener('submit', editFormHandler);