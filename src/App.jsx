import React, { useEffect } from 'react'
import Axios from 'axios'
import Youtube from 'react-youtube'
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
  const [movie, setMovie] = useState([{title: "Loading Movies"}])
  const [playing, setPlaying] = useState(false)


  //fetchMovies(searchKey, setMovies, setMovie)

  useEffect(()=>{
    fetchMovies(searchKey, setMovies, setMovie)
  },[])

  return (
    <>
      <h1>Movie Trailers APP</h1>

      {/*Contenedor para mostrar películas actuales*/}
      <div className='general-container'>

        {/*Buscador*/}
        <form onSubmit={(e)=> getMovie(e, searchKey, setMovies, setMovie)}>
          <input type = 'text' placeholder='Search' onChange={(e) => setSearchKey(e.target.value)}></input>
          <button>        
            <img src= {searchIcon} alt='' height='10px' width='10px'/>
          </button>
        </form>
        
        <div className='movies-container'>
          {/*Por cada película en el arreglo, se crea otro 
          arreglo con un div para cada una de ellas*/}

          {movies.map(movie => (
            <div key = {movie.id} className='movie-container'>
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
const fetchMovies = async (searchKey, setMovies, setMovie) =>{

  //OPERADOR TERNARIO
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
}

//FUNCIÓN PARA BUSCAR PELÍCULAS
const getMovie = (event, searchKey, setMovies, setMovie) =>{
  event.preventDefault()
  fetchMovies(searchKey, setMovies, setMovie)
}

export default App
