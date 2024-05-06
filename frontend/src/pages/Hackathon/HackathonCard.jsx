import React from 'react';
import { Link } from 'react-router-dom';

const HackathonCard = ({ hackathon }) => {
  // Split the tags string into an array
  const tags = hackathon.tags.split(', ');

  return (
        // <Link to={`/hackathons/${hackathon.id}`} className="card-link">
    <article className="card">
        {/* <div className="header"> */}
          {/* <img className="thumbnail" src={hackathon.front_image} alt="thumbnail" /> */}
        {/* </div> */}

        <div className="body">
          <div className="first-row">
         <div className="titles-info">
          <h3 className="title">{hackathon.title}</h3>
          <p className="subtitle">Hackathon</p>
           </div>
           <div className="links">
    {/* </Link> */}

            <Link to={hackathon.website_url}>
           <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="prefix__feather prefix__feather-link"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg>
           </Link>
           {/* <Link to={`/hackathons/${hackathon.id}`} className="card-link"> */}
           </div>
           </div>
           <div className="second-row">
            <div className="mode">
              <h3>Mode</h3>
              <span>onlline</span>
            </div>
            <div className="no-of-participated">
              <h3>1000+ Participated</h3>
            </div>
           </div>
           <div className="last-row">
            <div className="div">
          <ul className="tags">
            {tags.map((tag, index) => (
              <li key={index} className="tag-item">{tag}</li>
            ))}
          </ul></div>
          <div className="apply-button">
            <button> Apply</button>
          </div>
          </div>
        </div>
      </article>
      // </Link>
  );
};

export default HackathonCard;
