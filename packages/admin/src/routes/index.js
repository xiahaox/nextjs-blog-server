import adminRoutes from './admin'
import Layout from '@/layout/admin'
import lazy from '@/components/Lazy'

const routes = [
    adminRoutes,
    {
        path: '/',
        name: 'home',
        component: Layout,
        childRoutes: [
            { path: '', component: lazy(() => import('@/views/admin/home')) },
        ],
    }

]
export default routes
