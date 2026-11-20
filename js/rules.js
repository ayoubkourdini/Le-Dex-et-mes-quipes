export function validateCreature(data) {
    const errors = {}

    if(data.name.trim() === ""){
        errors.name = "Le nom est obligatoire"
    }
    if(data.type === "") {
        errors.type = "Choisis un type"
    }

    const stats = ["stat1", "stat2", "stat3"]
    for(const key of stats){
        const value = Number(data[key])
        if (data[key].trim() === "" || isNaN(value) || value < 1 || value > 255) {
            errors[key] = "Entre 1 et 255"
        }
    }
    return errors
}