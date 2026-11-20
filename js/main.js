import { getCreatures, getCreature, createCreature } from "./api.js";
import { validateCreature } from "./rules.js";
import { affichage, showDetails, hideDetails, showEmpty, showError, showLoading, showDetailError, showDetailLoading, showFormErrors, showFormMessage} from "./ui.js";
import { storeFilter, getStoreTypes, saveDraft, getDraft, clearDraft } from "./storage.js";
import { async } from "postcss-js";

let currentType = getStoreTypes()
let currentQuery = ""
let lastAction = null
let isLoading = false

const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search")
const clearBtn = document.getElementById("clear-btn")
const sortSelect = document.getElementById("sort")
const grid = document.getElementById("grid")
const detailClose = document.getElementById("detail-close")
const form = document.getElementById("creature-form")
const submitBtn = form.querySelector('button[type="submit"]')


async function refresh() {
    lastAction = refresh()
    showLoading()

    const params = new URLSearchParams()
    if (currentType !== "all") {
        params.set("type", currentType)
    }
    if (currentQuery !== "") {
        params.set("q", currentQuery)
    }
    const sortParts = sortSelect.value.split("/")
    params.set("_sort", sortParts[0])
    params.set("_order", sortParts[1])

    try {
        const creatures = await getCreatures(`/creatures?${params.toString()}`)
        if (creatures.length === 0) {
            showEmpty(currentQuery)
        } else {
            affichage(creatures)
        }
    } catch (error) {
        showError(error.message)
    }
}
refresh()

const filterButtons  = document.querySelectorAll("#filters button")
filterButtons.forEach(filterBtn => {
    filterBtn.addEventListener("click", () => {
        currentType = filterBtn.dataset.type 
        storeFilter(currentType)
        refresh()
    })
})

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    currentQuery = searchInput.value.trim()
    refresh()
})

clearBtn.addEventListener("change", refresh)

async function handleCardClick(event) {
    const card = event.target.closest("article")
    if (isLoading === false && card !== null) {
        isLoading = true
        showDetailLoading()
        try {
            const creature = await getCreature(card.dataset.id)
            showDetails(creature)
        } catch (error) {
            if (error.message.includes("404")) {
                showDetailError("Créature introuvable")
            } else {
                showDetailError(error.message)
            }
        } finally {
            isLoading = false
        }
    } 
}
grid.addEventListener("click", handleCardClick)
detailClose.addEventListener("click", hideDetails)

grid.addEventListener("click", (event) => {
    if (event.target.id === "retry-btn" && lastAction !== null) {
        lastAction()
    }
})

const draft = getDraft()
if (draft !== null){
    for (const name in draft) {
        if (form.elements[name]) {
            form.elements[name].value = draft[name]
        }
    }
} 
form.addEventListener("input", () => {
    saveDraft(Object.fromEntries(new FormData(form)))
})
form.addEventListener("reset", clearDraft)

form.addEventListener
