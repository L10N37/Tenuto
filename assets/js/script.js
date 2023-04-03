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
        let artistID = data.artists.items[0].id;
        let artistImage = data.artists.items[0].images[1].url;
        console.log(artistImage);
        const top10= await getTop10(token,artistID);

        let artistName = data.artists.items[0].name;



        let insertArtistImage= document.createElement("div");
            document.body.appendChild(insertArtistImage);
                insertArtistImage.innerHTML = "<bandName>"+artistName+"</bandName>"+ "<br>" +"<img src="+ artistImage+ ">"  ;
           
            let top10songs = [];
            let top10albums = [];
            let top10samples = [];
            console.log(top10);
           // top 10 song retrieval and storage
           for (let i = 0; i < 10; i++) {
            top10songs.push(top10[i].name);
            top10albums[i] = top10[i].album.name;
            top10samples[i]= top10[i].preview_url;
        }   
        console.log(top10albums+ "\n\n" + top10songs);
        console.log(top10samples)

    }


    
    const getTop10 = async (token,artistID) => { 
        const result = await fetch('https://api.spotify.com/v1/artists/'+artistID+'/top-tracks?market=AU', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        let top10tracks = data.tracks;
        console.log(top10tracks);
        return top10tracks;
    }

    // Click event listener on 'get artists' button
    document.getElementById("getArtistsButton").addEventListener("click", function(event) {
    let searchQuery= document.getElementById("artistSearch").value;
    // pass our search query (from text input box) to getToken function
    getToken(searchQuery);
    // prevent a refresh
    event.preventDefault();
})
 