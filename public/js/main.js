const form = document.getElementById('contact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  fetch('/send-email', {
    method: 'POST',
    body: JSON.stringify({ name, email, subject, message })
  })
    .then((res) => {
      if (res.ok) {
        form.reset();
        Swal.fire({
          title: "Success!",
          text: "Your message has been sent.",
          icon: "success",
        });
      } else {
        console.error(res)
        Swal.fire({
          title: "Error!",
          text: "Failed to send email.",
          icon: "error",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to send email.",
        icon: "error",
      });
    });
});