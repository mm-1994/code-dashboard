import { CircularProgress, Flex } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../../components/ui/nav-bar/nav-bar';
import SideBar from '../../components/ui/side-bar/side-bar';
import './admin.css';
const UserManagementLayout = React.lazy(() => import('../user-management/user-management'));

function AdminLayout () {
    const location = useLocation().pathname;
    return (
        <div>
            <Flex w="100%">
                <SideBar />
                <div className="app-container" >
                    <NavBar />
                    <div className={'main-app'}>
                        {location.includes('/users') || location.includes('/edit-device-group') ? <Suspense fallback={<CircularProgress isIndeterminate color='action.100' />}><UserManagementLayout /></Suspense> : <Outlet />}
                    </div>
                </div>
            </Flex>

        </div>
    );
}

export default AdminLayout;
