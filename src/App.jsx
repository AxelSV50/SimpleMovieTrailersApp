import React, { useEffect } from 'react'
import Axios from 'axios'
import YouTube from 'react-youtube'
import { useState } from 'react'
import searchIcon from './assets/search-icon.png';

import './App.css'

//CONSTANTES DE LA API TMDB
const API_KEY = '6a07dc0c7c72da0a2a469fd161094a37'
const API_URL = 'https://api.themoviedb.org/3'
const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

function App() {
 
  //VARIABLES DE ESTADO
  const [movies, setMovies] = useState([])
  const [searchKey, setSearchKey] = useState("")
  const [trailer, setTrailer] = useState(null)
  const [movie, setMovie] = useState({title: "Loading Movies"})
  const [playing, setPlaying] = useState(false)

  //fetchMovies(searchKey, setMovies, setMovie)
  useEffect(()=>{
    fetchMovies(searchKey, setMovies, setMovie, setTrailer)
  },[])

  return (
    <>
      {/*Contenedor del banner*/}
      <div>
      <main>
          {movie ? (
            <div className='view-trailer' style={
              {backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,}
            }>
              {playing ? (
                <div style = {{backgroundColor: "black"}}>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor-container"
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="button1">
                    Close
                  </button>
                </div>): (
                  
                  <div className="description-container">
                     <h1>{movie.title}</h1>
                     <p className="description-text">{movie.overview}</p>
                    {trailer ? (
                      <button
                        className="button1"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      <p style={{textAlign: 'center', color:  "rgb(255, 208, 0)" }}>Sorry, no trailer available</p>
                    )}
                   
                  </div>
              )}
            </div>
          ):null}
          </main>
      </div>
      
      <h1>Movie Trailers APP</h1>
      
      {/*Contenedor para mostrar películas actuales*/}
      <div className='general-container'>

        {/*Buscador*/}
        <form onSubmit={(e)=> {
        getMovie(e, searchKey, setMovies, setMovie, setTrailer) 
        setPlaying(false)
        }}>

          <input type = 'text' placeholder='Search' onChange={(e) => setSearchKey(e.target.value)}></input>
          <button>        
            <img src= {searchIcon} alt='' height='10px' width='10px'/>
          </button>
        </form>
        
        <div className='movies-container'>
          {/*Por cada película en el arreglo, se crea otro 
          arreglo con un div para cada una de ellas*/}

          {movies.map(movie => (
            <div key = {movie.id} className='movie-container' onClick={()=>{
              selectMovie(movie, setMovie, setTrailer)
              setPlaying(false)}}>

              <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height="300px" width="200px" className="img-movie-container"/>
              <h4>{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

//FUNCIÓN PARA OBTENER UN ARREGLO CON LAS PRINCIPALES PELÍCULAS
const fetchMovies = async (searchKey, setMovies, setMovie, setTrailer) =>{

  //OPERADOR TERNARIO
  //Si searchKey tiene algo, el type es search, sino es discover
  const type = searchKey ? "search" : "discover"

  /*
    OBTIENE LA PROPIEDAD DATA DEL OBJETO RESPUESTA Y LO GUARDA
    EN UNA VARIABLE RESULTS
    
    SE PODRÍA HACER ASÍ: const results = ...

    y acceder a results.data

    params es como un header enviado por el GET 
  */
  const {data: {results}} =
   await Axios.get(`${API_URL}/${type}/movie`, {
    params: { 
      api_key: API_KEY,
      query: searchKey,
    }
   });

   setMovies(results)
   setMovie(results[0])

   if(results.length){
      await fetchMovie(results[0].id, setTrailer, setMovie)
   }
}

//FUNCIÓN PARA BUSCAR PELÍCULAS
const getMovie = (event, searchKey, setMovies, setMovie, setTrailer) =>{
  event.preventDefault()
  fetchMovies(searchKey, setMovies, setMovie, setTrailer)
}

//FUNCIÓN PARA LA PETICIÓN DE UN SOLO OBJETO Y MOSTRAR EN REPRODUCTOR DE VÍDEO
const fetchMovie = async (id, setTrailer, setMovie) =>{
  const {data} =
   await Axios.get(`${API_URL}/movie/${id}`, {
    params: { 
      api_key: API_KEY,

      //Este campo trae de la API la URL del vídeo
      append_to_response: "videos"
    }
   });

   if(data.videos && data.videos.results){

      //Buscar función find de los arreglos
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer" 
      )
      //Si el trailer no es nulo, se pasa el trailer, sino
      //el primer video de la lista 
      setTrailer(trailer ? trailer : data.videos.results[0])
   }
   setMovie(data)
}

const selectMovie = async (movie, setMovie, setTrailer) =>{

  fetchMovie(movie.id, setTrailer, setMovie)
  setMovie(movie)
  window.scrollTo(0,0)
}


export default App
