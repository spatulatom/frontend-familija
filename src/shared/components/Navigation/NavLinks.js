import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);
  console.log('Navlink', auth.name)

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <li>
          <NavLink to={"/allplaces"}>LINIA CZASU</NavLink>
        </li>
      )}
        {auth.isLoggedIn && (
      <li>
        <NavLink to="/users" exact>
          KTO JEST
        </NavLink>
      </li>
       )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MOJE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">DODAJ ZDJĘCIE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new-post">DODAJ WPIS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/about">O NAS</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">ZALOGUJ</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <a onClick={auth.logout}>WYLOGUJ</a>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
