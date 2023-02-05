# PERN Stack

This repository includes the following:

- A Monorepo governed by Yarn Workspaces.
- An Express app in `packages/api`.
  - The Express app has persistence through a Postgres Database (Prisma as ORM).
- A React app in `packages/ui`.
  - The React app has routing and communicates with the Express App.

## Local Dev

1. Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Node](https://nodejs.org/en/download/package-manager/), [Yarn](https://classic.yarnpkg.com/en/), [Docker](https://docs.docker.com/desktop/#download-and-install).

2. Clone this repository


3. Add a `packages/ui/.env` file:

    ```text
    VITE_RUN_MODE=local
    VITE_LOC_BASE_URL=http://localhost:5050
    VITE_USER_USERNAME=user-1
    VITE_USER_PASSWORD=user-1
    VITE_ADMIN_USERNAME=admin-1
    VITE_ADMIN_PASSWORD=admin-1
    ```

4. Add a `packages/api/.env` file:

    ```text
    DEBUG=demo:*
    NODE_ENV=local
    HOST_PORT=5432
    DATABASE_URL="postgresql://prisma:prisma@127.0.0.1:${HOST_PORT}/demo-local"
    JWT_SECRET="use-any-passphrase"
    ```

5. Add a `packages/api/.env.test` file:

    ```text
    DEBUG=none
    NODE_OPTIONS=--experimental-vm-modules
    NODE_ENV=test
    HOST_PORT=5432
    DATABASE_URL="postgresql://prisma:prisma@127.0.0.1:${HOST_PORT}/demo-test"
    JWT_SECRET="use-any-passphrase"
    ```

6. Open your terminal. Change the directory to where you cloned this repository. Run `yarn` in the terminal and it will install all the dependencies. 

7. Then, run `yarn dev` and it will run both server and client apps. 

You should be able to access the frontend (UI) at http://localhost:5173/. (The backend API server will be accessible at http://localhost:5050/)

## Task

Please see [this short video] that described your task.

When starting a new coding project, it is important to focus on understanding the frameworks and libraries used in order to complete the task. You may not need to understand every line of code, but having a basic understanding of the tools available to you will help you to get the job done more quickly and efficiently.

Starting a new coding project can be intimidating, but it’s important to remember that you don’t need to understand every line of code in order to complete the task. Focus on understanding what you need to know to get the job done and don't get overwhelmed by details that may not be necessary. 

It is helpful to know the frameworks and libraries used in this demo application. You do not need to learn every one, but having a basic understanding of the tools available to you will help you to get the job done more quickly and efficiently.
