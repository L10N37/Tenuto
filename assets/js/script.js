    /*
    1: get spotify temp token via API call
    2: retrieve artist ID via API call 
    3: pass the artist ID through the API to receive artists top 10 tracks
    */
    

    const getToken = async (searchQuery) => {

        const clientId = '44c2ad3160174fc089bfbe272aa6eb71';
        const clientSecret = '5d75f019233b4757a4de12db7680508c';

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });


        const data = await result.json();
        let token= (data.access_token);
        console.log("temporary token: " + token);
        // pass the received token and search query to the next api call (the passing through 2 functions is only to prevent global declaration)
        getArtistId(token,searchQuery);
    }

    const getArtistId = async (token,searchQuery) => {

        const result = await fetch('https://api.spotify.com/v1/search?q='+searchQuery+'&type=artist', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        console.log("Here's the returned object");
        console.log(data);
        console.log("Here's the first results (element 0) artist name & ID:");
        console.log (data.artists.items[0].name + "\n" + data.artists.items[0].id);
    }



    // Click event listener on 'get artists' button
    document.getElementById("getArtistsButton").addEventListener("click", function(event) {
    let searchQuery= document.getElementById("artistSearch").value;
    // pass our search query (from text input box) to getToken function
    getToken(searchQuery);
    // prevent a refresh
    event.preventDefault();
})




 