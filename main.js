const btn = document.getElementById("btn");
const searchInput = document.getElementById("search");
const movieContainer = document.getElementById("movieContainer");
const form = document.querySelector("form");

async function getData() {
    const searchedMovie = searchInput.value.trim();
    movieContainer.innerHTML = ""; // Clear previous search results

    const storedData = getFromLocalStorage(searchedMovie);

    if (storedData) {
        const defaultCard = createCard(storedData);
        movieContainer.appendChild(defaultCard);
    } else {
        try {
            let url = "http://localhost/php/Movie_Prototype3/data.php";

            if (searchedMovie) {
                url += `?t=${searchedMovie}`;
            }

            const response = await fetch(url);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            if (data.error) {
                displayErrorMessage("Movie is not stored in the database yet.");
                displayErrorMessage("Please try reloading the page.");
            } else {
                displayMovieData(data);
            }

        } catch (error) {
            console.error(error);
            displayErrorMessage("An error occurred while fetching data.");
        }
    }
}

function displayMovieData(data) {
    for (let i = 0; i < data.length; i++) {
        const card = createCard(data[i]);
        movieContainer.appendChild(card);
    }
}

function displayErrorMessage(message) {
    const errorMessage = document.createElement("h1");
    errorMessage.innerHTML = message;
    movieContainer.appendChild(errorMessage);
}

function createCard(data) {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h1");
    title.className = "title";
    title.innerHTML = data.title;
    card.appendChild(title);

    const genre = document.createElement("h6");
    genre.className = "genre";
    genre.innerHTML = data.genre;
    card.appendChild(genre);

    const image = document.createElement("img");
    image.className = "image";
    image.src = data.Poster === "N/A" ? "placeholder-image.jpg" : data.poster;
    card.appendChild(image);

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.innerHTML = data.rating ? `IMDb Rating: ${data.rating}` : "Rating not available";
    card.appendChild(rating);


    const year = document.createElement("p");
    year.className = "year";
    year.innerHTML = `Year: ${data.year}`;
    card.appendChild(year);

    storeInLocalStorage(data.title, data);

    return card;
}

// btn.addEventListener("click", getData);

getData();

form.addEventListener("submit", function (event) {
    event.preventDefault();
    // updateURL();
    getData();
    saveInDatabase(searchInput.value.trim());
    setTimeout(() => {
        getData();
    }, 3000);
})

// function updateURL() {
//     const searchedMovie = searchInput.value.trim();
//     const newURL = window.location.href.split('?')[0] + `?t=${searchedMovie}`;
//     window.history.pushState({ path: newURL }, '', newURL);
// }

async function saveInDatabase(movieName) {
    const response = await fetch(`insert.php?t=${movieName}`);
    const data = await response.json();
    console.log(data);
}

function storeInLocalStorage(searchedMovie, movieDetails) {
    localStorage.setItem(searchedMovie, JSON.stringify(movieDetails));
}

function getFromLocalStorage(movieName) {
    const storedData = localStorage.getItem(movieName);
    if (storedData) {
        return JSON.parse(storedData);
    } else {
        console.log("MovieData not in Local storage");
    }
}