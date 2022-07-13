createAuth0Client({
  domain: "dev-d2mb0zhs.us.auth0.com",
  client_id: "iwQIjIpIheNQCJmrVbhu6vLX30SMCpFZ",
  redirect_uri: window.location.origin,
}).then(async (auth0) => {
  // Assumes a button with id "login" in the DOM
  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0.loginWithRedirect();
  });

  if (location.search.includes("state=") && 
      (location.search.includes("code=") || 
      location.search.includes("error="))) {
          const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams.get('error_description') != null){
      document.getElementById("validation").append(urlParams.get('error_description'));
    }
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
    
  }

  // Assumes a button with id "logout" in the DOM
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    auth0.logout();
  });

  const isAuthenticated = await auth0.isAuthenticated();
  const userProfile = await auth0.getUser();

  // Assumes an element with id "profile" in the DOM
  document.getElementById(
      "ipt-access-token"
    ).innerHTML = await auth0.getTokenSilently();
    const profileElement = document.getElementById("profile");

  if (isAuthenticated) {

    document.getElementById("login").disabled = true;
    document.getElementById("logout").disabled = false;
    document.getElementById("gated-content").classList.remove("hidden");
    profileElement.style.display = "block";
    profileElement.innerHTML = `
            <p>${userProfile.name}</p>
            <img src="${userProfile.picture}" />
          `;
    document.getElementById("ipt-user-country").textContent = userProfile['https://example.com/country'];

    //JSON.stringify(
    // userProfile
   //);
  } else {
    profileElement.style.display = "none";
  }
});