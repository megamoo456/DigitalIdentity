import "../App.css";
import { useState } from 'react';
import SimpleSider from '../components/Siders/SimpleSider';
import Error404 from './Error404';
//import { useContext } from "react";
//import { Context } from "../ContextStore";
import Clients from "../components/Clients/Clients";
//import { Link } from 'react-router-dom';

function Home() {
  // const { userData } = useContext(Context);
  const [isAuth, setIsAuth] = useState(sessionStorage.getItem('isAuth') === 'true');

  return (
    <>
     <SimpleSider />
     {isAuth ?  <Clients /> : <Error404 />}

        
    </>
  );
}

export default Home;
