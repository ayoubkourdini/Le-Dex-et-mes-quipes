const BASE_URL = "http://localhost:3000";
 
export async function request(method, route, body = null) {
const options = {
    method: method,
    Headers: 
    {
        "Content-Type": "application/json"
    }
}
if (body !== null) {
    options.body = body
}
try {
    const response = await fetch(`${BASE_URL}${route}`, options)
    if (!response.ok){
        throw new Error("Connection trublle!")
    }
    if (method === "DELETE"){
        return
    }
    return response.json()
}catch (error) {
    console.log(error)
}
}

export async function getCreatures (route){
    const data = await request("GET", route)
    return Promise.all(data)
}


