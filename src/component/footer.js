import React from 'react'
import logo from "./logo.png";

export default function Footer() {
  return (
    <>
     <div className="footer">
        <img
          src="https://eiwgew27fhz.exactdn.com/wp-content/themes/puttosaurus/img/dots-footer.svg"
          alt=""
        />
        <div className="f1">
        <img src={logo} className='logo' alt='/' />
        </div>
        <div className="f2">
          <h3>DINESH RAJAN</h3>
          <h3>SONAL GUPTA</h3>
          <h3>CHAITANYA MARAR</h3>
        </div>
        <div className="f3">
          <h3>coffee shop</h3>
          <h3>LEAGUES</h3>
          <h3>Contact us</h3>
        </div>
        <div className="f4">
          <h4>
            A20, SclassNameCUP BYPASS <br />
            CHISLEHURST <br />
            KENT <br />
            BR7 6RP <br />
            TEL: 0208 309 0181 <br />
            GET DIRECTIONS <br />
          </h4>
        </div>
      </div>
    
    
    
    </>
  )
}
