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


document.querySelector(" .lookup-button").addEventListener("click", async () => {
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
        