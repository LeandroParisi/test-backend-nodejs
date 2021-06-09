const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017';
const url = 'http://localhost:3000';
const invalidId = 99999;

const mockedProductOne = {
  name: 'Caneca 2',
  quantity: 2,
  description: 'Uma caneca comum',
  price: 'R$ 2,50',
  category: 'cozinha'
};

const mockedProductTwo = {
  name: 'Lapiseira',
  quantity: 2,
  description: 'Uma lapiseira comum',
  price: 'R$ 2,50',
  category: 'escritório'
};

const mockedProductThree = {
  name: 'Testes',
  quantity: -1,
  description: 'Uma lapiseira comum',
  price: 'R$ 2,50',
  category: 'escritório'
};

describe('Cadastro de produtos', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const myobj = { ...mockedProductOne };
    await db.collection('products').insertOne(myobj);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível criar um produto com o nome menor que 5 caracteres', async () => {
    await frisby
      .post(`${url}/products/`, {
        ...mockedProductTwo,
        name: 'Tes'
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"name" length must be at least 5 characters long');
      });
  });

  it('Será validado que não é possível criar um produto com o mesmo nomede outro já existente', async () => {
    await frisby
      .post(`${url}/products/`, {
        ...mockedProductOne
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('Product already exists');
      });
  });

  it('Será validado que não é possível criar um produto com quantidade menor que zero', async () => {
    await frisby
      .post(`${url}/products`, {
        ...mockedProductThree
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"quantity" must be larger than or equal to 1');
      });
  });

  it('Será validado que não é possível criar um produto com quantidade igual a zero', async () => {
    await frisby
      .post(`${url}/products`, {
        ...mockedProductThree,
        quantity: 0
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"quantity" must be larger than or equal to 1');
      });
  });

  it('Será validado que não é possível criar um produto com uma string no campo quantidade', async () => {
    await frisby
      .post(`${url}/products`, {
        ...mockedProductThree,
        quantity: 'string',
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"quantity" must be a number');
      });
  });

  it('Será validado que é possível criar um produto com sucesso', async () => {
    await frisby
      .post(`${url}/products`, {
        ...mockedProductOne,
        name: 'Caneca 3'
      })
      .expect('status', 201)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const productName = body.name;
        const quantityProduct = body.quantity;
        expect(productName).toEqual('Caneca 3');
        expect(quantityProduct).toEqual(2);
      });
  });
});

describe('Listar os produtos', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [{ name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 }];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que todos produtos estão sendo retornados', async () => {
    await frisby
      .get(`${url}/products`)
      .expect('status', 200)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const firstProductName = body.products[0].name;
        const firstQuantityProduct = body.products[0].quantity;
        const secondProductName = body.products[1].name;
        const secondQuantityProduct = body.products[1].quantity;
        const thirdProductName = body.products[2].name;
        const thirdQuantityProduct = body.products[2].quantity;

        expect(firstProductName).toEqual('Martelo de Thor');
        expect(firstQuantityProduct).toEqual(10);
        expect(secondProductName).toEqual('Traje de encolhimento');
        expect(secondQuantityProduct).toEqual(20);
        expect(thirdProductName).toEqual('Escudo do Capitão América');
        expect(thirdQuantityProduct).toEqual(30);
      });
  });

  it('Será validado que não é possível listar um produto que não existe', async () => {
    await frisby.get(`${url}/products/${invalidId}`)
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const error = json.err.code;
        const { message } = json.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('Wrong id format');
      });
  });

  it('Será validado que é possível listar um determinado produto', async () => {
    let result;

    await frisby
      .post(`${url}/products`, {
        ...mockedProductOne
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseProductId = result._id;
      });

    await frisby.get(`${url}/products/${responseProductId}`)
      .expect('status', 200)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const productName = json.name;
        const quantityProduct = json.quantity;
        expect(productName).toEqual('Caneca 2');
        expect(quantityProduct).toEqual(2);
      });
  });
});
