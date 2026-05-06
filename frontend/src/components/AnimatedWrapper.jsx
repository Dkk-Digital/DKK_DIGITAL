import React from 'react';
import PropTypes from 'prop-types';
import '../styles/animations.css';

const AnimatedWrapper = ({ type = 'fade', duration = '0.9s', className = '', children }) => {
  const animClass = `anim-${type}`;
  const style = { animationDuration: duration };

  return (
    <div className={`animated-wrapper ${animClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};

AnimatedWrapper.propTypes = {
  type: PropTypes.string,
  duration: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default AnimatedWrapper;
