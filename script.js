// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Update charge slider values
function updateChargeValue(type, value) {
    document.getElementById(type + 'ChargeValue').textContent = value;
}

// Calculate EV vs Gas comparison
function calculateComparison() {
    const gasPrice = parseFloat(document.getElementById('gasPrice').value);
    const mpg = parseFloat(document.getElementById('mpg').value);
    const electricityRate = parseFloat(document.getElementById('electricityRate').value);
    const evEfficiency = parseFloat(document.getElementById('evEfficiency').value);
    const milesPerYear = parseFloat(document.getElementById('milesPerYear').value);

    // Calculate costs
    const gasCostPerMile = gasPrice / mpg;
    const evCostPerMile = electricityRate / evEfficiency;

    const annualGasCost = gasCostPerMile * milesPerYear;
    const annualEVCost = evCostPerMile * milesPerYear;
    const annualSavings = annualGasCost - annualEVCost;
    const fiveYearSavings = annualSavings * 5;

    // Display results
    const resultDiv = document.getElementById('comparisonResult');

    if (annualSavings > 0) {
        resultDiv.innerHTML = `
            <h4>You'll save money! 🎉</h4>
            <p><strong>Gas car costs:</strong> <span class="cost">$${annualGasCost.toFixed(2)}/year</span></p>
            <p>That's $${gasCostPerMile.toFixed(3)} per mile</p>

            <p style="margin-top: 1rem;"><strong>EV costs:</strong> <span class="cost">$${annualEVCost.toFixed(2)}/year</span></p>
            <p>That's $${evCostPerMile.toFixed(3)} per mile</p>

            <div class="savings">Save $${annualSavings.toFixed(2)}/year</div>
            <p style="text-align: center; margin-top: 0.5rem; color: var(--success); font-weight: 600;">
                $${fiveYearSavings.toFixed(2)} over 5 years
            </p>
        `;
    } else {
        const annualExtra = Math.abs(annualSavings);
        const fiveYearExtra = annualExtra * 5;
        resultDiv.innerHTML = `
            <h4>An EV will cost more to run</h4>
            <p><strong>Gas car:</strong> <span class="cost">$${annualGasCost.toFixed(2)}/year</span></p>
            <p><strong>EV:</strong> <span class="cost">$${annualEVCost.toFixed(2)}/year</span></p>

            <div class="savings" style="color: #ef4444;">Extra $${annualExtra.toFixed(2)}/year</div>
            <p style="text-align: center; margin-top: 0.5rem; color: #ef4444; font-weight: 600;">
                $${fiveYearExtra.toFixed(2)} over 5 years
            </p>
        `;
    }

    resultDiv.classList.add('show');
}

// Calculate charging time and cost
function calculateCharging() {
    const batteryCapacity = parseFloat(document.getElementById('batteryCapacity').value);
    const currentCharge = parseFloat(document.getElementById('currentChargeSlider').value);
    const targetCharge = parseFloat(document.getElementById('targetChargeSlider').value);
    const chargerPower = parseFloat(document.getElementById('chargerPower').value);
    const chargingCost = parseFloat(document.getElementById('chargingCost').value);

    // Validate
    if (targetCharge <= currentCharge) {
        alert('Target charge must be higher than current charge');
        return;
    }

    // Calculate energy needed
    const chargeNeeded = (targetCharge - currentCharge) / 100;
    const energyNeeded = batteryCapacity * chargeNeeded;

    // Calculate time (with 90% efficiency)
    const chargingEfficiency = 0.9;
    const actualEnergyNeeded = energyNeeded / chargingEfficiency;
    const chargingTimeHours = actualEnergyNeeded / chargerPower;
    const chargingTimeMinutes = chargingTimeHours * 60;

    // Calculate cost
    const totalCost = actualEnergyNeeded * chargingCost;

    // Format time
    let timeString;
    if (chargingTimeHours >= 1) {
        const hours = Math.floor(chargingTimeHours);
        const minutes = Math.round((chargingTimeHours - hours) * 60);
        timeString = `${hours}h ${minutes}m`;
    } else {
        timeString = `${Math.round(chargingTimeMinutes)} min`;
    }

    // Display results
    const resultDiv = document.getElementById('chargingResult');
    resultDiv.innerHTML = `
        <h4>Charging Summary ⚡</h4>
        <p><strong>Charge ${currentCharge}% → ${targetCharge}%</strong></p>
        <p>Energy needed: ${energyNeeded.toFixed(1)} kWh</p>

        <div class="savings">${timeString}</div>
        <p style="text-align: center; margin-top: 0.5rem; font-size: 1.3rem; font-weight: 700; color: var(--primary);">
            $${totalCost.toFixed(2)}
        </p>

        <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-light); text-align: center;">
            At ${chargerPower}kW @ $${chargingCost}/kWh
        </p>
    `;
    resultDiv.classList.add('show');
}

// Allow Enter key to trigger calculations
document.addEventListener('DOMContentLoaded', function() {
    const comparisonInputs = ['gasPrice', 'mpg', 'electricityRate', 'evEfficiency', 'milesPerYear'];
    comparisonInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') calculateComparison();
            });
        }
    });

    const chargingInputs = ['batteryCapacity', 'chargerPower', 'chargingCost'];
    chargingInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') calculateCharging();
            });
        }
    });
});
