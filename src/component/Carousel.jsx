import React from 'react'

const Carousel = () => {
  return (
    <div style={{ paddingLeft: '150px',paddingBottom:"10px",paddingTop:"40px",paddingRight: '200px' }}><br></br>
      <div id="carouselExample" className="carousel slide">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="\image1.jpg" style={{"width":"100px",height:"500px"}} className="d-block w-100" alt="..."></img>
    </div>
    <div className="carousel-item">
      <img src="\image2.avif" style={{"width":"100px",height:"500px"}} className="d-block w-100" alt="..."></img>
    </div>
    <div className="carousel-item">
      <img src="\image4.jpg" style={{"width":"100px",height:"500px"}} className="d-block w-100" alt="..."></img>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
    </div>
  )
}

export default Carousel
