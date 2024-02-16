import React from 'react'
import { useParams } from 'react-router-dom';

export default function EventDetails() {
    // Get event url
    const { title } = useParams();


  return (
    <div>
        Hi, {title}
    </div>
  )
}
