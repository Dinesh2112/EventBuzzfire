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
          <h3>MAKE YOUR</h3>
          <h3>EVENT</h3>
          <h3>BOOKED</h3>
        </div>
        <div className="f4">
          <h4>
           Best Site To Advetise <br />
            Your Events And <br />
            Programs <br />
            What are You Waiting<br />
            For Go Book your Event <br />
            {/* GET DIRECTIONS <br /> */}
          </h4>
        </div>
      </div>
    
    
    
    </>
  )
}
