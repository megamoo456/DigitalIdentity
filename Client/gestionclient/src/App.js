import { Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import LogOut from './Pages/LogOut';
import Error404 from './Pages/Error404';
import Home from './Pages/Home';
import Header from './components/Header/Header';

function App() {

  return (
     <>
     <Header/>
        <Switch>
           <Route path='/'  exact component={Home} />
           <Route path='/auth/login' exact component={Login} />
           <Route path='/auth/register' exact component={Register} />
           <Route path='/auth/logout' exact render={LogOut} />        
           <Route component={Error404} />
        </Switch>


     </>
  );
}

export default App;
