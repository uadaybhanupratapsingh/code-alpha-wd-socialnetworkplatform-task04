document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const likeCountSpan = button.nextElementSibling;
            let likeCount = parseInt(likeCountSpan.textContent.split(' ')[0]);
            likeCount += 1;
            likeCountSpan.textContent = `${likeCount} Likes`;
        });
    });

    const avatarElements = document.querySelectorAll('.avatar');
    
    avatarElements.forEach(avatar => {
        const username = 'sampleUser'; // Replace with actual username or unique identifier
        const avatarUrl = `https://avatars.dicebear.com/api/bottts/${username}.svg`;
        avatar.src = avatarUrl;
    });

    // Fetch and display comments
    const commentSections = document.querySelectorAll('.comments');

    commentSections.forEach(section => {
        const postId = section.closest('.post').dataset.postId;

        fetch(`/api/posts/${postId}/comments`)
            .then(response => response.json())
            .then(comments => {
                const commentList = section.querySelector('.comment-list');
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.innerHTML = `<strong>${comment.author.username}</strong>: ${comment.content}`;
                    commentList.appendChild(commentElement);
                });
            });
    });

    // Handle new comment submission
    const commentForms = document.querySelectorAll('.comment-form');

    commentForms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const input = form.querySelector('.comment-input');
            const content = input.value.trim();
            if (!content) return;

            const postId = form.closest('.post').dataset.postId;
            const author = 'userId'; // Replace with actual user ID
            const commentData = { author, content };

            fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            })
                .then(response => response.json())
                .then(comment => {
                    const commentList = form.previousElementSibling;
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.innerHTML = `<strong>${comment.author.username}</strong>: ${comment.content}`;
                    commentList.appendChild(commentElement);
                    input.value = '';
                });
        });
    });

    // Handle video upload
    const videoUploadForm = document.getElementById('video-upload-form');
    const videoInput = document.getElementById('video-input');

    videoUploadForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('video', videoInput.files[0]);

        fetch('/api/videos', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.videoUrl) {
                    const postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <img class="avatar" src="" alt="User Avatar">
                        <h3>User Name</h3>
                        <p>New video post</p>
                        <video class="post-video" controls src="${data.videoUrl}"></video>
                        <button class="like-btn">Like</button>
                        <span class="like-count">0 Likes</span>
                        <div class="comments">
                            <h4>Comments</h4>
                            <div class="comment-list"></div>
                            <form class="comment-form">
                                <input type="text" placeholder="Add a comment" class="comment-input">
                                <button type="submit">Post</button>
                            </form>
                        </div>
                    `;
                    document.getElementById('posts').appendChild(postElement);

                    // Re-initialize event listeners for the new post
                    postElement.querySelector('.like-btn').addEventListener('click', () => {
                        const likeCountSpan = postElement.querySelector('.like-count');
                        let likeCount = parseInt(likeCountSpan.textContent.split(' ')[0]);
                        likeCount += 1;
                        likeCountSpan.textContent = `${likeCount} Likes`;
                    });

                    const commentForm = postElement.querySelector('.comment-form');
                    commentForm.addEventListener('submit', event => {
                        event.preventDefault();
                        const input = commentForm.querySelector('.comment-input');
                        const content = input.value.trim();
                        if (!content) return;

                        const postId = postElement.dataset.postId;
                        const author = 'userId'; // Replace with actual user ID
                        const commentData = { author, content };

                        fetch(`/api/posts/${postId}/comments`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(commentData)
                        })
                            .then(response => response.json())
                            .then(comment => {
                                const commentList = commentForm.previousElementSibling;
                                const commentElement = document.createElement('div');
                                commentElement.classList.add('comment');
                                commentElement.innerHTML = `<strong>${comment.author.username}</strong>: ${comment.content}`;
                                commentList.appendChild(commentElement);
                                input.value = '';
                            });
                    });
                }
            });
    });
});
