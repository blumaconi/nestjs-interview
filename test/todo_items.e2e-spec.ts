import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { memoryStore } from '../src/shared/memory.store';

describe('TodoItems (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    memoryStore.todoItems.length = 0;
    memoryStore.todoLists.length = 0;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a todo item in the given list', async () => {
    await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Work' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'New task' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: 1,
      listId: 1,
      description: 'New task',
      completed: false,
    });
  });

  it('should mark a todo item as completed', async () => {
    await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Work' });

    const createResponse = await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'Task to complete' });

    const itemId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .patch(`/todolists/1/items/${itemId}/complete`)
      .expect(200);

    expect(response.body.completed).toBe(true);
  });

  it('should return all items for a given list', async () => {
    await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Work' });
    await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'Task 1' });
    await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'Task 2' });

    const response = await request(app.getHttpServer())
      .get('/todolists/1/items')
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].description).toBe('Task 1');
  });

  it('should update the description of an existing item', async () => {
    await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Work' });
    await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'Old Task' });

    const response = await request(app.getHttpServer())
      .put('/todolists/1/items/1')
      .send({ description: 'Updated Task' })
      .expect(200);

    expect(response.body.description).toBe('Updated Task');
  });

  it('should throw error when updating completed status via update endpoint', async () => {
    await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Work' });
    await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'Task' });

    const response = await request(app.getHttpServer())
      .put('/todolists/1/items/1')
      .send({ description: 'Still task', completed: true });

    expect(response.status).toBe(500);
  });

  it('should delete an item by id', async () => {
    await request(app.getHttpServer())
      .post('/api/todolists')
      .send({ name: 'Work' });
    await request(app.getHttpServer())
      .post('/todolists/1/items')
      .send({ description: 'To delete' });

    await request(app.getHttpServer())
      .delete('/todolists/1/items/1')
      .expect(200);

    const response = await request(app.getHttpServer()).get(
      '/todolists/1/items',
    );
    expect(response.body).toHaveLength(0);
  });

  it('should respond with 500 if item to complete does not exist', async () => {
    await request(app.getHttpServer())
      .patch('/todolists/1/items/999/complete')
      .expect(500);
  });
});
