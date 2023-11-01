TENUTO

<br>
<br>
For this challenge, we were tasked with choosing an API and learning how to use it. Our group, consisting of three members, selected the Spotify API. The core functionality of the application was developed by me, Lionel Sanderson. I set a personal challenge to avoid using any global variables, and I succeeded. However, another member introduced one at a later stage for reasons that remain unclear. The feature allowing users to shortlist their favorite artists was contributed by Jake. He also added the finishing touches, incorporating various effects and selecting the color schemes. The original README was authored by Michael.
<br>
<br>
The application operates in a series of steps. First, it verifies a legitimate user by sending account credentials; in response, the API issues a temporary token valid upon authentication. This token, along with other variables, is relayed from one function to another and repeatedly sent back to the API for validation with each request. Users can select an artist, which the application then translates from the searched name into the unique Spotify artist ID. Subsequently, the top 10 songs of that artist can be retrieved. If the artist has made preview snippets available, these can also be sampled. Due to Spotify's reliance on IDs instead of names to identify artists, there's a "similar artists" dropdown on the left, this was cappedd to 10 similar artists. This aids users in pinpointing the exact artist they're searching for, especially when artist names can be tricky, such as searching for "pink" when the correct name is "p!nk".


<p align="center">
  <img src=assets/images/Screenshot.png>
</p>

<br />
 
[Application Link](https://l10n37.github.io/Tenuto/)
