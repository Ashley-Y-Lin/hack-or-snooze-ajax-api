"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.log("generateStoryMarkup", story);

  //FIXME: dont hard code the star color
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="bi bi-star story-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Get data from the add new story form, calls .addStory method to create
 * a new instance of Story, and put that story on the page */

async function grabAndShowStory(evt) {
  evt.preventDefault();
  $addStoryForm.toggle();

  // grab the author, title, and url
  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();

  const storyInfo = {
    title,
    author,
    url
  };

  const newStory = await storyList.addStory(currentUser, storyInfo);
  //console.log("newStory ==>", newStory);

  const $storyMarkup = generateStoryMarkup(newStory);
  //console.log('storyMarkup ==>', $storyMarkup);

  $allStoriesList.prepend($storyMarkup);
}

$storyFormSubmit.on("click", grabAndShowStory);

function putFavoritesOnPage() {
  $allFavoritesList.empty()

  for (let story of currentUser.favorites) {
    const $storyMarkup = generateStoryMarkup(story);
    $allFavoritesList.prepend($storyMarkup);
  }

  $allFavoritesList.show();
}

/** handle favorite and unfavorite of a story */

// grab the id for the story
// loop over the stories in user.favorites
// check if any of the story ids are equal to the id you grabbed
// if it is
// call remove favorites
// if not
// call add favorites
// toggle the star color

async function toggleFavoriteStory(event) {
  console.log("a star was clicked");

  const $target = $(event.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");

  const storyInstance = await Story.getStory(storyId);
  let isFavorite = false;

  for (let story of currentUser.favorites) {
    if (story.id === storyId) {
      isFavorite = true;
    }
  }

  if (isFavorite === true) {
    await currentUser.removeFavorite(storyInstance);
  } else {
    await currentUser.addFavorite(storyInstance);
  }

  $target.toggleClass("bi-star bi-star-fill");
}

$(".stories-container").on("click", ".story-star", toggleFavoriteStory);