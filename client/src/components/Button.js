import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Btn = styled.button`
  margin-top: 2rem;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  min-width: 8rem;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  border: none;
  background: black;
  color: white;
  cursor: pointer;
 
  &:disabled {
    background: lightgray;
    cursor: no-drop;
  }
`;

const  Button = props => {
  return <Btn onClick={() => props.onClick()} disabled={props.disabled}>{props.children}</Btn>;
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}

export default Button;