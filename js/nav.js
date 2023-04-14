"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Displays add new story form when a user clicks the 'submit' navbar link */

/**
 * Called when click on navbar link, cause new story form to appear on page
 */

function navSubmitLinkClick(evt) {
  console.log("the navSubmit link clicked, displays add story form");
  evt.preventDefault();
  $addStoryForm.toggle();
  hidePageComponents();
  $allStoriesList.show();

}

$navSubmit.on("click", navSubmitLinkClick);
