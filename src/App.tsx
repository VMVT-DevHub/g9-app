import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from './Components/layouts/Default';
import FullscreenLoader from './Components/other/FullscreenLoader';
import Login from './Pages/Login';
import { useAppSelector } from './state/hooks';
import { actions } from './state/user/reducer';
import api from './utils/api';
import { routes, slugs } from './utils/routes';

const App = () => {
  const dispatch = useDispatch();
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  const { isLoading } = useQuery([], () => api.getUserInfo(), {
    onSuccess: ({ Email, FName, LName, Phone, ID }) => {
      if (!ID) return;

      const userData = { email: Email, firstName: FName, lastName: LName, phone: Phone, id: ID };
      dispatch(actions.setUser({ loggedIn: true, userData: userData }));
    },
    retry: false,
  });

  if (isLoading) return <FullscreenLoader />;

  return (
    <>
      <Routes>
        <Route element={<PublicRoute loggedIn={loggedIn} />}>
          <Route path={slugs.login} element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
          {(routes || []).map((route, index) => (
            <Route
              key={`route-${index}`}
              path={route.slug}
              element={<DefaultLayout>{route.component}</DefaultLayout>}
            />
          ))}
        </Route>
        <Route path="/api/*" element={null} />
        <Route path="/auth/*" element={null} />
        <Route path="/swagger/*" element={null} />
        <Route path="*" element={<Navigate to={loggedIn ? slugs.businessPlace : slugs.login} />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

const PublicRoute = ({ loggedIn }: { loggedIn: boolean }) => {
  if (loggedIn) {
    return <Navigate to={slugs.businessPlace} replace />;
  }

  return <Outlet />;
};

const ProtectedRoute = ({ loggedIn }: { loggedIn: boolean }) => {
  if (!loggedIn) {
    return <Navigate to={slugs.login} replace />;
  }

  return <Outlet />;
};

export default App;
