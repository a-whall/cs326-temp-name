
const username = document.getElementById("username-input");
const passowrd = document.getElementById("password-input");
const signIn = document.getElementById("sign-in");
const profile = document.getElementById("profile");
const trails = document.getElementById("trails");
const events = document.getElementById("events");
const create_trail = document.getElementById("create-trail");
const create_profile = document.getElementById("create-profile");


signIn.addEventListener('click', async() => {
    //GET verify userInfo from user table
});

profile.addEventListener('click', async() => {
    window.location.href="profile.html";
});

trails.addEventListener('click', async() => {
    window.location.href="browseTrails.html";
});

events.addEventListener('click', async() => {
    window.location.href="browseEvents.html";
});

create_trail.addEventListener('click', async() => {
    window.location.href="createTrailPage.html";
});

create_profile.addEventListener('click', async() => {
    window.location.href="createProfile.html";
});