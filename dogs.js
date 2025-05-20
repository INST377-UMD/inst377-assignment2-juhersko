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




// Load dog breed buttons 
async function loadBreedsButtons() {
    const res = await fetch('https://dogapi.dog/api/v2/breeds');
    const data = await res.json();
    const breeds = data.data;
    const buttonContainer = document.getElementById('breedButtons');

    breeds.forEach(breed => {
      const breedName = breed.attributes.name.toLowerCase();
      breedMap[breedName] = breed;

      const button = document.createElement('button');
      button.textContent = breed.attributes.name;
      button.setAttribute('class', 'breed-button');

      button.addEventListener('click', () => {
        showBreedInfo(breed);
      });

      buttonContainer.appendChild(button);
    });
  }

  // Turn voice listening on
  function turnOnListening() {
    if (annyang) {
      annyang.start();
    }
  }

  // Turn voice listening off
  function turnOffListening() {
    if (annyang) {
      annyang.abort();
    }
  }

  // Set up voice commands
  if (annyang) {
    const pages = {
      stocks: "stocks.html",
      dogs: "dogs.html",
      home: "home.html"
    };
//  hello
    const commands = {
      'hello':  () => {
        alert('Hello world!');
      },
    //   color
      'change the color to *color':  (color) => {
        document.body.style.backgroundColor = color;
      },
    //   navigate
      'navigate to *page':  (page) => {
        const target = page.toLowerCase().trim();
        if (pages[target]) {
          window.location.href = pages[target];
        }
      },
    //   dog breed
      'load dog breed *breedName':  (breedName) => {
        const name = breedName.toLowerCase().trim();
        if (breedMap[name]) {
          showBreedInfo(breedMap[name]);
        }
      }
    };

    annyang.addCommands(commands);
    annyang.start();
  }

  loadBreedsButtons();

  