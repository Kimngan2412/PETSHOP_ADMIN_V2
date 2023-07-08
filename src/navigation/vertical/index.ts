// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    // {
    //   title: 'Dashboard',
    //   path: '/dashboards',
    //   icon: 'tabler:smart-home',
    //   children: [
    //     {
    //       title: 'Tổng quan',
    //       path: '/dashboards/analytics',
    //       icon: 'tabler:smart-home'
    //     }
    //   ]
    // },
    {
      title: 'Users Managements',
      path: '/users-managements',
      icon: 'tabler:smart-home',
      children: [
        {
          title: 'Roles',
          path: '/users-managements/roles',
          icon: 'tabler:smart-home'
        },
        {
          title: 'Users',
          path: '/users-managements/users',
          icon: 'tabler:smart-home'
        }
      ]
    },
    {
      title: 'Stores Managements',
      path: '/stores-managements',
      icon: 'tabler:smart-home',
      children: [
        {
          title: 'Categories',
          path: '/stores-managements/categories',
          icon: 'tabler:smart-home'
        },
        {
          title: 'Products',
          path: '/stores-managements/products',
          icon: 'tabler:smart-home'
        },

        // {
        //   title: 'Product Category',
        //   path: '/stores-managements/product-category',
        //   icon: 'tabler:smart-home'
        // },
        {
          title: 'Orders',
          path: '/stores-managements/orders',
          icon: 'tabler:smart-home'
        }
      ]
    }

    // {
    //   title: 'Second Page',
    //   path: '/second-page',
    //   icon: 'tabler:mail'
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'tabler:shield'
    // }
  ]
}

export default navigation
