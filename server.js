import App from '@/app';

const app = new App();
app.listenStart(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');