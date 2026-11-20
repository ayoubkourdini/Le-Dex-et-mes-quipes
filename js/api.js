const BASE_URL = "http://localhost:3000";
 
export async function request(method, route, body = null) {
const options = {
    method: method,
    headers: 
    {
        "Content-Type": "application/json"
    }
}
if (body !== null) {
    options.body = JSON.stringify(body)
}

let response
try {
    response = await fetch(`${BASE_URL}${route}`, options)
}catch (error) {
    throw new Error("L'API ne répond pas")
}

if (!response.ok) {
    throw new Error(`Erreur ${response.status}`)
}
if (method === "DELETE") {
    return
}
return response.json()
}

export async function getCreatures (route){
    const data = await request("GET", route)
    return data
}

export async function getCreatures(id) {
    return await request("GET", `/creatures/${id}`)
}

export async function createCreature(data) {
    return await request("POST", "/creatures", data)
}


