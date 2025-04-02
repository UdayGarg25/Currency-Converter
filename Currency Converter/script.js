const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";

const dropDownS = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropDownS) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    console.log(currCode);
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);

    // Validate the amount
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    console.log("Amount:", amtVal);
    console.log("From Currency:", fromCurr.value, "To Currency:", toCurr.value);
    
    // Construct the URL to fetch exchange rates
    const URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurr.value.toLowerCase()}.json`;

    try {
        // Fetch data from the API
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Error fetching the data');
        } 

        let data = await response.json();
        console.log("API Response Data:", data);  // Log the entire response to check its structure
        
        // If the API response has a 'rates' object inside USD (adjust based on actual structure)
        let rate;
        if (data[fromCurr.value.toLowerCase()] && data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]) {
            rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        } else {
            // Handle the case where the rate doesn't exist
            console.error("Rate not found for selected currencies");
            msg.innerText = "Rate not found for selected currencies";
            return;
        }

        console.log("Exchange Rate:", rate);
        
        // Calculate the final converted amount
        let finalAmount = amtVal * rate;
        console.log("Converted Amount:", finalAmount);

        // Display the result in the message box
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error:", error);
        msg.innerText = "Failed to fetch conversion rate";
    }
});
