import { environment } from 'src/environments/environment';
import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Home',
    isTitle: true,
    isAllowed: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: 'dashboard',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Pages',
    isTitle: true,
    isAllowed: true
  },
  {
    label: 'Courses',
    icon: 'book',
    isAllowed: true,
    subItems: [
      {
        label: 'Add Recorded Course',
        link: 'courses/add-recorded-course',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Add Live Course',
        link: 'courses/add-live-course-calender',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Courses',
        link: 'courses/course-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Course Revenue Details',
        link: 'courses/course-list-table',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Courses Directory',
        link: 'courses/courses-directory',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Create Question Set',
        link: 'courses/create-question-set',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Question Sets',
        link: 'courses/question-sets',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Postpone Schedule',
        link: 'courses/postpone-schedule',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Instructor Schedule',
        link: 'courses/instructor-schedule',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Review',
        link: 'courses/reviews',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Feedback',
        link: 'courses/feedbacks',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Subscriptions',
        link: 'courses/subscriptions',
        isAllowed: true,
        isExternalLink: false
      },
    ]
  },
  {
    label: 'Schedules',
    icon: 'calendar',
    link: 'courses/schedule',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Class Schedule',
    icon: 'calendar',
    link: 'courses/class-schedule',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Products',
    icon: 'package',
    isAllowed: true,
    subItems: [
      {
        label: 'Add Products',
        link: 'products/add-products',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Products',
        link: 'products/products',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Invesletter',
        link: 'products/invesletter',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Create Mentorship Schedule',
        link: 'products/mentorship-schedule',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Mentorship Schedule',
        link: 'products/all-schedule',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'One to One Mentorship',
        link: 'products/one-to-one-mentorship',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Portfolio Checkups',
        link: 'products/portfolio-checkup',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Live Market Practice Schedule',
        link: 'products/live-market-practice-schedule',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Live Market Practice',
        link: 'products/live-market-practice',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Send Research',
        link: 'products/send-research',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Follow My Portfolio',
        link: 'products/follow-my-portfolio',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Send Wealth Insights',
        link: 'products/send-wealth-insights',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Awareness Videos',
        link: 'products/awareness-videos',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Purchase History',
        link: 'products/product-purchase-history',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Pending Product Booking',
        link: 'products/pending-product-booking',
        isAllowed: true,
        isExternalLink: false
      }
    ]
  },
  {
    label: 'Insignia',
    icon: 'box',
    isAllowed: true,
    subItems: [
      {
        label: 'Add Insignia',
        link: 'insignia/add-insignia',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Insignia List',
        link: 'insignia/insignia-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Insignia Registrations',
        link: 'insignia/insignia-registrations',
        isAllowed: true,
        isExternalLink: false
      }
    ]
  },
  {
    label: 'Invesmentor',
    icon: 'box',
    isAllowed: true,
    subItems: [
      {
        label: 'Add Invesmentor',
        link: 'invesmentor/add-invesmentor',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Invesmentor List',
        link: 'invesmentor/invesmentor-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Invesmentor Registrations',
        link: 'invesmentor/invesmentor-registration',
        isAllowed: true,
        isExternalLink: false
      },
    ]
  },
  {
    label: 'Messages',
    icon: 'message-square',
    link: 'communication/messages',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Notice Board',
    icon: 'volume-2',
    link: 'communication/noticeboard',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Announcements',
    icon: 'volume-2',
    link: 'communication/announcements',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Notifications',
    icon: 'volume-2',
    link: 'communication/notifications',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Attendance & Leave',
    icon: 'calendar',
    isAllowed: true,
    subItems: [
      {
        label: 'Attendance & Leave',
        link: 'attendance-and-leave/attendance-leave',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Attendance Roster',
        link: 'attendance-and-leave/attendance-roster',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Apply Leave',
        link: 'attendance-and-leave/leave-apply',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Attendance & leave Requests',
        link: 'attendance-and-leave/Requests',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Attendance Report',
        link: 'attendance-and-leave/Report',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Manager Wise Attendance Report',
        link: 'attendance-and-leave/Manager-Wise-Report',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Leave Balance',
        link: 'attendance-and-leave/leave-balance',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Policy',
        link: 'attendance-and-leave/policy',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Policy List',
        link: 'attendance-and-leave/policy-list',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Attendance Settings',
        link: 'attendance-and-leave/attendancesettings',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Holiday',
        link: 'attendance-and-leave/holiday',
        isAllowed: true,
        isExternalLink: false
      }
    ]
  },
  {
    label: 'Students',
    icon: 'users',
    isAllowed: true,
    subItems: [
      {
        label: 'Students List',
        link: 'students/students-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Students Activities',
        link: 'students/students-activities',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Course Registration List',
        link: 'students/course-registration-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Marks',
        link: 'students/marks',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Certificates',
        link: 'students/certificates',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Ban Students',
        link: 'students/ban-students',
        isAllowed: true,
        isExternalLink: false
      },
    ]
  },
  {
    label: 'Instructors',
    icon: 'users',
    isAllowed: true,
    link: 'instructor/instructor-list',
    isExternalLink: false
  },
  {
    label: 'Employees',
    icon: 'users',
    isAllowed: true,
    subItems: [
      {
        label: 'Employee List',
        link: 'employees/employee-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Employee Registration',
        link: 'employees/employee-registration',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Organization Chart',
        link: 'employees/org-chart',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Department',
        link: 'employees/department',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Designation',
        link: 'employees/designation',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Team',
        link: 'employees/team',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Role Management',
        link: 'staff/role-management',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'On-Boarding Setting',
        link: 'employees/create-onboarding-setting',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'On-Boarding',
        link: 'employees/onboarding-task',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Off-Boarding',
        link: 'employees/offboarding-task',
        isAllowed: true,
        isExternalLink: false
      }
    ]
  },
  {
    label: 'Setting',
    icon: 'message-square',
    isAllowed: true,
    subItems: [
      {
        label: 'Business Hour',
        link: 'setting/business-hour',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Support Sla',
        link: 'setting/support-sla-policy',
        isAllowed: true,
        isExternalLink: false
      },

    ]
  },
  {
    label: 'Support-Group',
    icon: 'message-square',
    isAllowed: true,
    subItems: [
      {
        label: 'Create Group',
        link: 'support-group/create-group',
        isAllowed: true,
        isExternalLink: false
      },

    ]
  },

  {
    label: 'Sales',
    icon: 'target',
    isAllowed: true,
    subItems: [
      {
        label: 'Coupons',
        link: 'sales/coupons',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Conversion List',
        link: 'sales/convertion-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Pending Payments',
        link: 'sales/pending-payments',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Sales Report',
        link: 'sales/sales-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Team Sales Report',
        link: 'sales/team-sales-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Team Members Sales Report',
        link: 'sales/team-members-sales-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Add Sales Projection',
        link: 'sales/sales-projection',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Sales Projection Report',
        link: 'sales/sales-projection-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Individual Sales Projection Report',
        link: 'sales/individual-sales-projection-report',
        isAllowed: true,
        isExternalLink: false
      },
    ]
  },
  {
    label: 'Job Portal',
    icon: 'briefcase',
    isAllowed: true,
    subItems: [
      {
        label: 'Add Job Details',
        link: 'jobs/create-job',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Job Lists',
        link: 'jobs/joblists',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Job Applications',
        link: 'jobs/jobapplications',
        isAllowed: true,
        isExternalLink: false
      }
    ]
  },
  {
    label: 'Lead Management',
    icon: 'monitor',
    isAllowed: true,
    subItems: [
      {
        label: 'Leads',
        link: 'leads/leads',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Start Calling',
        link: 'leads/lead-details',
        isAllowed: false,
        isExternalLink: false
      },
      {
        label: 'Leads Lookup Excel',
        link: 'leads/lead-lookup',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Leads Lookup Single',
        link: 'leads/leads-lookup-1',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Active Call Backs/Follow Ups',
        link: 'leads/call-backs',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Demo Class Schedule',
        link: 'leads/demo-class-schedule',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Lead Tat Report',
        link: 'leads/lead-tat-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Lead Tat Log',
        link: 'leads/lead-tat-log',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Onboarding List',
        link: 'leads/onboarding-list',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Onboarding Tat Report',
        link: 'leads/onboarding-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Daily Lead Report',
        link: 'leads/daily-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Staff Lead Report',
        link: 'leads/individual-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Team Lead Report',
        link: 'leads/team-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Team Members Lead Report',
        link: 'leads/team-mem-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Audience Lead Report',
        link: 'leads/audience-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Daily Campaign Lead Report',
        link: 'leads/daily-campaign-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Campaign Performance Report',
        link: 'leads/performance-campaign-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Campaign Lead Report',
        link: 'leads/campaign-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Staff Campaign Lead Report',
        link: 'leads/staff-campaign-lead-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Lead Upload Log',
        link: 'leads/lead-upload-log',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Fresh Lead Assign Count',
        link: 'leads/lead-assign-count',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Lead Settings',
        link: 'leads/lead-settings',
        isAllowed: true,
        isExternalLink: false
      }
    ]
  },
  {
    label: 'Orders',
    icon: 'shopping-cart',
    isAllowed: true,
    subItems: [
      {
        label: 'New Orders',
        link: 'orders/new-order',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Orders',
        link: 'orders',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Verification Pending',
        link: 'orders/verification-pending',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Payment History',
        link: 'orders/payment-history',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Adjustment Request',
        link: 'orders/adjustment-request',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Batch Change Request',
        link: 'orders/batch-change-request',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Refund Request',
        link: 'orders/refund-request',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Carts',
        link: 'orders/carts',
        isAllowed: true,
        isExternalLink: false
      },
    ]
  },
  {
    label: 'Reports',
    icon: 'folder',
    isAllowed: true,
    subItems: [
      {
        label: 'INSIGNIA Reports',
        isTitle: true,
        isAllowed: true
      },
      {
        label: 'INSG From BCMB Report',
        link: 'reports/insignia-report-1',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'BCMB to INSG Monthwise Report',
        link: 'reports/insignia-report-2',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'BCMB to INSG ECwise Report',
        link: 'reports/insignia-report-3',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'BCMB to INSG Batchwise Report',
        link: 'reports/insignia-report-4',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Demo Conversion Report',
        link: 'reports/insignia-report-5',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'INSG Range ECwise Report',
        link: 'reports/insignia-report-6',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'INSG Range Batchwise Report',
        link: 'reports/insignia-report-7',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Insignia Running Report',
        link: 'reports/insignia-report-8',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'INSG Student vs Series Report',
        link: 'reports/insignia-report-9',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'INSIGNIA Sales Report',
        link: 'reports/insignia-report-10',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'BCMB Reports',
        isTitle: true,
        isAllowed: true
      },
      {
        label: 'BCMB Sales Report',
        link: 'reports/bcmb-report-1',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'App Reports',
        isTitle: true,
        isAllowed: true
      },
      {
        label: 'App Report',
        link: 'reports/app-report-1',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Call Reports',
        isTitle: true,
        isAllowed: true
      },
      {
        label: 'Stringee Call Logs',
        link: 'reports/ivr-report',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Stringee Report',
        link: 'reports/ivr-report-1',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Stringee Report Monthly',
        link: 'reports/ivr-report-2',
        isAllowed: true,
        isExternalLink: false
      },
    ]
  },
  {
    label: 'Referral',
    icon: 'share',
    isAllowed: true,
    subItems: [
      {
        label: 'Referral Details',
        link: 'referral/referral-details',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Referral Transaction',
        link: 'referral/referral-transaction',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Referral Setting',
        link: 'referral/referal-settings',
        isAllowed: true,
        isExternalLink: false
      },

    ]
  },
  {
    label: 'App',
    icon: 'smartphone',
    isAllowed: true,
    subItems: [
      {
        label: 'Devices',
        link: 'app/devices',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Login History',
        link: 'app/login-history',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'App Settings',
        link: 'app/app-settings',
        isAllowed: true,
        isExternalLink: false
      },

    ]
  },
  {
    label: 'Stocks',
    icon: 'trending-up',
    link: 'stocks/stock-list',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Others',
    icon: 'book',
    isAllowed: true,
    subItems: [
      {
        label: 'Sms Log',
        link: 'others/sms-log',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Email Log',
        link: 'others/email-log',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Whatsapp Log',
        link: 'others/whatsapp-log',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'AD Banners',
        link: 'others/ad-banner',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Books',
        link: 'others/books',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Short Urls',
        link: 'others/short-url',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Trainer Kits',
        link: 'others/training-kits',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Tutorials',
        link: 'others/tutorial',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Webinars',
        link: 'others/webinars',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Backup & Restore',
        link: 'others/backup-restore',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Cron Runner',
        link: 'logs/cron',
        isAllowed: true,
        isExternalLink: false
      },

    ]
  },
  {
    label: 'Profile',
    icon: 'user',
    link: 'profile/my-profile',
    isAllowed: true,
    isExternalLink: false
  },
  {
    label: 'Settings',
    icon: 'settings',
    isAllowed: true,
    subItems: [
      {
        label: 'Zoom Settings',
        link: 'settings/zoom-settings',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Freshdesk Agents',
        link: 'settings/freshdesk-agents',
        isAllowed: true,
        isExternalLink: false

      },
      {
        label: 'Stringee Agents',
        link: 'settings/stringee-agents',
        isAllowed: true,
        isExternalLink: false

      },
    ]
  },
  {
    label: 'Chat Support',
    icon: 'message-square',
    isAllowed: true,
    subItems: [
      {
        label: 'Chat',
        link: environment.websiteRedirectUrl + '/{role}/support/chat',
        isAllowed: true,
        isExternalLink: true
      },
      {
        label: 'Chat Feedback',
        link: 'support/chat-feedback',
        isAllowed: true,
        isExternalLink: false
      },
      {
        label: 'Settings',
        link: environment.websiteRedirectUrl + '/{role}/support/settings',
        isAllowed: true,
        isExternalLink: true
      },
    ]
  },
  /*{
     label: 'Web Apps',
     isTitle: true
   },
   {
     label: 'Email',
     icon: 'mail',
     subItems: [
       {
         label: 'Inbox',
         link: '/apps/email/inbox',
       },
       {
         label: 'Read',
         link: '/apps/email/read'
       },
       {
         label: 'Compose',
         link: '/apps/email/compose'
       },
     ]
   },
   {
     label: 'Chat',
     icon: 'message-square',
     link: '/apps/chat',
   },
   {
     label: 'Calendar',
     icon: 'calendar',
     link: '/apps/calendar',
     badge: {
       variant: 'primary',
       text: 'New',
     }
   },
   {
     label: 'Components',
     isTitle: true
   },
   {
     label: 'UI Kit',
     icon: 'feather',
     subItems: [
       {
         label: 'Alerts',
         link: '/ui-components/alerts',
       },
       {
         label: 'Badges',
         link: '/ui-components/badges',
       },
       {
         label: 'Breadcrumbs',
         link: '/ui-components/breadcrumbs',
       },
       {
         label: 'Buttons',
         link: '/ui-components/buttons',
       },
       {
         label: 'Button group',
         link: '/ui-components/button-group',
       },
       {
         label: 'Cards',
         link: '/ui-components/cards',
       },
       {
         label: 'Carousel',
         link: '/ui-components/carousel',
       },
       {
         label: 'Collapse',
         link: '/ui-components/collapse',
       },
       {
         label: 'Datepicker',
         link: '/ui-components/datepicker',
       },
       {
         label: 'Dropdowns',
         link: '/ui-components/dropdowns',
       },
       {
         label: 'List group',
         link: '/ui-components/list-group',
       },
       {
         label: 'Media object',
         link: '/ui-components/media-object',
       },
       {
         label: 'Modal',
         link: '/ui-components/modal',
       },
       {
         label: 'Navs',
         link: '/ui-components/navs',
       },
       {
         label: 'Navbar',
         link: '/ui-components/navbar',
       },
       {
         label: 'Pagination',
         link: '/ui-components/pagination',
       },
       {
         label: 'Popovers',
         link: '/ui-components/popovers',
       },
       {
         label: 'Progress',
         link: '/ui-components/progress',
       },
       {
         label: 'Rating',
         link: '/ui-components/rating',
       },
       {
         label: 'Scrollbar',
         link: '/ui-components/scrollbar',
       },
       {
         label: 'Spinners',
         link: '/ui-components/spinners',
       },
       {
         label: 'Timepicker',
         link: '/ui-components/timepicker',
       },
       {
         label: 'Tooltips',
         link: '/ui-components/tooltips',
       },
       {
         label: 'Typeadhed',
         link: '/ui-components/typeahead',
       },
     ]
   },
   {
     label: 'Advanced UI',
     icon: 'anchor',
     subItems: [
       {
         label: 'Cropper',
         link: '/advanced-ui/cropper',
       },
       {
         label: 'Owl carousel',
         link: '/advanced-ui/owl-carousel',
       },
       {
         label: 'Sweet alert',
         link: '/advanced-ui/sweet-alert',
       },
     ]
   },
   {
     label: 'Forms',
     icon: 'file-text',
     subItems: [
       {
         label: 'Basic elements',
         link: '/form-elements/basic-elements'
       },
       {
         label: 'Advanced elements',
         subItems: [
           {
             label: 'Form validation',
             link: '/advanced-form-elements/form-validation'
           },
           {
             label: 'Input mask',
             link: '/advanced-form-elements/input-mask'
           },
           {
             label: 'Ng-select',
             link: '/advanced-form-elements/ng-select'
           },
           {
             label: 'Ngx-chips',
             link: '/advanced-form-elements/ngx-chips'
           },
           {
             label: 'Ngx-color-picker',
             link: '/advanced-form-elements/ngx-color-picker'
           },
           {
             label: 'Ngx-dropzone',
             link: '/advanced-form-elements/ngx-dropzone-wrapper'
           },
         ]
       },
       {
         label: 'Editors',
         link: '/form-elements/editors'
       },
       {
         label: 'Wizard',
         link: '/form-elements/wizard'
       },
     ]
   },
   {
     label: 'Charts & graphs',
     icon: 'pie-chart',
     subItems: [
       {
         label: 'ApexCharts',
         link: '/charts-graphs/apexcharts',
       },
       {
         label: 'ChartJs',
         link: '/charts-graphs/chartjs',
       },
     ]
   },
   {
     label: 'Tables',
     icon: 'layout',
     subItems: [
       {
         label: 'Basic tables',
         link: '/tables/basic-table',
       },
       {
         label: 'Data table',
         link: '/tables/data-table',
       },
       {
         label: 'Ngx-datatable',
         link: '/tables/ngx-datatable'
       }
     ]
   },
   {
     label: 'Icons',
     icon: 'smile',
     subItems: [
       {
         label: 'Feather icons',
         link: '/icons/feather-icons',
       },
       {
         label: 'Flag icons',
         link: '/icons/flag-icons',
       },
       {
         label: 'Mdi icons',
         link: '/icons/mdi-icons',
       }
     ]
   },
   {
     label: 'Pages',
     isTitle: true
   },
   {
     label: 'Special pages',
     icon: 'book',
     subItems: [
       {
         label: 'Blank page',
         link: '/general/blank-page',
       },
       {
         label: 'Faq',
         link: '/general/faq',
       },
       {
         label: 'Invoice',
         link: '/general/invoice',
       },
       {
         label: 'Profile',
         link: '/general/profile',
       },
       {
         label: 'Pricing',
         link: '/general/pricing',
       },
       {
         label: 'Timeline',
         link: '/general/timeline',
       }
     ]
   },
   {
     label: 'Authentication',
     icon: 'unlock',
     subItems: [
       {
         label: 'Login',
         link: '/auth/login',
       },
       {
         label: 'Register',
         link: '/auth/register',
       },
     ]
   },
   {
     label: 'Error',
     icon: 'cloud-off',
     subItems: [
       {
         label: '404',
         link: '/error/404',
       },
       {
         label: '500',
         link: '/error/500',
       },
     ]
   },*/
];
