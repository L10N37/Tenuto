
const artistShortlistForm = document.querySelector('#artist-form');
const artistShortlistInput = document.querySelector('#artist-input');
const artistShortlist = document.querySelector('.artist-items');
let artistName = [];
artistShortlistForm.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
  event.preventDefault();
  addArtist(artistShortlistInput.value); // call addArtist function with input box current value
});
// function to add artist
function addArtist(item) {
  // if item is not empty
  if (item !== '') {
    const artist = {
      id: Date.now(),
      name: item,
      completed: false
    };
    artistName.push(artist);
    addToLocalStorage(artistName); 
  }
}

function renderartistName(artistName) {

  artistShortlist.innerHTML = '';
  artistName.forEach(function(item) {
    const checked = item.completed ? 'checked': null;
    const li = document.createElement('li');
    // <li class="item"> </li>
    li.setAttribute('class', 'item');
    // <li class="item" data-key="20200708"> </li>
    li.setAttribute('data-key', item.id);
    if (item.completed === true) {
      li.classList.add('checked');
    }
li.innerHTML = `
      ${item.name}
      <button class="delete-button">X</button>
    `;
    artistShortlist.append(li);
  });
}
function addToLocalStorage(artistName) {
  localStorage.setItem('artistName', JSON.stringify(artistName));
  renderartistName(artistName);
}
function getFromLocalStorage() {
  const reference = localStorage.getItem('artistName');
  if (reference) {
    artistName = JSON.parse(reference);
    renderartistName(artistName);
  }
}
function toggle(id) {
  artistName.forEach(function(item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });
addToLocalStorage(artistName);
}
function deleteartist(id) {
  artistName = artistName.filter(function(item) {
    return item.id != id;
  });
  addToLocalStorage(artistName);
}
getFromLocalStorage();
artistShortlist.addEventListener('click', function(event) {
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  if (event.target.classList.contains('delete-button')) {
    deleteartist(event.target.parentElement.getAttribute('data-key'));
  }
});