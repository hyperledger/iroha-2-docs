let postJson = function (content, url) {
    const dataToSend = JSON.stringify(content);
    let dataReceived = "";
    fetch(url, {
            credentials: "omit",
            mode: "no-cors",
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: dataToSend
        })
        .then(resp => {
            if (resp.status === 200) {
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            dataReceived = JSON.parse(dataJson)
        })
        .catch(err => {
            if (err === "server") return
            console.log(err)
        })
}

export default postJson