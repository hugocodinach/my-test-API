
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../index';

chai.use(chaiHttp);

export const requester = chai.request(app).keepOpen();