import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie'
import Header from './components/Header'

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [FeaturedData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(()=> {
    const loadAll = async () => {
      //Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);
      
      //Pegando o Destaque(Featured)
      let orinals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (orinals[0].items.results.length - 1));
      let chosen = orinals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);     
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
  
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader}/>
      
      {FeaturedData &&
        <FeaturedMovie item={FeaturedData} />
      }
      
      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
    
      <footer>
        Feito por <span>Miguel Dantas</span> || <a className="footer--insta" href="insgram.com/miguelbrn">Instagram</a> 	&#38; <a className="footer--git" href="github.com/users/miguelbrn">GitHub</a>
        
      </footer>
        
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="http://cdn.lowgif.com/full/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="carregando" />
      </div>
      }
    </div>
  );
}