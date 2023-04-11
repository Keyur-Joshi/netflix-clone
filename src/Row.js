import React, { useState, useEffect } from 'react';
// renammed instance to axios from axios.js file, because it was exported as default
import axios from './axios';
import "./Row.css";
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url =  'https://www.themoviedb.org/t/p/original/';
function Row({title, fetchUrl, isLargeRow}) {
    
    const [movies, setMovies] = useState ([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    // A snippet tof code which runs based on the specific condition /variable => useState

    useEffect(() => {
        // dependency [] is blank > run once when the row loads, & don't run again
        // dependency [movie] > run every time when movie changes
        // Have to run a function in Async way => because we are using 3rd partt API here
        //We need to use fetchUrl in dependencies because it need to reload every time url's response changes
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            // console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
    
    // console.log(movies);

    const handleClick = (movie) => {
        if(trailerUrl){
            setTrailerUrl("");
        }else{
            movieTrailer(movie?.title || "")
            // .then(console.log(movie))
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            })
            .catch((error) => console.log(error));
        }
    }


    
    return (
        <div className='row'>
            {/* Title */}
            {/* poster containers */}
            <h2>{title}</h2>
            {/* Several row posters */}
            
            
            <div className= "row__posters" >  
                {movies.map(movie => (
                    <img 
                    key = {movie.id}
                    onClick={() => handleClick(movie)}
                    className =  {`row__poster ${isLargeRow && "row__posterLarge"}`}
                    src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                    alt={movie.name} />
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
        
    )
}

export default Row