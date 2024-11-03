/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutProfileImport } from './routes/_layout/profile'
import { Route as authSignupImport } from './routes/(auth)/signup'
import { Route as authLoginImport } from './routes/(auth)/login'
import { Route as LayoutteacherCourseImport } from './routes/_layout/(teacher)/course'
import { Route as LayoutstudentNoteImport } from './routes/_layout/(student)/note'
import { Route as LayoutstudentEnrolledoursesImport } from './routes/_layout/(student)/enrolled_ourses'
import { Route as LayoutadminDashboardImport } from './routes/_layout/(admin)/dashboard'
import { Route as LayoutadminAddUserImport } from './routes/_layout/(admin)/addUser'
import { Route as LayoutteacherCourseIndexImport } from './routes/_layout/(teacher)/course.index'
import { Route as LayoutstudentEnrolledcoursesIndexImport } from './routes/_layout/(student)/enrolled_courses.index'
import { Route as LayoutteacherCourseCourseTitleImport } from './routes/_layout/(teacher)/course.$courseTitle'
import { Route as LayoutstudentEnrolledcoursesCourseTitleImport } from './routes/_layout/(student)/enrolled_courses.$courseTitle'
import { Route as LayoutteacherCourseStudentsCourseTitleImport } from './routes/_layout/(teacher)/course.students.$courseTitle'
import { Route as LayoutteacherCourseTestCourseTitleTestIdImport } from './routes/_layout/(teacher)/course.test.$courseTitle.$testId'
import { Route as LayoutteacherCourseQuizCourseTitleQuizIdImport } from './routes/_layout/(teacher)/course.quiz.$courseTitle.$quizId'
import { Route as LayoutstudentEnrolledcoursesTestCourseTitleTestIdImport } from './routes/_layout/(student)/enrolled_courses.test.$courseTitle.$testId'
import { Route as LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdImport } from './routes/_layout/(student)/enrolled_courses.quiz.$courseTitle.$quizId'
import { Route as LayoutteacherCourseStudentsTestCourseTitleTestIdImport } from './routes/_layout/(teacher)/course.students.test.$courseTitle.$testId'
import { Route as LayoutteacherCourseStudentsQuizCourseTitleQuizIdImport } from './routes/_layout/(teacher)/course.students.quiz.$courseTitle.$quizId'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutProfileRoute = LayoutProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => LayoutRoute,
} as any)

