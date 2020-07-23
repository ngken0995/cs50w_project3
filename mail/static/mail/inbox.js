document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  //sent mail
  document.querySelector('#compose-form').onsubmit = function() {
   fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
    console.log('Error:', error);
    });
    load_mailbox('sent');
    return false;
  }

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#content-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#content-view').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //load emails
  load_emails(mailbox);
  
}

function load_emails(mailbox) {
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    for (i = 0; i < emails.length; i++){
      const element = document.createElement('div');
      element.innerHTML = `Sender: ${emails[i].sender} Subject: ${emails[i].subject} Date: ${emails[i].timestamp}`;
      element.classList.add("email");
      element.setAttribute("data-id",`${emails[i].id}`)
      element.addEventListener('click', () => load_email(`${element.dataset.id}`));

      document.querySelector('#emails-view').append(element);
    }

    let x = document.querySelectorAll(".email");
    for (let i = 0; i < x.length; i++) {
      x[i].style.border = "1px solid black";
    }

    console.log(emails)
  })
  .catch(error =>{
    console.log('Error:',error);
  });
  return false;
}

function load_email(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#content-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const sender = document.createElement('div');
    sender.innerHTML = `From: ${email.sender}`;
    document.querySelector('#content-view').append(sender);

    const recipients = document.createElement('div');
    const people = email.recipients;
    const peopleList = people.join(', ');
    recipients.innerHTML = `To: ${peopleList}`;
    document.querySelector('#content-view').append(recipients);

    const subject = document.createElement('div');
    subject.innerHTML = `Subject: ${email.subject}`;
    document.querySelector('#content-view').append(subject);

    const timestamp = document.createElement('div');
    timestamp.innerHTML = `Time: ${email.timestamp}`;
    document.querySelector('#content-view').append(timestamp);

    const body = document.createElement('div');
    body.innerHTML = `${email.body}`;
    document.querySelector('#content-view').append(body);
  })
  .catch(error =>{
    console.log('Error:', error);
  });

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });
  return false;
}

