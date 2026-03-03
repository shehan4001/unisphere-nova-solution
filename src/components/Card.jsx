function Card({ image, title, description, buttonText }) {
    return (
      <div className="feature-card">
        <img src={image} alt={title} />
        <h4>{title}</h4>
        <p>{description}</p>
        <button>{buttonText}</button>
      </div>
    );
  }
  
  export default Card;