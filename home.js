function toggleCommentSection(button) {
    let commentSection = button.parentElement.nextElementSibling;
    commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";
}

function addComment(button) {
    let input = button.previousElementSibling;
    let commentText = input.value.trim();
    if (commentText !== "") {
        let commentList = button.closest(".comments-section").querySelector(".comments-list");
        let newComment = document.createElement("li");
        newComment.textContent = commentText;
        commentList.appendChild(newComment);
        input.value = "";
    }
}


document.addEventListener("DOMContentLoaded", function () {
let reactionButtons = document.querySelectorAll(".reaction-btn");

reactionButtons.forEach(button => {
let options = button.querySelector(".reaction-options");
let countSpan = button.querySelector("span:nth-of-type(2)"); 
let reactionText = button.querySelector("span:first-child"); 

let totalReactions = 0;
let lastSelectedReaction = null;


countSpan.textContent = "(0)";

button.addEventListener("click", function (event) {
    event.stopPropagation(); 
    options.style.display = options.style.display === "flex" ? "none" : "flex";
});

options.addEventListener("click", function (event) {
    let selectedReaction = event.target.textContent.trim();
    if (lastSelectedReaction === selectedReaction) return;

    lastSelectedReaction = selectedReaction;
    totalReactions++;
    reactionText.textContent = selectedReaction;
    countSpan.textContent = `(${totalReactions})`;

    reactionText.classList.add("reaction-animate");

    setTimeout(() => {
        reactionText.classList.remove("reaction-animate");
    }, 300);

    options.style.display = "none";
    event.stopPropagation();
});

});


document.addEventListener("click", function () {
document.querySelectorAll(".reaction-options").forEach(menu => {
    menu.style.display = "none";
});
});
});

function editBio() {
let newBio = prompt("Enter your new bio:");
if (newBio) {
document.querySelector(".profile-info").textContent = newBio;
}
}

document.addEventListener("DOMContentLoaded", () => {
let followers = document.getElementById("followers");
let following = document.getElementById("following");

function animateCount(element, target) {
let count = 0;
let speed = Math.floor(2000 / target); 
let interval = setInterval(() => {
    if (count >= target) {
        clearInterval(interval);
    } else {
        count += 5; 
        element.textContent = count;
    }
}, speed);
}

animateCount(followers, 1250);
animateCount(following, 300);
});