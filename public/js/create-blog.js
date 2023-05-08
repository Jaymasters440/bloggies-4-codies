const createFormHandler = async (event) => {
    event.preventDefault();
    const title = document.querySelector('#title-new-post').value.trim();
    const text = document.querySelector('#content-new-post').value.trim();

    if (title && text) {
        const response = await fetch('/api/blog', {
            method: 'POST',
            body: JSON.stringify({
                title,
                textContent: text
            }),

            headers: { 'Content-Type': 'application/json' },
        }
        );

        if (response.ok) {
            document.location.replace('dashboard');
        } else {
            alert('Failed to create blog')
        }
    } else {
        alert( "Please enter valid information")
    }
};

document
    .querySelector('.new-post-form')
    .addEventListener('submit', createFormHandler);