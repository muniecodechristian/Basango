import React, { useEffect, useState, useRef, useCallback } from "react";
import "./pages/home/NewsFeed.css";

const API_KEY = "80f641652f1841c98c26601754259ead";

const BASE_URL = `https://newsapi.org/v2/everything?sortBy=publishedAt&language=fr&apiKey=${API_KEY}`;

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("monde"); // catégorie par défaut
  const loaderRef = useRef(null);

  // ------------------- FETCH (scroll infini + catégories) -------------------
  const fetchArticles = useCallback(() => {
    setLoading(true);

    fetch(`${BASE_URL}&pageSize=20&page=${page}&q=${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.articles) {
          setLoading(false);
          return;
        }

        // Ajoute les nouveaux articles (scroll infini)
        setArticles((prev) => [...prev, ...data.articles]);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [page, category]);

  // Charger quand page change
  useEffect(() => {
    fetchArticles();
  }, [page, category]);

  // Observer pour scroll infini
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  // Quand catégorie change : reset + reload
  const handleCategory = (cat) => {
   
    setCategory(cat);
    setArticles([]);
    setPage(1);
    
  };

  if (loading && articles.length === 0) {
     return (
   <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
   

  const articlePrincipal = articles[0];

  return (
    <div className="news-container">
      {/* ------------------ HEADER / NAVBAR ------------------ */}
     
      {/* ------------------ BARRE DES FILTRES ------------------ */}
      <div className="continent-tabs">
        <button
          className={category === "monde" ? "active" : ""}
          onClick={() => handleCategory("monde")}
        >
          Monde
        </button>

        <button
          className={category === "afrique" ? "active" : ""}
          onClick={() => handleCategory("afrique")}
        >
          Afrique
        </button>

        <button
          className={category === "europe" ? "active" : ""}
          onClick={() => handleCategory("europe")}
        >
          Europe
        </button>

        <button
          className={category === "amérique" ? "active" : ""}
          onClick={() => handleCategory("amérique")}
        >
          Amérique
        </button>

        <button
          className={category === "moyen-orient" ? "active" : ""}
          onClick={() => handleCategory("moyen-orient")}
        >
          Moyen-Orient
        </button>

        <button
          className={category === "asie" ? "active" : ""}
          onClick={() => handleCategory("asie")}
        >
          Asie
        </button>

      </div>
     
     

      {/* ------------------ HERO ------------------ */}
      {articlePrincipal && (
        <section
          className="hero-section"
          style={{ backgroundImage: `url(${articlePrincipal.urlToImage})` }}
        >
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <p className="hero-date">
              {new Date(articlePrincipal.publishedAt).toLocaleDateString("fr-FR")}
            </p>

            <h2 className="hero-title">{articlePrincipal.title}</h2>
            <p className="hero-desc">{articlePrincipal.description}</p>

            <a
              href={articlePrincipal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-button"
            >
              Lire plus
            </a>
          </div>
        </section>
      )}


      {/* ------------------ GRILLE NEWS ------------------ */}
      <main className="news-main">
        {articles.slice(1).map((article, idx) => (
          <div className="news-card" key={idx}>
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} />
            )}

            <div className="news-info">
              <h3>{article.title}</h3>
              <p>{article.description}</p>

              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Lire l’article →
              </a>
            </div>
          </div>
        ))}
      </main>

      {/* ------------------ SCROLL INFINI LOADER ------------------ */}
      <div ref={loaderRef} className="loader">
        {loading && <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>}
      </div>
    </div>
  );
}
