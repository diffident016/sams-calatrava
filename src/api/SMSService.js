
const getMessage = async () => {

    const uri = 'https://api.semaphore.co/api/v4/messages';

    fetch(uri + '?apikey=5f49fa3bcb8e91ff4607b5cb15e5ed9b', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
        .then((res) => {
            console.log(res.json())
        })
        .catch(err => console.error(err));
}

export { getMessage }