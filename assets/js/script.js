/*
    1: get spotify temp token via API call
    2: retrieve artist ID via API call
    3: pass the artist ID through the API to receive artists top 10 tracks
    */
    var artist = document.querySelector('#repo-search-term');

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
            let ifExistsRemove = document.getElementById('insertArtistImage');
                if (ifExistsRemove) {
                    ifExistsRemove.parentNode.removeChild(ifExistsRemove);
                    } 
                        ifExistsRemove = document.querySelector('.top10Boxes');
                            if (ifExistsRemove) {
                                ifExistsRemove.parentNode.removeChild(ifExistsRemove);
                                }

        // wrap this all into our own minimal object containing only the information we need
        let top10Info = 
        {
            song:       [],
            album:      [],
            artwork:    [],
            sample:     [],
            year:       []
        };

        console.log(top10);
 
           for (let i = 0; i < 10; i++) {
            top10Info.song.push(top10[i].name);
                top10Info.album.push(top10[i].album.name);
                    top10Info.sample.push(top10[i].preview_url);
                        top10Info.artwork.push(top10[i].album.images[1]);
                            top10Info.year.push(top10[i].album.release_date);
                        }   

        console.log(top10Info);

        let insertArtistImage= document.createElement("div");
            insertArtistImage.id= "insertArtistImage";
                document.body.appendChild(insertArtistImage);

        insertArtistImage.innerHTML =
        "<img class= imageClass src=" + artistImage + ">" + '<br>' +
        "Your Artist:"+ "<bandName>"+ artistName +"</bandName>";
        


        let insertTop10= document.createElement("div");
            insertTop10.className= "top10Boxes";
                document.body.appendChild(insertTop10);

        // send function top 10 object, function returns it with formatting
        insertTop10.innerHTML = rollOutTop10(top10Info,0) + rollOutTop10(top10Info,1) + rollOutTop10(top10Info,2) + rollOutTop10(top10Info,3) +
        rollOutTop10(top10Info,4) +rollOutTop10(top10Info,5) + rollOutTop10(top10Info,6) + rollOutTop10(top10Info,7) + rollOutTop10(top10Info,8) +
        rollOutTop10(top10Info,9);
    }

    function rollOutTop10(top10InfoFormatted, i){
        // Give it's own child element
        let childElementStart = "<div class= top10Cards>";
            let childeElementEnd = "</div>";
        // sample tracks HTML syntax stuff
        let sampleStart = "<audio controls> <source src=";
            let sampleEnd = "/> </audio>";
                let sampleComplete =[];
        // album artwork img HTML syntax stuff -> these are a set size unlike the band / artist photo, no issue here
        let imgStart = "<img src="
            let imgEnd = ">";
                let imgComplete = [];
        // Album release date formatting/ HTML stuff -> styling required
        let dateStart = "Album Release Date: ";
            let dateComplete = [];
        // Album name formatting/ HTML stuff -> styling required
        let albumNameStart = "Album Title: ";
            let albumNameComplete = [];
        // Track name formatting / HTML stuff -> styling required
        let trackNameStart = "Track Name: ";
            let trackNameComplete = [];
        
            sampleComplete[i] = sampleStart + top10InfoFormatted.sample[i] + sampleEnd + "<br>";
                imgComplete[i] = imgStart+ top10InfoFormatted.artwork[i].url + imgEnd + "<br>";
                    albumNameComplete[i] = albumNameStart + top10InfoFormatted.album[i] + "<br>";
                        dateComplete[i] = dateStart + top10InfoFormatted.year[i] + "<br>";
                            trackNameComplete[i] = trackNameStart + top10InfoFormatted.song[i] + "<br>";
                                return childElementStart + imgComplete[i]+trackNameComplete[i]+ albumNameComplete[i] + dateComplete[i]+ sampleComplete[i] + childeElementEnd;
        }


    const getTop10 = async (token,artistID) => {
        const result = await fetch('https://api.spotify.com/v1/artists/'+artistID+'/top-tracks?market=AU', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        let top10tracks = data.tracks;
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