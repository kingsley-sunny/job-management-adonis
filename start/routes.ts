/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import Application from '../app/models/application.js'
import Job from '../app/models/job.js'
import User from '../app/models/user.js'
import { middleware } from './kernel.js'
const UserController = () => import('../app/modules/user/user_controller.js')
const JobController = () => import('../app/modules/job/job_controller.js')
const LoginController = () => import('../app/modules/auth/login/login_controller.js')
const RegisterController = () => import('../app/modules/auth/register/register_controller.js')
const ApplicationController = () => import('../app/modules/application/application_controller.js')

router.on('/login').render('pages/login')
router.post('/login', [LoginController, 'create'])
router
  .post('logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect('/')
  })
  .use(middleware.auth())

router.on('/register').render('pages/register')
router.post('/register', [RegisterController, 'create'])

router
  .group(() => {
    router.on('/').render('pages/home')
    router.get('/jobs', [JobController, 'find'])

    router.post('/jobs/apply', [JobController, 'apply'])

    router.get('/jobs/:id', [JobController, 'findById'])

    router.get('/applications', [ApplicationController, 'find'])

    router.post('/applications/delete', [ApplicationController, 'delete'])
  })
  .use([middleware.silentAuth()])

router
  .group(() => {
    router.get('/dashboard', async ({ view }) => {
      return view.render('pages/dashboard/dashboard')
    })
  })
  .use(middleware.auth({ guards: ['web'] }))

// Admin Routes
router
  .group(() => {
    router.get('/', async ({ view }) => {
      const totalUsers = await User.query().count('id', 'totalUsers').first()

      const totalJobs = await Job.query().count('id', 'totalJobs').first()
      const totalApplications = await Application.query().count('id', 'totalApplications').first()

      const jobs = await Job.findWithQuery({})

      return view.render('pages/admin/overview', {
        totalJobs: totalJobs?.$extras?.totalJobs,
        totalUsers: totalUsers?.$extras?.totalUsers,
        totalApplications: totalApplications?.$extras?.totalApplications,
        jobs,
      })
    })

    // jobs
    router.get('/jobs', [JobController, 'AdminFind'])

    router.get('/jobs/create', async ({ view }) => {
      return view.render('pages/admin/create-job')
    })
    router.post('/jobs', [JobController, 'create'])

    router.get('/jobs/:id/edit', async ({ view, request, response }) => {
      const job = await Job.find(request.param('id'))

      if (!job) {
        return response.redirect('/admin/jobs')
      }

      return view.render('pages/admin/edit-job', { job })
    })
    router.post('/jobs/:id/edit', [JobController, 'update'])

    router.post('/jobs/delete', [JobController, 'delete'])

    router.get('/jobs/:id', [JobController, 'findByIdAdmin'])

    // job applications
    router.get('/applications', [ApplicationController, 'adminFind'])

    router.post('/applications/:id/update', [ApplicationController, 'update'])
    // router.get('/jobs', [JobController, 'AdminFind'])

    router.get('/users', [UserController, 'find'])
  })
  .prefix('/admin')
  .use([middleware.auth(), middleware.admin()])

// router
//   .group(() => {
//     // Overview
//     router.get('/admin/overview', 'AdminController.overview').as('admin.overview')

//     // Loans
//     router.get('/admin/loans', 'AdminController.loans').as('admin.loans')
//     router.get('/admin/loans/create', 'AdminController.createLoan').as('admin.loans.create')
//     router.post('/admin/loans', 'AdminController.storeLoan').as('admin.loans.store')
//     router.get('/admin/loans/:id', 'AdminController.showLoan').as('admin.loans.show')
//     router.post('/admin/loans/:id/approve', 'AdminController.approveLoan').as('admin.loans.approve')
//     router.post('/admin/loans/:id/reject', 'AdminController.rejectLoan').as('admin.loans.reject')

//     // Repayments
//     router.get('/admin/repayments', 'AdminController.repayments').as('admin.repayments')
//     router
//       .post('/admin/payments/:id/approve', 'AdminController.approvePayment')
//       .as('admin.payments.approve')
//     router
//       .post('/admin/payments/:id/reject', 'AdminController.rejectPayment')
//       .as('admin.payments.reject')

//     // Users
//     router.get('/admin/users', 'AdminController.users').as('admin.users')
//   })
//   .middleware(['auth', 'admin'])

// router.get('/admin/overview', 'AdminController.overview').as('admin.overview')

// // Loans
// router.get('/admin/loans', 'AdminController.loans').as('admin.loans')
// router.get('/admin/loans/create', 'AdminController.createLoan').as('admin.loans.create')
// router.post('/admin/loans', 'AdminController.storeLoan').as('admin.loans.store')
// router.get('/admin/loans/:id', 'AdminController.showLoan').as('admin.loans.show')
// router.post('/admin/loans/:id/approve', 'AdminController.approveLoan').as('admin.loans.approve')
// router.post('/admin/loans/:id/reject', 'AdminController.rejectLoan').as('admin.loans.reject')

// // Repayments
// router.get('/admin/repayments', 'AdminController.repayments').as('admin.repayments')
// router
//   .post('/admin/payments/:id/approve', 'AdminController.approvePayment')
//   .as('admin.payments.approve')
// router
//   .post('/admin/payments/:id/reject', 'AdminController.rejectPayment')
//   .as('admin.payments.reject')

// // Users
// router.get('/admin/users', 'AdminController.users').as('admin.users')
