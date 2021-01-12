const dotenv = require('dotenv');


// load env configuration as early as possible
dotenv.config({
    path: '.env'
});


const APP_NAME = 'Buzzrom';
const {
    PORT,
    MONGODB_PROD_URI,
    JWT_SECRET_KEY,
    MONGODB_DEV_URI,
    TWITTER_CONSUMER_KEY,
    SENDGRID_KEY,
    NODE_ENV = 'development',
} = process.env



module.exports = {
    applicationName: APP_NAME,
    port: PORT,
    mongodb: {
        dsn:MONGODB_PROD_URI,   //NODE_ENV === 'production' ? MONGODB_PROD_URI// : MONGODB_LOCAL_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            autoIndex: false,
        },
    },
    JWT_SECRET_KEY,
    SENDGRID_KEY,
    production: NODE_ENV === 'production',
};