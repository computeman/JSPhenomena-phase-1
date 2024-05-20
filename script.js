document.addEventListener("DOMContentLoaded", function () {
  // Call the function to render blog posts on the front page
  renderFrontPageBlogPosts();

  function createBlogPost(postData) {
    var blogPostElement = document.createElement("div");
    blogPostElement.classList.add("post");
    blogPostElement.dataset.id = postData.id;

    var titleElement = document.createElement("h2");
    titleElement.textContent = postData.title;
    titleElement.addEventListener("click", function () {
      renderIndividualBlogPost(postData);
    });

    var summaryElement = document.createElement("p");
    summaryElement.textContent = postData.summary;

    var authorElement = document.createElement("p");
    authorElement.textContent = `By ${postData.author.name} on ${postData.date}`;

    var likeButton = document.createElement("button");
    likeButton.textContent = `Like (${postData.likes})`;
    likeButton.addEventListener("click", function (event) {
      event.stopPropagation();
      postData.likes += 1;
      likeButton.textContent = `Like (${postData.likes})`;
      updateLikes(postData.id, postData.likes);
    });

    var commentButton = document.createElement("button");
    commentButton.textContent = "Comment";
    commentButton.addEventListener("click", function () {
      renderIndividualBlogPost(postData);
    });

    blogPostElement.appendChild(titleElement);
    blogPostElement.appendChild(summaryElement);
    blogPostElement.appendChild(authorElement);
    blogPostElement.appendChild(likeButton);
    blogPostElement.appendChild(commentButton);

    return blogPostElement;
  }

  function renderIndividualBlogPost(postData) {
    var frontPageContainer = document.querySelector(".front-page");
    var individualPostContainer = document.querySelector(".individual-post");
    var blogContentContainer = document.querySelector(".blog-content");
    var sidebarContainer = document.querySelector(".sidebar");

    frontPageContainer.style.display = "none";
    individualPostContainer.style.display = "flex";

    blogContentContainer.innerHTML = ""; // Clear existing content
    sidebarContainer.innerHTML = ""; // Clear existing content

    var titleElement = document.createElement("h2");
    titleElement.textContent = postData.title;

    var contentElement = document.createElement("div");
    contentElement.innerHTML = postData.content.split("\n").join("<br>");

    var likeCount = document.createElement("p");
    likeCount.textContent = `Likes: ${postData.likes}`;

    var commentElement = document.createElement("p");
    commentElement.textContent = "Comments:";

    var commentsList = document.createElement("ul");
    commentsList.classList.add("post-comments");
    postData.comments.forEach(function (comment) {
      var commentItem = document.createElement("li");
      commentItem.innerHTML = `<strong>@${comment.username}:</strong> ${comment.comment}`;
      commentsList.appendChild(commentItem);
    });

    // Add author information
    var authorInfo = document.createElement("p");
    authorInfo.textContent = `By ${postData.author.name} on ${postData.date}`;

    var commentForm = document.createElement("form");
    var usernameInput = document.createElement("input");
    usernameInput.setAttribute("type", "text");
    usernameInput.setAttribute("placeholder", "Your username");
    var commentInput = document.createElement("input");
    commentInput.setAttribute("type", "text");
    commentInput.setAttribute("placeholder", "Your comment");
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit Comment";

    commentForm.appendChild(usernameInput);
    commentForm.appendChild(commentInput);
    commentForm.appendChild(submitButton);

    commentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var newComment = {
        id: postData.comments.length + 1,
        username: usernameInput.value,
        comment: commentInput.value,
      };

      postData.comments.push(newComment);
      updateComments(postData.id, postData.comments);
      renderIndividualBlogPost(postData);
    });

    var backButton = document.createElement("button");
    backButton.textContent = "Back to Blog";
    backButton.addEventListener("click", function () {
      individualPostContainer.style.display = "none";
      frontPageContainer.style.display = "flex";
      renderFrontPageBlogPosts();
    });

    // Like button for individual blog post
    var likeButton = document.createElement("button");
    likeButton.textContent = `Like (${postData.likes})`;
    likeButton.addEventListener("click", function () {
      postData.likes += 1;
      likeButton.textContent = `Like (${postData.likes})`;
      updateLikes(postData.id, postData.likes);
    });

    // Dynamic sidebar with titles
    var sidebarTitle = document.createElement("h3");
    sidebarTitle.textContent = "Other Blogs";

    var sidebarList = document.createElement("ul");
    fetch("https://jsblogdaudiapi.onrender.com/posts")
      .then((response) => response.json())
      .then((data) => {
        data.forEach(function (blog) {
          if (blog.id !== postData.id) {
            var sidebarItem = document.createElement("li");
            sidebarItem.textContent = blog.title;
            sidebarList.appendChild(sidebarItem);
            sidebarItem.addEventListener("click", function () {
              fetch(`https://jsblogdaudiapi.onrender.com/posts/${blog.id}`)
                .then((response) => response.json())
                .then((data) => {
                  renderIndividualBlogPost(data);
                });
            });
          }
        });
      });

    blogContentContainer.appendChild(titleElement);
    blogContentContainer.appendChild(contentElement);
    blogContentContainer.appendChild(likeCount);
    blogContentContainer.appendChild(commentElement);
    blogContentContainer.appendChild(commentsList);
    blogContentContainer.appendChild(authorInfo); // Add author information
    blogContentContainer.appendChild(commentForm);
    blogContentContainer.appendChild(likeButton);
    blogContentContainer.appendChild(backButton);

    sidebarContainer.appendChild(sidebarTitle);
    sidebarContainer.appendChild(sidebarList);
  }

  function renderFrontPageBlogPosts() {
    var frontPageContainer = document.querySelector(".front-page");
    frontPageContainer.innerHTML = "";

    fetch("https://jsblogdaudiapi.onrender.com/posts")
      .then((response) => response.json())
      .then((data) => {
        data.forEach(function (post) {
          var postElement = createBlogPost(post);
          frontPageContainer.appendChild(postElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
      });
  }

  function updateLikes(postId, likes) {
    fetch(`https://jsblogdaudiapi.onrender.com/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Likes updated on the server:", data);
      })
      .catch((error) => {
        console.error("Error updating likes:", error);
      });
  }

  function updateComments(postId, comments) {
    fetch(`https://jsblogdaudiapi.onrender.com/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Comments updated on the server:", data);
      })
      .catch((error) => {
        console.error("Error updating comments:", error);
      });
  }
  const home = document.getElementById("homeLink");
  home.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    renderFrontPageBlogPosts();
    var frontPageContainer = document.querySelector(".front-page");
    var individualPostContainer = document.querySelector(".individual-post");
    frontPageContainer.style.display = "flex";
    individualPostContainer.style.display = "none";
    frontPageContainer.style.flexDirection = "column";
  });
});
