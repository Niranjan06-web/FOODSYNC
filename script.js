// FOODSYNC DEMO LOGIN
function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("loginMessage");

    if (username === "judge" && password === "FoodSync@123") {
        sessionStorage.setItem("foodsyncLoggedIn", "true");
        message.style.color = "#35e69a";
        message.innerText = "Login successful! Opening dashboard...";

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 700);
    } else {
        message.style.color = "#ff7777";
        message.innerText = "Invalid username or password!";
    }
}

// SHOW / HIDE PASSWORD
function togglePassword() {
    let password = document.getElementById("password");
    let button = document.querySelector(".show-btn");

    if (password.type === "password") {
        password.type = "text";
        button.innerText = "Hide";
    } else {
        password.type = "password";
        button.innerText = "Show";
    }
}

// LOGOUT
function logout() {
    sessionStorage.removeItem("foodsyncLoggedIn");
    window.location.href = "login.html";
}

// FOOD SURPLUS CALCULATOR
function calculateSurplus(prepared, sold) {
    return prepared - sold;
}

function showSurplus() {
    let prepared = Number(document.getElementById("prepared").value);
    let sold = Number(document.getElementById("sold").value);
    let result = document.getElementById("result");

    if (
        document.getElementById("prepared").value === "" ||
        document.getElementById("sold").value === "" ||
        prepared <= 0 ||
        sold < 0 ||
        sold > prepared
    ) {
        result.innerText = "Please enter valid meal quantities!";
        return;
    }

    let surplus = calculateSurplus(prepared, sold);
    result.innerText = "Available Surplus: " + surplus + " Meals";
}

// SENSOR VALIDATION DEMO
let previousSensorReading = null;

function checkSensor(value) {
    if (value.trim() === "") {
        return "Warning: Missing sensor data!";
    }

    let reading = Number(value);

    if (!Number.isFinite(reading) || reading < 0) {
        return "Invalid sensor reading!";
    }

    if (reading > 50) {
        return "Warning: Unusual temperature reading!";
    }

    if (reading === previousSensorReading) {
        return "Warning: Repeated sensor reading!";
    }

    previousSensorReading = reading;
    return "Sensor reading looks normal!";
}

function testTemperature() {
    let temperature = document.getElementById("temperature").value;
    document.getElementById("sensorResult").innerText =
        checkSensor(temperature);
}

function testMissingData() {
    document.getElementById("missingResult").innerText =
        "⚠️ Warning: Sensor data is missing!";
}

// FOOD REDISTRIBUTION
function markCollected() {
    document.getElementById("distributionStatus").innerText = "Collected";
    document.getElementById("distributionStatus").className = "status good";

    document.getElementById("collectionStatus").innerText =
        "✅ Food successfully marked as collected!";
}

// ANIMATED DASHBOARD NUMBERS
document.addEventListener("DOMContentLoaded", function () {
    let counters = document.querySelectorAll(".counter");

    counters.forEach(function (counter) {
        let target = Number(counter.dataset.target);
        let current = 0;
        let increment = Math.ceil(target / 50);

        let timer = setInterval(function () {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            counter.innerText = current;
        }, 25);
    });
});
let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];

function addFoodItem() {
    const name = document.getElementById("foodName").value.trim();
    const prepared = Number(document.getElementById("foodPrepared").value);
    const sold = Number(document.getElementById("foodSold").value);

    const message = document.getElementById("foodMessage");

    if (!name || !Number.isSafeInteger(prepared) ||
        !Number.isSafeInteger(sold) || prepared <= 0 ||
        sold < 0 || sold > prepared) {
        message.textContent = "Please enter valid quantities!";
        return;
    }

    const existing = foodItems.find(
        item => item.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
        existing.prepared = prepared;
        existing.sold = sold;
    } else {
        foodItems.push({ name, prepared, sold });
    }

    localStorage.setItem("foodItems", JSON.stringify(foodItems));

    document.getElementById("foodName").value = "";
    document.getElementById("foodPrepared").value = "";
    document.getElementById("foodSold").value = "";

    message.textContent = "Food added successfully!";
    displayFoodItems();
}

function displayFoodItems() {
    const list = document.getElementById("foodList");
    if (!list) return;

    list.innerHTML = "";

    let preparedTotal = 0;
    let soldTotal = 0;
    let surplusTotal = 0;

    foodItems.forEach(item => {
        const surplus = item.prepared - item.sold;

        preparedTotal += item.prepared;
        soldTotal += item.sold;
        surplusTotal += surplus;

        const row = document.createElement("p");
        row.style.padding = "12px";
        row.style.margin = "10px 0";
        row.style.background = "#123c2b";
        row.style.borderRadius = "10px";

        row.textContent =
            item.name + " | Prepared: " + item.prepared +
            " | Sold: " + item.sold +
            " | Surplus: " + surplus;

        list.appendChild(row);
    });

    document.getElementById("totalPrepared").textContent = preparedTotal;
    document.getElementById("totalSold").textContent = soldTotal;
    document.getElementById("totalSurplus").textContent = surplusTotal;
}

displayFoodItems();
function updateFoodPrediction() {

    const foods = JSON.parse(localStorage.getItem("foodItems")) || [];

    let prepared = 0;
    let sold = 0;

    foods.forEach(food => {
        prepared += Number(food.prepared);
        sold += Number(food.sold);
    });

    // Use recorded sales as the demand estimate
    const demand = sold;
    const recommended = demand;
    const surplus = prepared - sold;

    const demandElement = document.getElementById("expectedDemand");
    const recommendedElement = document.getElementById("recommendedPreparation");
    const surplusElement = document.getElementById("estimatedSurplus");

    if (demandElement) demandElement.textContent = demand + " Meals";
    if (recommendedElement) recommendedElement.textContent = recommended + " Meals";
    if (surplusElement) surplusElement.textContent = surplus + " Meals";
}

updateFoodPrediction();