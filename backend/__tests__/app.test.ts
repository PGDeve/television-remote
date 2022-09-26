import request from 'supertest';
import app from '../services/express';


describe('Express routes', () => {
    test('should respond 200 at /remote/nextChannel', async () => {
        await request(app)
            .get('/remote/nextChannel')
            .expect(200);
    });

    test('should respond 200 at /remote/previousChannel', async () => {
        await request(app)
            .get('/remote/previousChannel')
            .expect(200);
    });

    test('should respond 404 at /remote/not-exists', async () => {
        await request(app)
            .get('/remote/not-exists')
            .expect(404);
    });

    test('should respond 404 at /not-exists', async () => {
        await request(app)
            .get('/not-exists')
            .expect(404);
    });
});
