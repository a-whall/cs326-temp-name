import * as crud from './crud.js';

const login_form = document.getElementById('login-form');
const login_btn = document.getElementById('login-button');
const logout_btn = document.getElementById('logout-button');
const account_dropdown_loggedIn = document.getElementById('account-logged-in');
const account_dropdown_loggedOut = document.getElementById('account-logged-out');
const welcome_container = document.getElementById('welcome-container');

positionWelcomeMessage();

// choose which dropdown menu to show initially
const loggedIn = await crud.checkLoggedIn();
if (loggedIn.value) {
  account_dropdown_loggedOut.classList.add('d-none');
} else {
  account_dropdown_loggedIn.classList.add('d-none');
}

login_btn.addEventListener('click', async(e) => {
  const login = await crud.createLogin(new FormData(login_form));
  if (login.status === 'success') {
    // TODO: change the loggedIn dropdown to display username instead of "account"
    account_dropdown_loggedIn.classList.remove('d-none');
    account_dropdown_loggedOut.classList.add('d-none');
  } else {
    // TODO: display why login failed and keep the account dropdown open
  }
});

logout_btn.addEventListener('click', async(e) => {
  await crud.logout();
  account_dropdown_loggedIn.classList.add('d-none');
  account_dropdown_loggedOut.classList.remove('d-none');
});

window.addEventListener('resize', positionWelcomeMessage, false);

function positionWelcomeMessage() {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  if (viewportWidth > 1395) {
    welcome_container.classList.add('fixed-bottom');
  } else {
    welcome_container.classList.remove('fixed-bottom');
  }
}