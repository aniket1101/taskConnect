import React from "react";
import './Error.css';

interface Props {
  size: number
}

export default function Error({ size }: Props) {
  return (
    <i className="ErrIcon bi-x-circle" style={{ fontSize: size + 'px' }}></i>
  );
}