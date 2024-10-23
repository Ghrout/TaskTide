import React from 'react';
import '../css/loader.css';

function Loader() {
  return (
    <div className="loader-overlay">
      <div class="spinner">
<div class="loader l1"></div>
<div class="loader l2"></div>
</div>
    </div>
  );
}

export default Loader;
