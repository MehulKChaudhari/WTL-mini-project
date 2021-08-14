const addMovie = document.getElementById("add-modal");
const displayMovieModal = document.getElementById("button-displayModal");
const backdrop = document.getElementById("backdrop");
const cancelModalButton = addMovie.querySelector(".btn--passive");
const addMovieButton = addMovie.querySelector(".btn--success");
const userInputs = addMovie.querySelectorAll("input");
const emptyList = document.getElementById("entry-text");
const movieList = document.getElementById("movie-list");
const deleteMovieModal = document.getElementById("delete-modal");

var movies = [];
const deleteMoviefromBackend = async (_id) => {
  try {
    const response = await axios.delete(`http://localhost:3001/post/` + _id);
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};
const getDatafromBackend = async () => {
  try {
    const response = await axios.get(`http://localhost:3001/post`);
    movies = response.data;
    updateUI();
    movies.forEach((element) => {
      console.log({ element });
      renderNewMovie(
        element._id,
        element.movie_title,
        element.image_URL,
        element.rating
      );
    });
    return response.data;
  } catch (errors) {
    console.error(errors);
  }
};
getDatafromBackend();
function updateUI() {
  if (movies.length === 0) {
    emptyList.style.display = "block";
  } else {
    emptyList.style.display = "none";
  }
}
function deleteMovie(movieID) {
  let movieIndex = 0;
  for (var movie of movies) {
    if (movie._id === movieID) {
      break;
    }
    movieIndex++;
  }
  movies.splice(movieIndex, 1);
  movieList.children[movieIndex].remove();
  closeDeleteMovie();
  updateUI();
  deleteMoviefromBackend(movieID);
}
function cancelMovieDeletion() {
  deleteMovieModal.classList.remove("visible");
}
function closeDeleteMovie() {
  deleteMovieModal.classList.remove("visible");
  toggleBackdrop();
}
function deleteMoviehandler(_id) {
  deleteMovieModal.classList.add("visible");
  toggleBackdrop();
  const cancelDelete = deleteMovieModal.querySelector(".btn--passive");
  let confirmDelete = deleteMovieModal.querySelector(".btn--danger");
  confirmDelete.replaceWith(confirmDelete.cloneNode(true));
  confirmDelete = deleteMovieModal.querySelector(".btn--danger");
  cancelDelete.removeEventListener("click", closeDeleteMovie);

  cancelDelete.addEventListener("click", closeDeleteMovie);
  confirmDelete.addEventListener("click", deleteMovie.bind(null, _id));
}

function renderNewMovie(_id, title, imgURL, rating) {
  var newMovieElement = document.createElement("li");
  newMovieElement.className = "movie-element";
  newMovieElement.innerHTML = `<div class="movie-element__image">
  <img src="${imgURL}" alt="${title}">
  </div>
  <div class="movie-element__info">
  <h2>${title}</h2>
  <p>${rating}/5 stars</p>
  </div>`;
  newMovieElement.addEventListener("click", deleteMoviehandler.bind(null, _id));
  movieList.appendChild(newMovieElement);
}

function toggleBackdrop() {
  backdrop.classList.toggle("visible");
}
function closeMovieModal() {
  addMovie.classList.remove("visible");
  toggleBackdrop();
}
function showMovieModal() {
  addMovie.classList.add("visible");
  toggleBackdrop();
}
function bdClickHandler() {
  closeMovieModal();
  cancelMovieDeletion();
  clearInput();
}
function cancelAddMovie() {
  closeMovieModal();
  clearInput();
}
function clearInput() {
  for (var usrInp of userInputs) {
    usrInp.value = "";
  }
}

function movieInput() {
  const title = userInputs[0].value;
  const img_URL = userInputs[1].value;
  const rating = userInputs[2].value;
  if (
    title.trim() === "" ||
    img_URL.trim() === "" ||
    rating.trim() === "" ||
    parseInt(rating) < 1 ||
    parseInt(rating) > 5
  ) {
    alert("Invalid input, please try again");
    return;
  }
  const newMovie = {
    _id: Math.random().toString(),
    movie_title: title,
    image_URL: img_URL,
    rating: rating,
  };
  movies.push(newMovie);
  closeMovieModal();
  clearInput();
  updateUI();
  const post = async () => {
    try {
      const postData = await axios.post("http://localhost:3001/post", newMovie);
      movies = postData.data;
      location.reload();
      renderNewMovie(
        newMovie._id,
        newMovie.movie_title,
        newMovie.image_URL,
        newMovie.rating
      );
      
      return postData.data;
    } catch (err) {
      console.error(err);
    }
  };
  post();
}
displayMovieModal.addEventListener("click", showMovieModal);
backdrop.addEventListener("click", bdClickHandler);
cancelModalButton.addEventListener("click", cancelAddMovie);
addMovieButton.addEventListener("click", movieInput);
