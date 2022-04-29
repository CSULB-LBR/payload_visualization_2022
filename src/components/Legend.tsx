import React from "react";

const Legend = () => (
   <div className="legend">
      <div className="legend-title">Legend</div>
      <div className="legend-item">
         <div className="blue-box"></div>Launch Rail
      </div>
      <div className="legend-item">
         <div className="green-box"></div>Landing Area
      </div>
      <div className="legend-item">
         <div className="green-box"></div>Flight Path
      </div>
      <div className="legend-item legend-note">
         *Grid Line size: 250 feet
      </div>
   </div>
);

export default Legend;