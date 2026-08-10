// ========================================
// ASPI HUB COMMUNITY
// Version 1 - Local Browser Storage
// ========================================

const postTitle =
    document.getElementById("postTitle");

const postContent =
    document.getElementById("postContent");

const postCategory =
    document.getElementById("postCategory");

const postSubject =
    document.getElementById("postSubject");

const publishPost =
    document.getElementById("publishPost");

const communityPosts =
    document.getElementById("communityPosts");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// ========================================
// LOAD POSTS
// ========================================

let posts =
    JSON.parse(
        localStorage.getItem("aspiCommunityPosts")
    ) || [];


// ========================================
// DEFAULT SAMPLE POSTS
// ========================================

if (posts.length === 0) {

    posts = [

        {
            id: Date.now() + 1,
            title: "Need help with Chemistry",
            content:
                "Can someone explain how to approach equilibrium questions?",
            category: "question",
            subject: "Chemistry",
            createdAt: new Date().toLocaleString(),
            helpful: 0
        },

        {
            id: Date.now() + 2,
            title: "Biology Revision Tip",
            content:
                "Try making short diagrams and flashcards for each topic before quizzes.",
            category: "study",
            subject: "Biology",
            createdAt: new Date().toLocaleString(),
            helpful: 2
        }

    ];

    savePosts();
}


// ========================================
// SAVE POSTS
// ========================================

function savePosts() {

    localStorage.setItem(
        "aspiCommunityPosts",
        JSON.stringify(posts)
    );

}


// ========================================
// CATEGORY LABEL
// ========================================

function categoryLabel(category) {

    if (category === "question") {
        return "❓ Question";
    }

    if (category === "study") {
        return "📚 Study Tip";
    }

    if (category === "announcement") {
        return "📢 Announcement";
    }

    if (category === "resource") {
        return "🔗 Resource";
    }

    return category;
}


// ========================================
// RENDER POSTS
// ========================================

function renderPosts(filter = "all") {

    communityPosts.innerHTML = "";


    const filteredPosts =
        filter === "all"
            ? posts
            : posts.filter(
                post => post.category === filter
            );


    if (filteredPosts.length === 0) {

        communityPosts.innerHTML = `
            <div class="empty-community">
                <h3>No posts here yet</h3>
                <p>Be the first student to post something.</p>
            </div>
        `;

        return;
    }


    // Newest first

    filteredPosts
        .slice()
        .reverse()
        .forEach(post => {

            const card =
                document.createElement("article");

            card.className =
                "post-card";


            card.innerHTML = `

                <div class="post-top">

                    <span class="post-category ${post.category}">
                        ${categoryLabel(post.category)}
                    </span>

                    <span class="post-subject">
                        ${post.subject}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(post.title)}
                </h3>


                <p>
                    ${escapeHTML(post.content)}
                </p>


                <div class="post-meta">
                    👤 ASPI Student · ${post.createdAt}
                </div>


                <div class="post-actions">

                    <button
                        class="helpful-btn"
                        data-id="${post.id}"
                    >
                        👍 Helpful (${post.helpful || 0})
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${post.id}"
                    >
                        🗑 Delete
                    </button>

                </div>
            `;


            communityPosts.appendChild(card);

        });


    connectPostButtons();

}


// ========================================
// CREATE POST
// ========================================

publishPost.addEventListener(
    "click",
    function () {

        const title =
            postTitle.value.trim();

        const content =
            postContent.value.trim();


        if (!title || !content) {

            alert(
                "Please enter both a title and post content."
            );

            return;
        }


        const newPost = {

            id: Date.now(),

            title: title,

            content: content,

            category:
                postCategory.value,

            subject:
                postSubject.value,

            createdAt:
                new Date().toLocaleString(),

            helpful: 0

        };


        posts.push(newPost);

        savePosts();


        // Clear form

        postTitle.value = "";
        postContent.value = "";

        postCategory.value =
            "question";

        postSubject.value =
            "General";


        // Reset filter to All

        filterButtons.forEach(button => {
            button.classList.remove("active");
        });

        document
            .querySelector(
                '[data-filter="all"]'
            )
            .classList.add("active");


        renderPosts("all");

    }
);


// ========================================
// FILTER POSTS
// ========================================

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                renderPosts(
                    this.dataset.filter
                );

            }
        );

    }
);


// ========================================
// CONNECT POST BUTTONS
// ========================================

function connectPostButtons() {

    const helpfulButtons =
        document.querySelectorAll(
            ".helpful-btn"
        );

    const deleteButtons =
        document.querySelectorAll(
            ".delete-btn"
        );


    // Helpful button

    helpfulButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );


                    const post =
                        posts.find(
                            item =>
                                item.id === id
                        );


                    if (post) {

                        post.helpful =
                            (post.helpful || 0) + 1;

                        savePosts();

                        renderPosts(
                            getCurrentFilter()
                        );

                    }

                }
            );

        }
    );


    // Delete post

    deleteButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            this.dataset.id
                        );


                    const confirmed =
                        confirm(
                            "Delete this post?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    posts =
                        posts.filter(
                            post =>
                                post.id !== id
                        );


                    savePosts();

                    renderPosts(
                        getCurrentFilter()
                    );

                }
            );

        }
    );

}


// ========================================
// CURRENT FILTER
// ========================================

function getCurrentFilter() {

    const activeButton =
        document.querySelector(
            ".filter-btn.active"
        );


    if (!activeButton) {
        return "all";
    }


    return activeButton.dataset.filter;

}


// ========================================
// ESCAPE USER TEXT
// Helps prevent HTML from being inserted
// ========================================

function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ========================================
// START
// ========================================

renderPosts();
