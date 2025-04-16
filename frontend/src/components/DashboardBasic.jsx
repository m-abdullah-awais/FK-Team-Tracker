import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

import ProtectedRoute from './ProtectedRoute';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import Reports from '../pages/Reports';
import CreateReport from '../pages/CreateReport';
import Team from '../pages/Team';
import Profile from '../pages/Profile';
import TeamDetail from '../pages/TeamDetail';

import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import Requests from '../pages/Requests';
import AdminDashboard from '../pages/AdminDashboard';
import TeamDashboard from '../pages/TeamDashboard';
import IndexPage from '../pages/IndexPage';
import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import useAuth from '../hooks/useAuth';

import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import RequestPageIcon from '@mui/icons-material/RequestPage';
// import CreateTask from '../pages/CreateTask';

const getNavigation = (role) => {
  if (role === "admin") {
    return [
      {
        kind: 'header',
        title: 'Main',
      },
      {
        segment: 'admin/dashboard',
        title: 'Admin Dashboard',
        icon: <DashboardIcon />,
      },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: 'Team',
      },
      {
        segment: 'admin/team',
        title: 'Team Members',
        icon: <GroupsIcon />,
      },
      {
        segment: 'admin/requests',
        title: 'Requests',
        icon: <RequestPageIcon />,
        // action: <Chip label={3} color="primary" size="small" />,
      },
      // {
      //   kind: 'divider',
      // },
      // {
      //   kind: 'header',
      //   title: 'Tasks',
      // },
      // {
      //   segment: 'admin/task/create',
      //   title: 'Create',
      //   icon: <BarChartIcon />,
      // },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: 'Analytics',
      },
      {
        segment: 'admin/reports',
        title: 'Reports',
        icon: <BarChartIcon />,
      },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: 'Personalization',
      },
      {
        segment: 'admin/profile',
        title: 'Profile',
        icon: <PersonIcon />,
      },
    ];
  }

  // Team Navigation
  return [
    {
      kind: 'header',
      title: 'Main',
    },
    {
      segment: 'team/dashboard',
      title: 'Team Dashboard',
      icon: <DashboardIcon />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Analytics',
    },
    {
      segment: 'team/reports',
      title: 'My Reports',
      icon: <AssessmentIcon />,
    },
    {
      segment: 'team/report/create',
      title: 'Create New Report',
      icon: <NoteAddIcon />,
    },
    {
      kind: 'divider',
    },
    {
      kind: 'header',
      title: 'Personalization',
    },
    {
      segment: 'team/profile',
      title: 'Profile',
      icon: <PersonIcon />,
    },
  ];
};

const RoleBasedRoute = ({ roles, children }) => {
  const { user } = useAuth();

  const role = user?.role;

  if (user?.role) {
    if (!roles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return children;
};

function RouterAdapter({ children }) {
  const { user: userData } = useAuth();

  const role = userData?.role;
  const navigation = getNavigation(role);

  const navigate = useNavigate();
  const location = useLocation();

  const router = React.useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => navigate(path),
    }),
    [location, navigate]
  );

  React.useEffect(() => {
    if (userData) {
      setSession({
        user: {
          name: userData?.username || 'Muhammad Abdullah Awais',
          email: userData?.email || 'Abdullah@outlook.com',
          image: userData?.profilePic || 'https://source.unsplash.com/random/150x150',
        },
      });
    }
  }, [userData]);

  const [session, setSession] = React.useState({
    user: {
      name: userData?.username || 'Muhammad Abdullah Awais',
      email: userData?.email || 'Abdullah@outlook.com',
      image: userData?.profilePic || 'https://source.unsplash.com/random/150x150',
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: userData?.username || 'Muhammad Abdullah Awais',
            email: userData?.email || 'Abdullah@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: () => {
        setSession(null);
        localStorage.removeItem("fk-user-access");
        navigate("/login")
      },
    };
  }, []);

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      session={session}
      authentication={authentication}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="FK logo" />,
        title: 'FK',
        homeUrl: '/',
      }}
    >
      {children}
    </AppProvider>
  );
}
function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CloudCircleIcon fontSize="large" color="primary" />
      <Typography variant="h6">My App</Typography>
      <Chip size="small" label="BETA" color="info" />
      <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip>
    </Stack>
  );
}

function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? '© FK' : `© ${new Date().getFullYear()} Developed by Muhammad Abdullah Awais `}
    </Typography>
  );
}

const routeWrapper = (component) => {
  return <>
    <RouterAdapter>
      <DashboardLayout
      // slots={{
      // appTitle: CustomAppTitle,
      // toolbarActions: ToolbarActionsSearch,
      // sidebarFooter: SidebarFooter,
      // }}

      >
        <PageContainer>
          {component}
        </PageContainer>
      </DashboardLayout>
    </RouterAdapter>
  </>
}



export default function DashboardBasic() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<IndexPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN ROUTES */}

        <Route path='admin/dashboard' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        }
        />

        <Route path='admin/team' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <Team role={"admin"} />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path='admin/requests' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <Requests role={"admin"} />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        {/* <Route path='admin/task/create' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <CreateTask role={"admin"} />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } /> */}

        <Route path='admin/reports' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <Reports role={"admin"} />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path='admin/team/detail/:teamId' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <TeamDetail />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path='admin/profile' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin']}>
                <Profile />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />


        {/* USER ROUTES */}

        <Route path='team/dashboard' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin', 'team']}>
                <TeamDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path='team/report/create' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin', 'team']}>
                <CreateReport />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path='team/reports' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin', 'team']}>
                <Reports role={'team'} />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path='team/profile' element={
          routeWrapper(
            <ProtectedRoute>
              <RoleBasedRoute roles={['admin', 'team']}>
                <Profile />
              </RoleBasedRoute>
            </ProtectedRoute>
          )
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}