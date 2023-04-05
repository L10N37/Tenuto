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
        // log 20 artists and their ID's result and store them in their own object, 
        // the entire object this info came from is also passed to the next function
        let artistSearchResults = {
        artist: [],
        id: []
        };
        let getArtistIdObject = data;
        console.log("Results: ");

            for (let i = 0; i< 20; i++) {
                console.log (data.artists.items[i].name + "\n" + data.artists.items[i].id);
                artistSearchResults.artist[i] = data.artists.items[i].name;
                artistSearchResults.id[i] = data.artists.items[i].id;
                }
                
        console.log(artistSearchResults);
        // pass this function an artistIndex of zero, as our search defaults to displaying element 0 object results
        getTop10(token, artistSearchResults, getArtistIdObject, 0);
    }

    const getTop10 = async (token, artistSearchResults, getArtistIdObject, artistIndex) => {
        const result = await fetch('https://api.spotify.com/v1/artists/'+artistSearchResults.id[artistIndex]+'/top-tracks?market=AU', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        // removal of old elements in case of multiple search queries //
        let ifExistsRemove = document.getElementById('insertArtistImage');
        if (ifExistsRemove) {
                ifExistsRemove.parentNode.removeChild(ifExistsRemove);
                }
        ifExistsRemove = document.querySelector('.top10Boxes');
        if (ifExistsRemove) {
            ifExistsRemove.parentNode.removeChild(ifExistsRemove);
            }
        ifExistsRemove = document.querySelector('#didYouMean');
        if (ifExistsRemove) {
                ifExistsRemove.parentNode.removeChild(ifExistsRemove);
            }
        ///////////////////////////////////////////////////////////////

        const data = await result.json();
        console.log("getTop10() Function Object");
        let top10 = data;
        console.log(top10);
        
        // fix implemented here for artist that don't have an image i.e. 'pinkie pie' which would cause a crash/ page reset
        let artistImage;  
        if(getArtistIdObject.artists.items[artistIndex].images.length >0){
        artistImage=  getArtistIdObject.artists.items[artistIndex].images[1].url;
        }
        else artistImage = 'https://github.com/L10N37/Tenuto/tree/main/assets/images/noImage.jpg';

        console.log(artistImage);

        // store information we need into our own minimal object from the fetched object
        let top10Info = 
        {
            song:       [],
            album:      [],
            artwork:    [],
            sample:     [],
            year:       []
        };

            // using length of top 10 track length here, not all artists have 10 tracks on spotify, i.e. mikayla jackson has 1
           for (let i = 0; i < top10.tracks.length ; i++) {
            top10Info.song.push(top10.tracks[i].name);
                top10Info.album.push(top10.tracks[i].album.name);
                    top10Info.sample.push(top10.tracks[i].preview_url);
                        top10Info.artwork.push(top10.tracks[i].album.images[1]);
                            top10Info.year.push(top10.tracks[i].album.release_date);
                            }  

        console.log(top10Info);

        let artistName = artistSearchResults.artist[artistIndex];

     // add the results into a 'did you mean?' box under the others on the L/H side
     let insertAlternateSearch= document.createElement("div");
         insertAlternateSearch.className= "card";
             insertAlternateSearch.id= "didYouMean";
                 let appendTo= document.querySelector(".col-md-4")
                     insertAlternateSearch.innerHTML=   
                         "<h3 class="+"card-header text-uppercase"+">Did You Mean?</h3>" +
                         "<form id="+"artist-form"+"class="+"card-body>" +
                         "<label class="+"form-label"+">Similar Search Results:</label>"+
                             otherResults(artistSearchResults.artist);
                                 appendTo.appendChild(insertAlternateSearch);

                                 // Click event listeners on alternate search results
                                 let arrayOfID = ['alt1','alt2','alt3','alt4','alt5','alt6','alt7','alt8','alt9','alt10'];
                                 for (let i = 0; i < 10; i++) {
                                     document.getElementById(arrayOfID[i]).addEventListener("click", function(event) {
                                        // i+1 skips the initial search as we stored the top 20 results including what was searched
                                         console.log("clicked: "+ arrayOfID[i] +"\n"+ artistSearchResults.artist[i+1] +"\n"+ artistSearchResults.id[i+1]);

                                                 // pass value to search box
                                                 //let searchBox = document.querySelector("input");
                                                 //let altSearchValue = document.getElementById(arrayOfID[i]).innerText;
                                                 // searchBox.value = altSearchValue.toLowerCase() ;

                                                 // or search directly
                                                 //getArtistId(token, document.getElementById(arrayOfID[i]).innerText.toLowerCase());
                                                 artistId = artistSearchResults.id[i+1];
                                                 getTop10(token, artistSearchResults, getArtistIdObject, i+1);
                                             })  
                                         }
 
     let insertArtistImage= document.createElement("div");
         insertArtistImage.id= "insertArtistImage";
             let artistinfo= document.getElementById("TOP10")
                artistinfo.appendChild(insertArtistImage);

     insertArtistImage.innerHTML =
     "<img class= imageClass src=" + artistImage + ">" + '<br>' +
     "Your Artist: "+ "<bandName>"+ artistName +"</bandName>";
     
     let insertTop10= document.createElement("div");
         insertTop10.className= "top10Boxes";
             document.body.appendChild(insertTop10);
             var cardsetup= document.getElementById("cardlist")
             cardsetup.appendChild(insertTop10);

     let RollOutTopSongsLength =[];
     for (let i = 0; i < top10.tracks.length; i++) {
        RollOutTopSongsLength= RollOutTopSongsLength.concat(rollOutTop10(top10Info,i));
     }
     console.log(RollOutTopSongsLength.join(' '));
     // send function top 10 object, function returns it with formatting
     insertTop10.innerHTML = RollOutTopSongsLength.join(' ');
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
        // Album release date formatting/ HTML stuff
        let dateStart = "Released: ";
            let dateComplete = [];
        // Album name formatting/ HTML stuff
        let albumNameStart = "Album: ";
            let albumNameComplete = [];
        // Track name formatting / HTML stuff
        let trackNameStart = "";
            let trackNameComplete = [];
        
            sampleComplete[i] = sampleStart + top10InfoFormatted.sample[i] + sampleEnd + "<br>";
                imgComplete[i] = imgStart+ top10InfoFormatted.artwork[i].url + imgEnd + "<br>";
                    albumNameComplete[i] = albumNameStart + top10InfoFormatted.album[i] + "<br>";
                        dateComplete[i] = dateStart + top10InfoFormatted.year[i] + "<br>";
                            trackNameComplete[i] = trackNameStart + top10InfoFormatted.song[i] + "<br>";
                                return childElementStart + imgComplete[i]+trackNameComplete[i]+ albumNameComplete[i] + dateComplete[i]+ sampleComplete[i] + childeElementEnd;
        }

    function otherResults(artistSearchResultsFormatted){
        let SendBackResults=[];
            let arrayOfID = ['alt1','alt2','alt3','alt4','alt5','alt6','alt7','alt8','alt9','alt10'];
                let altStart = "<p id=";
                    let altEnd = "</p>";

        for (let i=0; i < 10; i++) {
          SendBackResults= SendBackResults.concat(altStart + arrayOfID[i] +'>'+ artistSearchResultsFormatted[i+1] + altEnd);
        }
        return SendBackResults.join('');
    }

    // Click event listener on 'get artists' button
    document.getElementById("getArtistsButton").addEventListener("click", function(event) {
    let searchQuery= document.getElementById("artistSearch").value;
    // pass our search query (from text input box) to getToken function
    getToken(searchQuery);
    // prevent a refresh
    event.preventDefault();
    })