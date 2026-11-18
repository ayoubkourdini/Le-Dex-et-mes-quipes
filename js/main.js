import { getCreatures } from "./api.js";
import { affichage, showDetails, hideDetails, showEmpty, showError, showLoading, showDetailError, showDetailLoading} from "./ui.js";
import { storeFilter, getStoreTypes } from "./storage.js";

let allCreatures = [];
let offset = 20;
let isLoading = false;
let lastAction = null;


let currentType = getStoreTypes();
const button = document.getElementById("chargeBtn");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const grid = document.getElementById("grid");
const detailClose = document.getElementById("detail-close");

async function loadCreatures() {
    lastAction = loadCreatures;
    showLoading();
    try{
        allCreatures = await getCreatures("/creatures");
        applyFilter();
    } catch (error) {
        showError(error.message)
    }

}
loadCreatures()

async function applyFilter() {
    currentType = getStoreTypes()
    if (currentType === "all") {
        affichage(allCreatures);
    } else {
        const filtered = await getCreatures(`/creatures?type=${currentType}`);
        console.log(filtered)
        affichage(filtered);
    }
}

button.addEventListener("click", async () => {
    const newCreature = await getCreatures(offset);
    allCreatures = [...allCreatures, ...newCreature];
    offset += 20;
    applyFilter();
})

const filterButtons = document.querySelectorAll("#filters button");
filterButtons.forEach(filterBtn => {
    filterBtn.addEventListener("click", () =>  {
        currentType = getStoreTypes()
        currentType = filterBtn.dataset.type
        storeFilter(currentType)
        applyFilter() 
    })
})

async function handleSearch (event){
    currentType = getStoreTypes()
    event.preventDefault();
    const query = searchInput.value.toLowerCase().trim()
    if (query === "") {
        return
    }
    lastAction = () => {handleSearch(event)}
    showLoading()
    searchBtn.disabled = true
    try {
        let found = []
        if (currentType === "all"){
             found = await getCreatures(`/creatures?q=${query}`);
        }else {
             found = await getCreatures(`/creatures?type=${currentType}&q=${query}`) 
        }
        console.log(found)


        affichage(found)
    } catch (error) {
        if (error.message.includes("404") === true) {
            showEmpty(query);
        } else {
            showError(error.message)
        }
    } finally {
        searchBtn.disabled = false
    }
}

function handleClear (){
    searchInput.value = "";
    applyFilter()
}

searchForm.addEventListener("submit", handleSearch);
clearBtn.addEventListener("click", handleClear)

async function handleCardClick (event) {
    const card = event.target.closest("article") 
    if (isLoading === false && card !== null) {
        isLoading = true
        try {
            showDetailLoading()
            const creature = await searchCreature(card.dataset.id)
            showDetails(creature)
        } catch (error) {
            showDetailError(error.message)
            console.error(error)
        } finally {
            isLoading = false
        }
    }
}
grid.addEventListener("click", handleCardClick)
detailClose.addEventListener("click", hideDetails)

grid.addEventListener("click", (event) => {
    if (event.target.id === "retry-btn" && lastAction !== null){
        lastAction()
    }
} )