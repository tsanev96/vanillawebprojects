const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const changePages = document.querySelector('#nextPrevButtons');

const apiUrl = 'https://api.lyrics.ovh';

async function searchSongs(searchTerm) {
    const res = await fetch(`${apiUrl}/suggest/${searchTerm}`);
    const data = await res.json();

    showSongs(data);
}

async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    result.classList.add('lyrics');
    if (data.error) {
        result.innerHTML = data.error;
    } else {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        result.innerHTML = `
        <h2><strong>${artist}</strong> - ${songTitle}</h2>
        <span>${lyrics}</span>
        `;
    }

    changePages.innerHTML = '';
}

function showSongs(songs) {
    result.classList.remove('lyrics');

    result.innerHTML =
        `<ul class="songs">
    ${songs.data.map(song=>
        `<li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn"
        data-artist="${song.artist.name}" data-title="${song.title}">
        Get Lyrics
        </button>
        </li>`
    ).join('')}
    </ul>`;

    if (songs.prev || songs.next) {
        changePages.innerHTML=`
        ${
            songs.prev 
            ? `<button class="btn" onclick="changePage('${songs.prev}')">Prev</button>`
            : ''
        }
        ${
            songs.next
            ? `<button class="btn" onclick="changePage('${songs.next}')">Next</button>`
            : ''
        }
        `;
    }
    
    
        //let output = '';

        // songs.data.forEach(song => {
        //     const artist = song.artist.name;
        //     const songTitle = song.title;

        //     output += `<li>
        //  <span><strong>${artist}</strong> - ${songTitle}</span>
        //  <button class="btn"
        //  data-artist="${artist}" data-songtitle="${songTitle}">
        //   Get Lyrics
        //   </button>
        //  </li>`;
        // });

        // result.innerHTML = `<ul class="songs">
        // ${output}
        // </ul>`;
}

async function changePage(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showSongs(data);
}

form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (searchTerm) {
        searchSongs(searchTerm);
    } else {
        alert('Nothing has been typed');
    }
});

result.addEventListener('click',e=> {
const clickedEl = e.target;

if (clickedEl.tagName==='BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-title');
   
    getLyrics(artist,songTitle);
}
});