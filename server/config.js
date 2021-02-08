
require('dotenv').config();  



let config={
  // host: process.env.HOST,  
  // port:process.env.PORT,
  // user:process.env.DB_ADMIN_USERNAME,  
  // password: process.env.DB_ADMIN_PASSWORD ,
  // database:process.env.DATABASE,
  jwt_secret: process.env.JWT_SECRET,
   dbConnectionString: {
    connection: {
      host: process.env.HOST,
      user: process.env.DB_ADMIN_USERNAME,
      password: process.env.DB_ADMIN_PASSWORD,
      database: process.env.DATABASE,
      dateStrings: true,
    },
  }
  
}


module.exports=config;