const authSignupRoute = authSignupImport.update({
  id: '/(auth)/signup',
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any)

const authLoginRoute = authLoginImport.update({
  id: '/(auth)/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const LayoutteacherCourseRoute = LayoutteacherCourseImport.update({
  id: '/(teacher)/course',
  path: '/course',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutstudentNoteRoute = LayoutstudentNoteImport.update({
  id: '/(student)/note',
  path: '/note',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutstudentEnrolledoursesRoute =
  LayoutstudentEnrolledoursesImport.update({
    id: '/(student)/enrolled_ourses',
    path: '/enrolled_ourses',
    getParentRoute: () => LayoutRoute,
  } as any)

const LayoutadminDashboardRoute = LayoutadminDashboardImport.update({
  id: '/(admin)/dashboard',
  path: '/dashboard',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutadminAddUserRoute = LayoutadminAddUserImport.update({
  id: '/(admin)/addUser',
  path: '/addUser',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutteacherCourseIndexRoute = LayoutteacherCourseIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutteacherCourseRoute,
} as any)

const LayoutstudentEnrolledcoursesIndexRoute =
  LayoutstudentEnrolledcoursesIndexImport.update({
    id: '/(student)/enrolled_courses/',
    path: '/enrolled_courses/',
    getParentRoute: () => LayoutRoute,
  } as any)

const LayoutteacherCourseCourseTitleRoute =
  LayoutteacherCourseCourseTitleImport.update({
    id: '/$courseTitle',
    path: '/$courseTitle',
    getParentRoute: () => LayoutteacherCourseRoute,
  } as any)

const LayoutstudentEnrolledcoursesCourseTitleRoute =
  LayoutstudentEnrolledcoursesCourseTitleImport.update({
    id: '/(student)/enrolled_courses/$courseTitle',
    path: '/enrolled_courses/$courseTitle',
    getParentRoute: () => LayoutRoute,
  } as any)

const LayoutteacherCourseStudentsCourseTitleRoute =
  LayoutteacherCourseStudentsCourseTitleImport.update({
    id: '/students/$courseTitle',
    path: '/students/$courseTitle',
    getParentRoute: () => LayoutteacherCourseRoute,
  } as any)

const LayoutteacherCourseTestCourseTitleTestIdRoute =
  LayoutteacherCourseTestCourseTitleTestIdImport.update({
    id: '/test/$courseTitle/$testId',
    path: '/test/$courseTitle/$testId',
    getParentRoute: () => LayoutteacherCourseRoute,
  } as any)

const LayoutteacherCourseQuizCourseTitleQuizIdRoute =
  LayoutteacherCourseQuizCourseTitleQuizIdImport.update({
    id: '/quiz/$courseTitle/$quizId',
    path: '/quiz/$courseTitle/$quizId',
    getParentRoute: () => LayoutteacherCourseRoute,
  } as any)

const LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute =
  LayoutstudentEnrolledcoursesTestCourseTitleTestIdImport.update({
    id: '/(student)/enrolled_courses/test/$courseTitle/$testId',
    path: '/enrolled_courses/test/$courseTitle/$testId',
    getParentRoute: () => LayoutRoute,
  } as any)

const LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute =
  LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdImport.update({
    id: '/(student)/enrolled_courses/quiz/$courseTitle/$quizId',
    path: '/enrolled_courses/quiz/$courseTitle/$quizId',
    getParentRoute: () => LayoutRoute,
  } as any)

const LayoutteacherCourseStudentsTestCourseTitleTestIdRoute =
  LayoutteacherCourseStudentsTestCourseTitleTestIdImport.update({
    id: '/students/test/$courseTitle/$testId',
    path: '/students/test/$courseTitle/$testId',
    getParentRoute: () => LayoutteacherCourseRoute,
  } as any)

const LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute =
  LayoutteacherCourseStudentsQuizCourseTitleQuizIdImport.update({
    id: '/students/quiz/$courseTitle/$quizId',
    path: '/students/quiz/$courseTitle/$quizId',
    getParentRoute: () => LayoutteacherCourseRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/login': {
      id: '/(auth)/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authLoginImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/signup': {
      id: '/(auth)/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof authSignupImport
      parentRoute: typeof rootRoute
    }
    '/_layout/profile': {
      id: '/_layout/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof LayoutProfileImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(admin)/addUser': {
      id: '/_layout/(admin)/addUser'
      path: '/addUser'
      fullPath: '/addUser'
      preLoaderRoute: typeof LayoutadminAddUserImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(admin)/dashboard': {
      id: '/_layout/(admin)/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof LayoutadminDashboardImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(student)/enrolled_ourses': {
      id: '/_layout/(student)/enrolled_ourses'
      path: '/enrolled_ourses'
      fullPath: '/enrolled_ourses'
      preLoaderRoute: typeof LayoutstudentEnrolledoursesImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(student)/note': {
      id: '/_layout/(student)/note'
      path: '/note'
      fullPath: '/note'
      preLoaderRoute: typeof LayoutstudentNoteImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(teacher)/course': {
      id: '/_layout/(teacher)/course'
      path: '/course'
      fullPath: '/course'
      preLoaderRoute: typeof LayoutteacherCourseImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(student)/enrolled_courses/$courseTitle': {
      id: '/_layout/(student)/enrolled_courses/$courseTitle'
      path: '/enrolled_courses/$courseTitle'
      fullPath: '/enrolled_courses/$courseTitle'
      preLoaderRoute: typeof LayoutstudentEnrolledcoursesCourseTitleImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(teacher)/course/$courseTitle': {
      id: '/_layout/(teacher)/course/$courseTitle'
      path: '/$courseTitle'
      fullPath: '/course/$courseTitle'
      preLoaderRoute: typeof LayoutteacherCourseCourseTitleImport
      parentRoute: typeof LayoutteacherCourseImport
    }
    '/_layout/(student)/enrolled_courses/': {
      id: '/_layout/(student)/enrolled_courses/'
      path: '/enrolled_courses'
      fullPath: '/enrolled_courses'
      preLoaderRoute: typeof LayoutstudentEnrolledcoursesIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(teacher)/course/': {
      id: '/_layout/(teacher)/course/'
      path: '/'
      fullPath: '/course/'
      preLoaderRoute: typeof LayoutteacherCourseIndexImport
      parentRoute: typeof LayoutteacherCourseImport
    }
    '/_layout/(teacher)/course/students/$courseTitle': {
      id: '/_layout/(teacher)/course/students/$courseTitle'
      path: '/students/$courseTitle'
      fullPath: '/course/students/$courseTitle'
      preLoaderRoute: typeof LayoutteacherCourseStudentsCourseTitleImport
      parentRoute: typeof LayoutteacherCourseImport
    }
    '/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId': {
      id: '/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId'
      path: '/enrolled_courses/quiz/$courseTitle/$quizId'
      fullPath: '/enrolled_courses/quiz/$courseTitle/$quizId'
      preLoaderRoute: typeof LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(student)/enrolled_courses/test/$courseTitle/$testId': {
      id: '/_layout/(student)/enrolled_courses/test/$courseTitle/$testId'
      path: '/enrolled_courses/test/$courseTitle/$testId'
      fullPath: '/enrolled_courses/test/$courseTitle/$testId'
      preLoaderRoute: typeof LayoutstudentEnrolledcoursesTestCourseTitleTestIdImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/(teacher)/course/quiz/$courseTitle/$quizId': {
      id: '/_layout/(teacher)/course/quiz/$courseTitle/$quizId'
      path: '/quiz/$courseTitle/$quizId'
      fullPath: '/course/quiz/$courseTitle/$quizId'
      preLoaderRoute: typeof LayoutteacherCourseQuizCourseTitleQuizIdImport
      parentRoute: typeof LayoutteacherCourseImport
    }
    '/_layout/(teacher)/course/test/$courseTitle/$testId': {
      id: '/_layout/(teacher)/course/test/$courseTitle/$testId'
      path: '/test/$courseTitle/$testId'
      fullPath: '/course/test/$courseTitle/$testId'
      preLoaderRoute: typeof LayoutteacherCourseTestCourseTitleTestIdImport
      parentRoute: typeof LayoutteacherCourseImport
    }
    '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId': {
      id: '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId'
      path: '/students/quiz/$courseTitle/$quizId'
      fullPath: '/course/students/quiz/$courseTitle/$quizId'
      preLoaderRoute: typeof LayoutteacherCourseStudentsQuizCourseTitleQuizIdImport
      parentRoute: typeof LayoutteacherCourseImport
    }
    '/_layout/(teacher)/course/students/test/$courseTitle/$testId': {
      id: '/_layout/(teacher)/course/students/test/$courseTitle/$testId'
      path: '/students/test/$courseTitle/$testId'
      fullPath: '/course/students/test/$courseTitle/$testId'
      preLoaderRoute: typeof LayoutteacherCourseStudentsTestCourseTitleTestIdImport
      parentRoute: typeof LayoutteacherCourseImport
    }
  }
}

// Create and export the route tree

interface LayoutteacherCourseRouteChildren {
  LayoutteacherCourseCourseTitleRoute: typeof LayoutteacherCourseCourseTitleRoute
  LayoutteacherCourseIndexRoute: typeof LayoutteacherCourseIndexRoute
  LayoutteacherCourseStudentsCourseTitleRoute: typeof LayoutteacherCourseStudentsCourseTitleRoute
  LayoutteacherCourseQuizCourseTitleQuizIdRoute: typeof LayoutteacherCourseQuizCourseTitleQuizIdRoute
  LayoutteacherCourseTestCourseTitleTestIdRoute: typeof LayoutteacherCourseTestCourseTitleTestIdRoute
  LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute: typeof LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute
  LayoutteacherCourseStudentsTestCourseTitleTestIdRoute: typeof LayoutteacherCourseStudentsTestCourseTitleTestIdRoute
}

const LayoutteacherCourseRouteChildren: LayoutteacherCourseRouteChildren = {
  LayoutteacherCourseCourseTitleRoute: LayoutteacherCourseCourseTitleRoute,
  LayoutteacherCourseIndexRoute: LayoutteacherCourseIndexRoute,
  LayoutteacherCourseStudentsCourseTitleRoute:
    LayoutteacherCourseStudentsCourseTitleRoute,
  LayoutteacherCourseQuizCourseTitleQuizIdRoute:
    LayoutteacherCourseQuizCourseTitleQuizIdRoute,
  LayoutteacherCourseTestCourseTitleTestIdRoute:
    LayoutteacherCourseTestCourseTitleTestIdRoute,
  LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute:
    LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute,
  LayoutteacherCourseStudentsTestCourseTitleTestIdRoute:
    LayoutteacherCourseStudentsTestCourseTitleTestIdRoute,
}

const LayoutteacherCourseRouteWithChildren =
  LayoutteacherCourseRoute._addFileChildren(LayoutteacherCourseRouteChildren)

interface LayoutRouteChildren {
  LayoutProfileRoute: typeof LayoutProfileRoute
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutadminAddUserRoute: typeof LayoutadminAddUserRoute
  LayoutadminDashboardRoute: typeof LayoutadminDashboardRoute
  LayoutstudentEnrolledoursesRoute: typeof LayoutstudentEnrolledoursesRoute
  LayoutstudentNoteRoute: typeof LayoutstudentNoteRoute
  LayoutteacherCourseRoute: typeof LayoutteacherCourseRouteWithChildren
  LayoutstudentEnrolledcoursesCourseTitleRoute: typeof LayoutstudentEnrolledcoursesCourseTitleRoute
  LayoutstudentEnrolledcoursesIndexRoute: typeof LayoutstudentEnrolledcoursesIndexRoute
  LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute: typeof LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute
  LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute: typeof LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutProfileRoute: LayoutProfileRoute,
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutadminAddUserRoute: LayoutadminAddUserRoute,
  LayoutadminDashboardRoute: LayoutadminDashboardRoute,
  LayoutstudentEnrolledoursesRoute: LayoutstudentEnrolledoursesRoute,
  LayoutstudentNoteRoute: LayoutstudentNoteRoute,
  LayoutteacherCourseRoute: LayoutteacherCourseRouteWithChildren,
  LayoutstudentEnrolledcoursesCourseTitleRoute:
    LayoutstudentEnrolledcoursesCourseTitleRoute,
  LayoutstudentEnrolledcoursesIndexRoute:
    LayoutstudentEnrolledcoursesIndexRoute,
  LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute:
    LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute,
  LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute:
    LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/about': typeof AboutRoute
  '/login': typeof authLoginRoute
  '/signup': typeof authSignupRoute
  '/profile': typeof LayoutProfileRoute
  '/': typeof LayoutIndexRoute
  '/addUser': typeof LayoutadminAddUserRoute
  '/dashboard': typeof LayoutadminDashboardRoute
  '/enrolled_ourses': typeof LayoutstudentEnrolledoursesRoute
  '/note': typeof LayoutstudentNoteRoute
  '/course': typeof LayoutteacherCourseRouteWithChildren
  '/enrolled_courses/$courseTitle': typeof LayoutstudentEnrolledcoursesCourseTitleRoute
  '/course/$courseTitle': typeof LayoutteacherCourseCourseTitleRoute
  '/enrolled_courses': typeof LayoutstudentEnrolledcoursesIndexRoute
  '/course/': typeof LayoutteacherCourseIndexRoute
  '/course/students/$courseTitle': typeof LayoutteacherCourseStudentsCourseTitleRoute
  '/enrolled_courses/quiz/$courseTitle/$quizId': typeof LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute
  '/enrolled_courses/test/$courseTitle/$testId': typeof LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute
  '/course/quiz/$courseTitle/$quizId': typeof LayoutteacherCourseQuizCourseTitleQuizIdRoute
  '/course/test/$courseTitle/$testId': typeof LayoutteacherCourseTestCourseTitleTestIdRoute
  '/course/students/quiz/$courseTitle/$quizId': typeof LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute
  '/course/students/test/$courseTitle/$testId': typeof LayoutteacherCourseStudentsTestCourseTitleTestIdRoute
}

export interface FileRoutesByTo {
  '/about': typeof AboutRoute
  '/login': typeof authLoginRoute
  '/signup': typeof authSignupRoute
  '/profile': typeof LayoutProfileRoute
  '/': typeof LayoutIndexRoute
  '/addUser': typeof LayoutadminAddUserRoute
  '/dashboard': typeof LayoutadminDashboardRoute
  '/enrolled_ourses': typeof LayoutstudentEnrolledoursesRoute
  '/note': typeof LayoutstudentNoteRoute
  '/enrolled_courses/$courseTitle': typeof LayoutstudentEnrolledcoursesCourseTitleRoute
  '/course/$courseTitle': typeof LayoutteacherCourseCourseTitleRoute
  '/enrolled_courses': typeof LayoutstudentEnrolledcoursesIndexRoute
  '/course': typeof LayoutteacherCourseIndexRoute
  '/course/students/$courseTitle': typeof LayoutteacherCourseStudentsCourseTitleRoute
  '/enrolled_courses/quiz/$courseTitle/$quizId': typeof LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute
  '/enrolled_courses/test/$courseTitle/$testId': typeof LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute
  '/course/quiz/$courseTitle/$quizId': typeof LayoutteacherCourseQuizCourseTitleQuizIdRoute
  '/course/test/$courseTitle/$testId': typeof LayoutteacherCourseTestCourseTitleTestIdRoute
  '/course/students/quiz/$courseTitle/$quizId': typeof LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute
  '/course/students/test/$courseTitle/$testId': typeof LayoutteacherCourseStudentsTestCourseTitleTestIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/about': typeof AboutRoute
  '/(auth)/login': typeof authLoginRoute
  '/(auth)/signup': typeof authSignupRoute
  '/_layout/profile': typeof LayoutProfileRoute
  '/_layout/': typeof LayoutIndexRoute
  '/_layout/(admin)/addUser': typeof LayoutadminAddUserRoute
  '/_layout/(admin)/dashboard': typeof LayoutadminDashboardRoute
  '/_layout/(student)/enrolled_ourses': typeof LayoutstudentEnrolledoursesRoute
  '/_layout/(student)/note': typeof LayoutstudentNoteRoute
  '/_layout/(teacher)/course': typeof LayoutteacherCourseRouteWithChildren
  '/_layout/(student)/enrolled_courses/$courseTitle': typeof LayoutstudentEnrolledcoursesCourseTitleRoute
  '/_layout/(teacher)/course/$courseTitle': typeof LayoutteacherCourseCourseTitleRoute
  '/_layout/(student)/enrolled_courses/': typeof LayoutstudentEnrolledcoursesIndexRoute
  '/_layout/(teacher)/course/': typeof LayoutteacherCourseIndexRoute
  '/_layout/(teacher)/course/students/$courseTitle': typeof LayoutteacherCourseStudentsCourseTitleRoute
  '/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId': typeof LayoutstudentEnrolledcoursesQuizCourseTitleQuizIdRoute
  '/_layout/(student)/enrolled_courses/test/$courseTitle/$testId': typeof LayoutstudentEnrolledcoursesTestCourseTitleTestIdRoute
  '/_layout/(teacher)/course/quiz/$courseTitle/$quizId': typeof LayoutteacherCourseQuizCourseTitleQuizIdRoute
  '/_layout/(teacher)/course/test/$courseTitle/$testId': typeof LayoutteacherCourseTestCourseTitleTestIdRoute
  '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId': typeof LayoutteacherCourseStudentsQuizCourseTitleQuizIdRoute
  '/_layout/(teacher)/course/students/test/$courseTitle/$testId': typeof LayoutteacherCourseStudentsTestCourseTitleTestIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/about'
    | '/login'
    | '/signup'
    | '/profile'
    | '/'
    | '/addUser'
    | '/dashboard'
    | '/enrolled_ourses'
    | '/note'
    | '/course'
    | '/enrolled_courses/$courseTitle'
    | '/course/$courseTitle'
    | '/enrolled_courses'
    | '/course/'
    | '/course/students/$courseTitle'
    | '/enrolled_courses/quiz/$courseTitle/$quizId'
    | '/enrolled_courses/test/$courseTitle/$testId'
    | '/course/quiz/$courseTitle/$quizId'
    | '/course/test/$courseTitle/$testId'
    | '/course/students/quiz/$courseTitle/$quizId'
    | '/course/students/test/$courseTitle/$testId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/about'
    | '/login'
    | '/signup'
    | '/profile'
    | '/'
    | '/addUser'
    | '/dashboard'
    | '/enrolled_ourses'
    | '/note'
    | '/enrolled_courses/$courseTitle'
    | '/course/$courseTitle'
    | '/enrolled_courses'
    | '/course'
    | '/course/students/$courseTitle'
    | '/enrolled_courses/quiz/$courseTitle/$quizId'
    | '/enrolled_courses/test/$courseTitle/$testId'
    | '/course/quiz/$courseTitle/$quizId'
    | '/course/test/$courseTitle/$testId'
    | '/course/students/quiz/$courseTitle/$quizId'
    | '/course/students/test/$courseTitle/$testId'
  id:
    | '__root__'
    | '/_layout'
    | '/about'
    | '/(auth)/login'
    | '/(auth)/signup'
    | '/_layout/profile'
    | '/_layout/'
    | '/_layout/(admin)/addUser'
    | '/_layout/(admin)/dashboard'
    | '/_layout/(student)/enrolled_ourses'
    | '/_layout/(student)/note'
    | '/_layout/(teacher)/course'
    | '/_layout/(student)/enrolled_courses/$courseTitle'
    | '/_layout/(teacher)/course/$courseTitle'
    | '/_layout/(student)/enrolled_courses/'
    | '/_layout/(teacher)/course/'
    | '/_layout/(teacher)/course/students/$courseTitle'
    | '/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId'
    | '/_layout/(student)/enrolled_courses/test/$courseTitle/$testId'
    | '/_layout/(teacher)/course/quiz/$courseTitle/$quizId'
    | '/_layout/(teacher)/course/test/$courseTitle/$testId'
    | '/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId'
    | '/_layout/(teacher)/course/students/test/$courseTitle/$testId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  AboutRoute: typeof AboutRoute
  authLoginRoute: typeof authLoginRoute
  authSignupRoute: typeof authSignupRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  AboutRoute: AboutRoute,
  authLoginRoute: authLoginRoute,
  authSignupRoute: authSignupRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/about",
        "/(auth)/login",
        "/(auth)/signup"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/profile",
        "/_layout/",
        "/_layout/(admin)/addUser",
        "/_layout/(admin)/dashboard",
        "/_layout/(student)/enrolled_ourses",
        "/_layout/(student)/note",
        "/_layout/(teacher)/course",
        "/_layout/(student)/enrolled_courses/$courseTitle",
        "/_layout/(student)/enrolled_courses/",
        "/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId",
        "/_layout/(student)/enrolled_courses/test/$courseTitle/$testId"
      ]
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/(auth)/login": {
      "filePath": "(auth)/login.tsx"
    },
    "/(auth)/signup": {
      "filePath": "(auth)/signup.tsx"
    },
    "/_layout/profile": {
      "filePath": "_layout/profile.tsx",
      "parent": "/_layout"
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/(admin)/addUser": {
      "filePath": "_layout/(admin)/addUser.tsx",
      "parent": "/_layout"
    },
    "/_layout/(admin)/dashboard": {
      "filePath": "_layout/(admin)/dashboard.tsx",
      "parent": "/_layout"
    },
    "/_layout/(student)/enrolled_ourses": {
      "filePath": "_layout/(student)/enrolled_ourses.tsx",
      "parent": "/_layout"
    },
    "/_layout/(student)/note": {
      "filePath": "_layout/(student)/note.tsx",
      "parent": "/_layout"
    },
    "/_layout/(teacher)/course": {
      "filePath": "_layout/(teacher)/course.tsx",
      "parent": "/_layout",
      "children": [
        "/_layout/(teacher)/course/$courseTitle",
        "/_layout/(teacher)/course/",
        "/_layout/(teacher)/course/students/$courseTitle",
        "/_layout/(teacher)/course/quiz/$courseTitle/$quizId",
        "/_layout/(teacher)/course/test/$courseTitle/$testId",
        "/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId",
        "/_layout/(teacher)/course/students/test/$courseTitle/$testId"
      ]
    },
    "/_layout/(student)/enrolled_courses/$courseTitle": {
      "filePath": "_layout/(student)/enrolled_courses.$courseTitle.tsx",
      "parent": "/_layout"
    },
    "/_layout/(teacher)/course/$courseTitle": {
      "filePath": "_layout/(teacher)/course.$courseTitle.tsx",
      "parent": "/_layout/(teacher)/course"
    },
    "/_layout/(student)/enrolled_courses/": {
      "filePath": "_layout/(student)/enrolled_courses.index.tsx",
      "parent": "/_layout"
    },
    "/_layout/(teacher)/course/": {
      "filePath": "_layout/(teacher)/course.index.tsx",
      "parent": "/_layout/(teacher)/course"
    },
    "/_layout/(teacher)/course/students/$courseTitle": {
      "filePath": "_layout/(teacher)/course.students.$courseTitle.tsx",
      "parent": "/_layout/(teacher)/course"
    },
    "/_layout/(student)/enrolled_courses/quiz/$courseTitle/$quizId": {
      "filePath": "_layout/(student)/enrolled_courses.quiz.$courseTitle.$quizId.tsx",
      "parent": "/_layout"
    },
    "/_layout/(student)/enrolled_courses/test/$courseTitle/$testId": {
      "filePath": "_layout/(student)/enrolled_courses.test.$courseTitle.$testId.tsx",
      "parent": "/_layout"
    },
    "/_layout/(teacher)/course/quiz/$courseTitle/$quizId": {
      "filePath": "_layout/(teacher)/course.quiz.$courseTitle.$quizId.tsx",
      "parent": "/_layout/(teacher)/course"
    },
    "/_layout/(teacher)/course/test/$courseTitle/$testId": {
      "filePath": "_layout/(teacher)/course.test.$courseTitle.$testId.tsx",
      "parent": "/_layout/(teacher)/course"
    },
    "/_layout/(teacher)/course/students/quiz/$courseTitle/$quizId": {
      "filePath": "_layout/(teacher)/course.students.quiz.$courseTitle.$quizId.tsx",
      "parent": "/_layout/(teacher)/course"
    },
    "/_layout/(teacher)/course/students/test/$courseTitle/$testId": {
      "filePath": "_layout/(teacher)/course.students.test.$courseTitle.$testId.tsx",
      "parent": "/_layout/(teacher)/course"
    }
  }
}
ROUTE_MANIFEST_END */
