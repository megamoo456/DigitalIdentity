const baseUrl = 'http://localhost:5000';

export async function getAll() {
    return await (await fetch(`${baseUrl}/clients`, {credentials: 'include',
headers:{
    'authorization' :  sessionStorage.getItem('token'),
}})).json()
}


export async function createClient(client) {
    return (await fetch(`${baseUrl}/clients/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization' :  sessionStorage.getItem('token'),
        },
        credentials: 'include',
        body: JSON.stringify(client)
    })).json();
}

export async function editClient(id, client) {
    return (await fetch(`${baseUrl}/clients/edit/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'authorization' :  sessionStorage.getItem('token'),
        },
        credentials: 'include',
        body: JSON.stringify(client)
    })).json();
}   



export async function deleteClientR(id) {
    return (await fetch(`${baseUrl}/clients/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization' :  sessionStorage.getItem('token'),
        },
        credentials: 'include',
        body: JSON.stringify({id})
    })).json();
}




