import { createSwaggerSpec } from 'next-swagger-doc';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import React, {useEffect} from "react";

const ApiDoc = ({ spec }) => {
  useEffect(()=>{
    document.body.style.background = 'none';
  });
  return <div><style>body background:none;</style><SwaggerUI spec={spec} /></div>;
};

export const getStaticProps= async ctx => {
  const spec = createSwaggerSpec({
    title: 'Driver API',
    version: '0.1.0',
  }); 
  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;