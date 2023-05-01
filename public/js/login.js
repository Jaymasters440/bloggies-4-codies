const loginFormHandler = async (event) => {
    event.preventDefault();
  
    //get title and textcontent from html doc
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (email && password) {//check if data exists
      const response = await fetch('/api/user/login', {///api/blog for new blog, but you need to send the id for the edit blog /api/blog/(id)
        method: 'POST',//post for new blog, put for edit blog
        body: JSON.stringify({ email, password }),//when doing this part, look at models to see what you need to send
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        //think about where you want your user to go after
        document.location.replace('/');
      } else {
        alert('Failed to log in');
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);