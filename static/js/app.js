const appUrl = "/app/apps";
const checkboxContainer = document.getElementById("checkbox-container");
const searchInput = document.getElementById("search-input");
const appContainer = document.getElementById("app-container");

let filteredApps = [];
let categories = [];


/*
This function adds a click event listener to all elements with the data-hide attribute.
When a click event is detected, the closest element with a class matching the hideClass is hidden.
*/
const hideListener = () => {
    // Get all elements with the data-hide attribute
    const elements = document.querySelectorAll("[data-hide]");
    elements.forEach(element => {
        // Add a click event listener to each element
        element.addEventListener("click", () => {
            // Get the hide class from the data-hide attribute
            const hideClass = element.dataset.hide;
            // Get the closest element with the hide class
            const closestElement = element.closest(`.${hideClass}`);
            // Hide the element
            closestElement.style.display = "none";
        });
    });
};


/* Display all alerts */
const displayAlerts = () => {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach(alert => alert.style.display = "block");
};

/*
Sort the apps by user favorite, the number of clicks and the newness.
Then create the categories array and sort. The categories array is used to create the checkboxes.
 */
const sequencer = apps => {
    apps.sort((appA, appB) => {
        // Sort by favorites
        if (localStorage.getItem(appA.id) === "true" && localStorage.getItem(appB.id) === "false") return -1;
        if (localStorage.getItem(appA.id) === "false" && localStorage.getItem(appB.id) === "true") return 1;

        // Sort by newness
        if (appA.is_new === "True" && appB.is_new === "False") return -1;
        if (appA.is_new === "False" && appB.is_new === "True") return 1;

        // Sort by clicks
        return appB.clicks - appA.clicks;
    });
    apps.forEach(app => {
        if (!categories.includes(app.category)) {
            categories.push(app.category);
        }
    });
    categories.sort();
};

const drawCard = app => {
    // create elements
    const column = document.createElement("div"), card = document.createElement("div"),
        cardBody = document.createElement("div"), star = document.createElement("i"),
        fullStar = document.createElement("i"), cardFavButton = document.createElement("div"),
        cardSubtitle = document.createElement("p"), cardTitle = document.createElement("h3"),
        cardText = document.createElement("p"), cardLink = document.createElement("a"),
        cardBadge = document.createElement("span");

    // set classes
    star.className = "bi bi-star";
    fullStar.className = "bi bi-star-fill";
    cardFavButton.id = app.id;
    cardFavButton.className = "card-fav";
    column.className = "col";
    card.className = "card rounded-0";
    cardBody.className = "card-body";
    cardSubtitle.className = "card-subtitle text-muted small mb-4";
    cardTitle.className = "card-title";
    cardText.className = "card-text";
    cardLink.className = "card-link stretched-link";
    cardBadge.className = "position-absolute top-0 start-100 translate-end badge rounded-pill bg-danger";

    // set text
    cardSubtitle.textContent = app.category;
    cardTitle.textContent = app.name;
    cardText.textContent = app.description;
    cardBadge.textContent = "Yeni";

    // set other properties
    cardLink.href = "/app/" + app.id + "/click";
    cardLink.target = "_blank";
    localStorage.getItem(app.id) === null && localStorage.setItem(app.id, "false");
    cardFavButton.appendChild(localStorage.getItem(app.id) === "true" ? fullStar : star);
    app.is_new === "True" ? card.appendChild(cardBadge) : null;

    // append to DOM
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardLink);
    card.appendChild(cardBody);
    card.appendChild(cardFavButton);
    column.appendChild(card);
    appContainer.appendChild(column);

    return {star, fullStar, cardFavButton};
};

/*
This function builds the cards for the apps. It also adds a click event listener to each card favorite button.
When a click event is detected, the app is added to or removed from favorites. Then the apps are re-sequenced and
the cards are re-built.
*/
const buildCards = apps => {
    // clear the app container
    appContainer.textContent = "";

    apps.forEach(app => {
        // draw the card for this app
        const {star, fullStar, cardFavButton} = drawCard(app);

        cardFavButton.addEventListener("click", () => {
            // if the app is already a favorite, remove it from favorites
            if (localStorage.getItem(app.id) === "true") {
                localStorage.setItem(app.id, "false");
                cardFavButton.textContent = "";
                cardFavButton.appendChild(star);
            } else {
                // otherwise, add it to favorites
                localStorage.setItem(app.id, "true");
                cardFavButton.textContent = "";
                cardFavButton.appendChild(fullStar);
            }
            // re-sequence the apps and re-build the cards
            sequencer(apps);
            buildCards(apps);
        });
    })
};

/*
This function builds the checkboxes for the categories. It also adds a click event listener to each checkbox.
When a click event is detected, the category is added to or removed from localStorage.
Then the apps are re-sequenced and the cards are re-built.
*/
const buildCategories = apps => {
    categories.forEach(category => {
        // Create the checkbox
        const formCheck = document.createElement("div");
        formCheck.className = "form-check form-switch";

        // Create the input
        const input = document.createElement("input");
        input.className = "form-check-input";
        input.type = "checkbox";
        input.id = category;
        input.value = category;

        // Create the label
        const label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = category;
        label.textContent = category;

        // Append the input and label to the formCheck div
        formCheck.appendChild(input);
        formCheck.appendChild(label);
        checkboxContainer.appendChild(formCheck);

        // If the category is not in localStorage, set it to 'checked'
        if (localStorage.getItem(category) === null) {
            localStorage.setItem(category, "checked");
            input.checked = true;
        }
        input.checked = localStorage.getItem(category) === "checked";

        // Filter the apps by the categories that are checked
        filteredApps = apps.filter(app => localStorage.getItem(app.category) === "checked");

        // When a category is checked or unchecked, update the localStorage and the UI
        input.addEventListener("change", () => {
            localStorage.setItem(category, input.checked ? "checked" : "unchecked");
            filteredApps = apps.filter(app => localStorage.getItem(app.category) === "checked");
            buildCards(filteredApps);
        });
    });
}

window.addEventListener("load", () => {
    hideListener();
    searchInput.focus();

    fetch(appUrl)
        .then(response => response.json())
        .then(data => {
            data.apps = Array.from(data.apps);
            data.apps.name = String(data.apps.name);
            data.apps.description = String(data.apps.description);
            data.apps.category = String(data.apps.category);
            data.apps.url = String(data.apps.url);
            data.apps.is_new = String(data.apps.is_new);
            data.apps.clicks = Number(data.apps.clicks);
            data.apps.id = Number(data.apps.id);
            const apps = data.apps;

            sequencer(apps);
            buildCategories(apps);
            buildCards(filteredApps);

            // This function filters the apps based on the search input value
            searchInput.addEventListener("input", () => {
                const searchValue = searchInput.value.toLowerCase();
                filteredApps = apps.filter(app => localStorage.getItem(app.category) === "checked");
                filteredApps = filteredApps.filter(app => {
                    const name = app.name.toLowerCase().includes(searchValue);
                    const description = app.description.toLowerCase().includes(searchValue);
                    return name || description;
                });
                buildCards(filteredApps);
            });
        })
        .catch(error => console.error(error));
});