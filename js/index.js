// /* 
// <tr>
//   <td>ALBUM NAME HERE</td>
//   <td>RELEASE DATE HERE</td>
//   <td>ARTIST NAME HERE</td>
//   <td>GENRE HERE</td>
//   <td>AVERAGE RATING HERE</td>
//   <td>NUMBER OF RATINGS HERE</td>
// </tr> 
// */


let albumStore;

document.querySelector('#album-search-form').addEventListener('submit', onFilterRequest);

async function appInit() {
  const response = await fetch('public/data/albums.json');
  const albumData = await response.json();
  albumStore = [...albumData];

  // Initial rendering
  render(albumStore, document.querySelector('#album-rows'));
}

appInit();

function onFilterRequest(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const textQuery = formData.get('search').trim().toLowerCase();
  const ratingQuery = parseFloat(formData.get('min-album-rating').trim());

  const textResults = textFilter(albumStore, textQuery);
  const ratingResults = ratingFilter(albumStore, ratingQuery);

  const filteredData = textResults && ratingResults 
  ? textResults.filter(album => ratingResults.includes(album)) 
  : textResults || ratingResults;

  render(filteredData, document.querySelector('#album-rows'));
}

function textFilter(data, query) {
  // If no text query provided, return null
  if (!query) return null;

  const filteredData = data.filter(album => 
    album.album.toLowerCase().includes(query) || 
    album.artistName.toLowerCase().includes(query)
  );
  
  // Return null if no search results found
  return filteredData.length > 0 ? filteredData : null;
}

function ratingFilter(data, minRating) {
  // If no rating number provided, return null
  if (isNaN(minRating)) return null;

  const filteredData = data.filter(album => album.averageRating >= minRating);

  // Return null if no search results found
  return filteredData.length > 0 ? filteredData : null;
}

function render(data, container) {
  // Clear previous content
  container.innerHTML = '';

  if (!data || data.length === 0) {
    container.innerHTML = '<tr><td colspan="6">No search results found.</td></tr>';
  } else {
    data.forEach((album) => {
      const template = `
      <tr>
        <td>${album.album}</td>
        <td>${album.releaseDate}</td>
        <td>${album.artistName}</td>
        <td>${album.genres}</td>
        <td>${album.averageRating}</td>
        <td>${album.numberRatings}</td>
      </tr> 
      `;
      container.insertAdjacentHTML('beforeend', template);
    });
  }
}
