import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { BookCheckoutPage } from './layouts/BookCheckOutPage/BookCheckoutPage';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { LoginForm } from './Auth/LoginForm';
import { RegisterForm } from './Auth/RegisterForm';
import { ReviewListPage } from './layouts/BookCheckOutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import SecureRoute from './Auth/SecureRoute';
import { MessagePage } from './layouts/MessagePage/MessagePage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';


export const App = () => {
  const location = useLocation();
  

  // Hide Navbar/Footer on login and register pages only
  const hideLayout = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Navbar />}

      <div className="flex-grow-1">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>
          

          {/* Public accessible pages */}
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/search" component={SearchBooksPage} />
          <Route exact path="/checkout/:id" component={BookCheckoutPage} />
          <Route path="/reviewlist/:bookId" component={ReviewListPage}/>


          {/* Auth routes */}
          <Route exact path="/login" ><LoginForm/></Route>
          <Route exact path="/register" component={RegisterForm} />
          <SecureRoute path='/shelf' component={ShelfPage}/>
          <SecureRoute path='/messages' component={MessagePage}/>
          <SecureRoute path='/admin' component={ManageLibraryPage} />
          <SecureRoute path='/fees' component={PaymentPage} />

          {/* Fallback for non-existing routes */}
          {/* Fallback */}
          <Route>
            <Redirect to="/home" />
          </Route>
        </Switch>
      </div>

      <Footer />
    </div>
  );
};
