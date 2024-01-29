import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const handleConnectDB = async () => {
  try {
    const conectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongodB connected !! DB HOST: ${conectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('MongodB connecting faild', error);
    process.exit(1);
  }
};

export default handleConnectDB;
