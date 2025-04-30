
  // STOCK LINE GRAPH
  async function getStocks(ticker, from, to) {
    const apiKey = 'LNy7bGDnkJrFALQ5b65lAAgKu7MpAtpZ';
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;
    return fetch(url)
      .then(res => res.json())
      .then(data => data.results || [])
      .catch(() => []);
  }


let ctx; 
let chartInstance = null; 


document.addEventListener('click', () => {
    ctx = document.getElementById('myChart').getContext('2d');

});


function renderChart(labels, data, ticker) {
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Stock Price`,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                    }
                }
            }
        }
    });
}

// Event listener for lookup button


document.querySelector(".lookup-button").addEventListener("click", async () => {
    const ticker = document.getElementById("stockInput").value.toUpperCase();
    const days = parseInt(document.getElementById("timeFrame").value);
    const to = '2025-04-23'; // Fixed end date

    // Calculate 'from' date 
    const toDate = new Date(to);
    const fromDate = new Date(toDate);
    fromDate.setDate(toDate.getDate() - days);
    const from = fromDate.toISOString().split('T')[0];

    // get stock data
    const stockData = await getStocks(ticker, from, to);

    if (stockData.length > 0) {
        // Extract dates and closing prices
        const labels = stockData.map(item => {
            const date = new Date(item.t);
            return date.toISOString().split('T')[0];
        });
        const prices = stockData.map(item => item.c);

        // Render chart
        renderChart(labels, prices, ticker);
    } else {
        alert('No data found for the given ticker or date range.');
    }
});



// top five stocks table

async function getFiveStocks() {
    const res = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
    const data = await res.json();
  
    const topFive = data
      .sort((a, b) => b.no_of_comments - a.no_of_comments)
      .slice(0, 5);
  
    let html = `
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Ticker</th>
            <th># of Comments</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    topFive.forEach(stock => {
        const tickerLink = `https://finance.yahoo.com/quote/${stock.ticker}`;
        const sentimentImage = stock.sentiment.toLowerCase() === 'bullish' 
        ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ05bLmmt-qNXtPRRsu9aatIJmeYcZXuGoTeQ&s'
        : 'https://investmentu.com/wp-content/uploads/2022/03/bearish-stocks.jpg'; 

        html += `
    <tr>
      <td><a href="${tickerLink}" target="_blank">${stock.ticker}</a></td>
      <td>${stock.no_of_comments}</td>
      <td><img src="${sentimentImage}" alt="${stock.sentiment}" width="100" height="100"></td>
    </tr>
  `;
});
    
      html += `</tbody></table>`;
    
      const tableDiv = document.getElementById("stockTable");
      if (tableDiv) {
        tableDiv.innerHTML = html;
      } else {
        console.error("Element with ID 'stockTable' not found.");
      }
    }
  
  getFiveStocks();

        //  dog breed lookup
          let breedMap = {};
        
          function showBreedInfo(breed) {
            const infoDiv = document.getElementById('breedInfo');
            infoDiv.classList.remove('hidden');
        
            const { name, description, life } = breed.attributes;
            const minLife = life.min;
            const maxLife = life.max;
        
            infoDiv.innerHTML = `
              <h2>${name}</h2>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Min Life:</strong> ${minLife}</p>
              <p><strong>Max Life:</strong> ${maxLife}</p>
            `;
          }
        
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
              'hello': function () {
                alert('Hello world!');
              },
            //   color
              'change the color to *color': function (color) {
                document.body.style.backgroundColor = color;
              },
            //   navigate
              'navigate to *page': function (page) {
                const target = page.toLowerCase().trim();
                if (pages[target]) {
                  window.location.href = pages[target];
                }
              },
            //   dog breed
              'load dog breed *breedName': function (breedName) {
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
    