// Dogs 
// keeps tthe dog a random 10, not switch every time
async function fetchDogImages() {
    const store = sessionStorage.getItem('dogImages');
    if (store) {
        return JSON.parse(store);
    }

    const response = await fetch('https://dog.ceo/api/breeds/image/random/10');
    const data = await response.json();
    sessionStorage.setItem('dogImages', JSON.stringify(data.message));
    return data.message;
}

async function setupCarousel() {
    const images = await fetchDogImages();
    const carousel = document.getElementById('dogImages');

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.alt = 'Dog';
        carousel.appendChild(imgElement);
    });

    simpleslider.getSlider();
}

// setupCarousel();
window.onload = () => {
    setupCarousel();
};


// dogs buttons 
// random 10?
// // random every time (load page)?
// async function loadBreedsButtons() {
//     const res = await fetch('https://dogapi.dog/api/v2/breeds');
//     const data = await res.json();
//     const breeds = data.data;
//     const buttonContainer = document.getElementById('breedButtons');
  
//     breeds.forEach(breed => {
//       const button = document.createElement('button');
//       button.textContent = breed.attributes.name;
//       button.setAttribute('class', 'breed-button');
      
//       button.addEventListener('click', () => {
//         showBreedInfo(breed);
//       });
  
//       buttonContainer.appendChild(button);
//     });
//   }
  
//   function showBreedInfo(breed) {
//     const infoDiv = document.getElementById('breedInfo');
//     infoDiv.classList.remove('hidden');
  
//     // grab required info from API
//     const { name, description, life } = breed.attributes;
//     const minLife = life.min;
//     const maxLife = life.max;
  
//     infoDiv.innerHTML = `
//       <h2>${name}</h2>
//       <p><strong>Description:</strong> ${description}</p>
//       <p><strong>Min Life:</strong> ${minLife} </p> 
//       <p><strong>Max Life:</strong> ${maxLife} </p>
//     `;
//   }
  
//   loadBreedsButtons();
  