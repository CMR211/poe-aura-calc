import DB_AURAS from "./auras.js"

const character = {
    auras: [],
    mana: 1000,
    life: 1000,
    reductions: [
        { type: "aura", reduction: 20 },
        { type: "banner", reduction: 0 },
        { type: "curse", reduction: 0 },
        { type: "aspect", reduction: 0 },
        { type: "herald", reduction: 10 },
        { type: "grace", reduction: 50 },
    ],
}
const CALC_AURAS = calculateAuras()

drawAuras()
drawCharacterInfo()

function calculateAuras() {
    return DB_AURAS.map(aura => calculateAura(aura))
}

function calculateAura(aura) {
    const calculatedReservation = calculateReservation(aura)
    const calculatedAura = {
        ...aura,
        calculatedReservation,
    }
    return calculatedAura
}

function calculateTotalReduction(aura) {
    const totalReduction = character.reductions
        .filter(
            obj =>
                aura.type.some(val => val === obj.type) ||
                obj.type === aura.name.toLowerCase()
        )
        .map(obj => obj.reduction)
        .reduce((a, b) => a + b, 0)
    return totalReduction
}

function calculateReservation(aura) {
    const reduction = calculateTotalReduction(aura)
    return ceil2(aura.reservation / (1 + reduction / 100))
}

function calculateTotalReservation() {
    return character.auras.reduce(
        (prev, curr) => prev + ceil2(calculateReservation(curr)),
        0
    )
}

function drawAuras() {
    const element_auras = document.querySelector(".auras")

    CALC_AURAS.forEach(aura => {
        const {
            name,
            reservation,
            calculatedReservation,
            reservationType,
            icon,
        } = aura

        const element = document.createElement("div")
        element.classList.add("auras__item")
        element.addEventListener("click", () => handleAuraToggle(aura, element))

        element.innerHTML = `
            <div><img src="${icon}" /></div>
            <p class="auras__name">${name}</p>
            <p>Reservation: ${calculatedReservation}${
            reservationType === "flat" ? "" : "%"
        } </p>
        `

        element_auras.appendChild(element)
    })
}

function drawCharacterInfo() {
    const element_life = document.querySelector("#max-life")
    const element_mana = document.querySelector("#max-mana")
    const reservation = ceil0(
        character.auras
            .map(aura => {
                return aura.reservationType === "flat"
                    ? aura.calculatedReservation
                    : (aura.calculatedReservation * character.life) / 100
            })
            .reduce((a, b) => a + b, 0)
    )
    element_life.textContent = `${character.life - reservation} / ${
        character.life
    }`
    element_mana.textContent = `${character.mana}`
}

function handleAuraToggle(aura, element) {
    element.classList.toggle("selected")
    toggleCharacterAura(aura)
    drawCharacterInfo()
}

function toggleCharacterAura(aura) {
    if (
        character.auras.filter(charAura => charAura.id === aura.id).length > 0
    ) {
        deleteAuraFromCharacter(aura)
        return
    }
    addAuraToCharacter(aura)
}

function addAuraToCharacter(aura) {
    character.auras.push(aura)
    console.log(calculateTotalReservation())
}

function deleteAuraFromCharacter(aura) {
    character.auras = character.auras.filter(
        charAura => charAura.id !== aura.id
    )
    console.log(calculateTotalReservation())
}

function ceil(i, x) {
    return Math.ceil(i * 10 ** x) / 10 ** x
}

function ceil0(i) {
    return ceil(i, 0)
}

function ceil2(i) {
    return ceil(i, 2)
}
