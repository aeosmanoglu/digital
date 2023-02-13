const appUrl = "/app/apps";
const checkboxContainer = document.getElementById("checkbox-container");
const searchInput = document.getElementById("search-input");
const appContainer = document.getElementById("app-container");

let filteredApps = [];
let categories = [];

function toast_trigger() {
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    const toastList = toastElList.map(toastEl => new bootstrap.Toast(toastEl));
    toastList.forEach(toast => toast.show());
}

function filter_by_category(apps) {
    let array = [];
    apps.forEach(app => {
        if (localStorage.getItem(app.category) === "checked") {
            array.push(app);
        }
    });
    return array;
}

function drawCards(apps) {
    // Clear app container
    appContainer.innerHTML = "";

    apps.forEach(app => {
        const column = document.createElement("div");
        column.className = "col";

        const card = document.createElement("div");
        card.className = "card rounded-0";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardSubtitle = document.createElement("p");
        cardSubtitle.className = "card-subtitle text-muted small mb-4";
        cardSubtitle.innerHTML = app.category;

        const cardTitle = document.createElement("h3");
        cardTitle.className = "card-title ";
        cardTitle.innerHTML = app.abbreviation==="null" ? "" : app.abbreviation;

        const cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.innerHTML = app.name;

        const cardLink = document.createElement("a");
        cardLink.className = "link-primary stretched-link";
        cardLink.href = "/app/" + app.id + "/click";
        cardLink.setAttribute("target", "_blank");

        const cardBadge = document.createElement("span");
        cardBadge.className = "position-absolute top-0 start-100 translate-end badge rounded-pill bg-danger";
        cardBadge.innerHTML = "Yeni";

        if (app.is_new === "True") {
            card.appendChild(cardBadge);
        }

        cardBody.appendChild(cardSubtitle);
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardBody);
        card.appendChild(cardLink);
        column.appendChild(card);
        appContainer.appendChild(column);
    })
}

window.addEventListener("load", function () {
    toast_trigger();

    fetch(appUrl).then(response => {
        return response.json();
    }).then(data => {
        data.apps = Array.from(data.apps);
        data.apps.clicks = Number(data.apps.clicks);
        data.apps.is_new = String(data.apps.is_new);
        data.apps.category = String(data.apps.category);
        const apps = data.apps;

        // Sort apps by is_new and clicks
        apps.sort((a, b) => {
            if (a.is_new === "True" && b.is_new === "False") {
                return -1;
            } else if (a.is_new === "False" && b.is_new === "True") {
                return 1;
            } else {
                return b.clicks - a.clicks;
            }
        });

        // Create checkboxes for each category and sort
        apps.forEach(app => {
            if (!categories.includes(app.category)) {
                categories.push(app.category);
            }
        });
        categories.sort();

        // Create checkboxes for each category
        categories.forEach(category => {
            const column = document.createElement("div");
            column.className = "col col-auto";

            const formCheck = document.createElement("div");
            formCheck.className = "form-check form-switch";

            const input = document.createElement("input");
            input.className = "form-check-input";
            input.type = "checkbox";
            input.id = category;
            input.value = category;

            const label = document.createElement("label");
            label.className = "form-check-label";
            label.setAttribute("for", category);
            label.innerHTML = category;

            formCheck.appendChild(input);
            formCheck.appendChild(label);
            column.appendChild(formCheck);
            checkboxContainer.appendChild(column);

            /*
            Check the checkbox if the category is in the local storage.
            Otherwise, add it to the local storage and check it.
             */
            if (localStorage.getItem(category) === null) {
                localStorage.setItem(category, "checked");
                input.checked = true;
            }
            input.checked = localStorage.getItem(category) === "checked";

            // Filter apps by category
            filteredApps = filter_by_category(apps);

            // Add event listener to checkboxes
            input.addEventListener("change", function () {
                if (input.checked) {
                    localStorage.setItem(category, "checked");
                } else {
                    localStorage.setItem(category, "unchecked");
                }
                filteredApps = filter_by_category(apps);
                drawCards(filteredApps);
            });
        });

        // Add event listener to search input
        searchInput.addEventListener("input", function () {
            const searchValue = searchInput.value.toLowerCase();
            filteredApps = filter_by_category(apps);
            filteredApps = filteredApps.filter(app => {
                app.abbreviation = String(app.abbreviation);
                return app.name.toLowerCase().includes(searchValue) || app.abbreviation?.toLowerCase().includes(searchValue);
            });
            drawCards(filteredApps);
        });

        // Draw cards
        drawCards(filteredApps);

    }).catch(error => {
        console.error(error);
    });
});