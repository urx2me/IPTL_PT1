function likePost(button) {
    let countSpan = button.querySelector("span");
    let count = parseInt(countSpan.textContent, 10);
    countSpan.textContent = count + 1;
}
function toggleCommentSection(button) {
    let commentSection = button.parentElement.nextElementSibling;
    commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";
}
function addComment(button) {
    let input = button.previousElementSibling;
    let commentText = input.value.trim();
    if (commentText !== "") {
        let commentList = button.nextElementSibling;
        let newComment = document.createElement("li");
        newComment.textContent = commentText;
        commentList.appendChild(newComment);
        input.value = "";
    }
}