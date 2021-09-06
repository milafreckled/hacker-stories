import React from "react";

const HeroPattern = ({ pttrn, children }) => 
<div className={pttrn}>
    {children}
</div>

export default HeroPattern;