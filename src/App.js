import React, {Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

import Reset from './user/pages/Reset';
import NewPassword from './user/pages/NewPassword';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import AllPlaces from './places/pages/AllPlaces';

import Welcome from './user/pages/WelcomePage';
import NewPost from './places/pages/NewPost';
import About from './user/pages/About';

// const Users = React.lazy(()=>import('./user/pages/Users'));
// const Reset = React.lazy(()=>import('./user/pages/Reset'));
// const NewPassword = React.lazy(()=>import('./user/pages/NewPassword'));
// const NewPlace = React.lazy(()=>import('./places/pages/NewPlace'));
// const UserPlaces = React.lazy(()=>import('./places/pages/UserPlaces'));
// const UpdatePlace = React.lazy(()=>import('./places/pages/UpdatePlace'));
// const AllPlaces = React.lazy(()=>import('./places/pages/AllPlaces'));
// const Welcome = React.lazy(()=>import('./user/pages/WelcomePage'));
// const NewPost = React.lazy(()=>import('./places/pages/NewPost'));
// const About = React.lazy(()=>import('./user/pages/About'));
// const Auth = React.lazy(()=>import('./user/pages/Auth'));

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/allplaces" exact>
          <AllPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/new-post" exact>
          <NewPost />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Redirect to="/allplaces" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route> */}
        <Route path="/" exact>
          <Welcome />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Route path="/reset" exact>
          <Reset/>
        </Route>
        <Route path="/new-password/:token" exact>
          <NewPassword/>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}
  >
    <Router>
      {/* MainNavigation is rendered above the route where the Switch applies, its always
      visible*/}
      <MainNavigation />
      <main>
        {/* <Suspense fallback={
          <div className="center">
            <LoadingSpinner/>
          </div>}>{routes}
        </Suspense> */}
        {routes}
        </main>
    </Router>
  </AuthContext.Provider>
    // <h4>404
    // Page Not Found
    // The specified file was not found on this website. Please check the URL for mistakes and try again.
    
    // Why am I seeing this?
    // This page was generated by the Firebase Command-Line Interface. To modify it, edit the 404.html file in your project's configured public directory.</h4>
  );
};

export default App;
